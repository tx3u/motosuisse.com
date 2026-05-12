import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Number of top-viewed motorcycles returned in {@link getMotosStats}. */
const TOP_VIEWED_LIMIT = 10;

/** Number of daily data-points returned in the views timeline. */
const TIMELINE_DAYS = 30;

/**
 * Aggregates analytics data for the admin statistics dashboard.
 *
 * All queries are read-only and require JWT auth at the controller level.
 */
@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns high-level inventory counts and the top-viewed listings.
   *
   * Runs four Prisma queries in parallel via `Promise.all` to minimise
   * response latency.
   *
   * @returns Object containing total/available/sold counts and a ranked list
   *   of the {@link TOP_VIEWED_LIMIT} most-viewed motorcycles.
   */
  async getMotosStats() {
    const [total, disponibles, vendues, topViewed] = await Promise.all([
      this.prisma.moto.count(),
      this.prisma.moto.count({ where: { statut: 'disponible' } }),
      this.prisma.moto.count({ where: { statut: 'vendu' } }),
      this.prisma.moto.findMany({
        take: TOP_VIEWED_LIMIT,
        orderBy: { vues: { _count: 'desc' } },
        select: {
          id: true,
          marque: true,
          modele: true,
          annee: true,
          slug: true,
          _count: { select: { vues: true } },
        },
      }),
    ]);

    return { total, disponibles, vendues, topViewed };
  }

  /**
   * Returns a daily view-count timeline grouped by date.
   *
   * Results span the last {@link TIMELINE_DAYS} days, ordered chronologically.
   * When `motoId` is provided only that motorcycle's views are included;
   * otherwise all motorcycles are aggregated together.
   *
   * @param motoId - Optional motorcycle ID to scope the timeline.
   * @returns Array of `{ date, _sum: { count } }` objects.
   */
  getViewsTimeline(motoId?: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - TIMELINE_DAYS);
    cutoff.setUTCHours(0, 0, 0, 0);
    return this.prisma.vue.groupBy({
      by: ['date'],
      where: {
        ...(motoId ? { motoId } : {}),
        date: { gte: cutoff },
      },
      _sum: { count: true },
      orderBy: { date: 'asc' },
    });
  }
}
