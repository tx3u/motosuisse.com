import { StatsService } from './stats.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPrisma = {
  moto: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  vue: {
    groupBy: jest.fn(),
  },
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new StatsService(mockPrisma as never);
  });

  // ── getMotosStats ──────────────────────────────────────────────────────────

  describe('getMotosStats', () => {
    it('returns inventory counts and top-viewed listings', async () => {
      const topViewed = [
        { id: 1, slug: 'honda-cb500f-2020', marque: 'Honda', modele: 'CB500F', annee: 2020, _count: { vues: 42 } },
      ];
      // count is called 3 times: total, disponibles, vendues
      mockPrisma.moto.count
        .mockResolvedValueOnce(10)  // total
        .mockResolvedValueOnce(7)   // disponibles
        .mockResolvedValueOnce(3);  // vendues
      mockPrisma.moto.findMany.mockResolvedValue(topViewed);

      const result = await service.getMotosStats();

      expect(result).toEqual({ total: 10, disponibles: 7, vendues: 3, topViewed });
    });

    it('runs all four queries in parallel', async () => {
      const started: string[] = [];
      mockPrisma.moto.count.mockImplementation(() => {
        started.push('count');
        return Promise.resolve(0);
      });
      mockPrisma.moto.findMany.mockImplementation(() => {
        started.push('findMany');
        return Promise.resolve([]);
      });

      await service.getMotosStats();

      // All 4 calls (3× count + 1× findMany) should have been initiated before any resolved
      expect(started).toHaveLength(4);
    });

    it('returns topViewed limited to 10 results', async () => {
      mockPrisma.moto.count.mockResolvedValue(0);
      mockPrisma.moto.findMany.mockResolvedValue([]);

      await service.getMotosStats();

      expect(mockPrisma.moto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10 }),
      );
    });
  });

  // ── getViewsTimeline ───────────────────────────────────────────────────────

  describe('getViewsTimeline', () => {
    it('queries the last 30 days ordered by date ascending', async () => {
      const timeline = [
        { date: '2024-01-01', _sum: { count: 5 } },
        { date: '2024-01-02', _sum: { count: 12 } },
      ];
      mockPrisma.vue.groupBy.mockResolvedValue(timeline);

      const result = await service.getViewsTimeline();

      expect(result).toEqual(timeline);
      expect(mockPrisma.vue.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          by: ['date'],
          _sum: { count: true },
          orderBy: { date: 'asc' },
          where: expect.objectContaining({ date: { gte: expect.any(Date) } }),
        }),
      );
    });

    it('scopes the query to a specific moto when motoId is provided', async () => {
      mockPrisma.vue.groupBy.mockResolvedValue([]);

      await service.getViewsTimeline(42);

      expect(mockPrisma.vue.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ motoId: 42 }) }),
      );
    });

    it('omits motoId from where clause when no motoId is provided', async () => {
      mockPrisma.vue.groupBy.mockResolvedValue([]);

      await service.getViewsTimeline();

      const call = mockPrisma.vue.groupBy.mock.calls[0][0] as { where: Record<string, unknown> };
      expect(call.where).not.toHaveProperty('motoId');
      expect(call.where).toHaveProperty('date');
    });
  });
});
