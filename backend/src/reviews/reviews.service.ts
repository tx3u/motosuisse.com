import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

/**
 * Manages customer reviews.
 *
 * Reviews can be created by admins (e.g. manually entered from a verbal
 * testimonial), toggled between visible/hidden, and deleted.  Only visible
 * reviews are exposed on the public homepage.
 */
@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new review. Newly created reviews are visible by default
   * (controlled by the DB schema default).
   *
   * @param dto - Validated review payload.
   */
  create(dto: CreateReviewDto) {
    return this.prisma.review.create({ data: dto });
  }

  /**
   * Returns all reviews ordered by most recent first.
   * Intended for the admin dashboard — includes hidden reviews.
   */
  findAll() {
    return this.prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
  }

  /**
   * Returns only visible reviews for the public homepage.
   * Ordered by most recent first.
   */
  findVisible() {
    return this.prisma.review.findMany({
      where: { visible: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Toggles the `visible` flag on a review.
   *
   * A `findUnique` is required here (unlike remove) because we need the
   * current value to invert it — an atomic toggle is not directly expressible
   * in Prisma without a raw query.
   *
   * @param id - Review primary key.
   * @throws {NotFoundException} If no review with the given ID exists.
   */
  async toggleVisibility(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Avis introuvable');
    return this.prisma.review.update({
      where: { id },
      data: { visible: !review.visible },
    });
  }

  /**
   * Permanently deletes a review.
   *
   * Uses a try/catch on the Prisma P2025 error code instead of a pre-flight
   * `findUnique` to avoid two round-trips on the happy path (TOCTOU pattern).
   *
   * @param id - Review primary key.
   * @throws {NotFoundException} If no review with the given ID exists.
   */
  async remove(id: number) {
    try {
      await this.prisma.review.delete({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException('Avis introuvable');
      }
      throw e;
    }
    return { message: 'Avis supprimé.' };
  }
}
