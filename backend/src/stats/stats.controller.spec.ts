import { StatsController } from './stats.controller';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockService = {
  getMotosStats: jest.fn(),
  getViewsTimeline: jest.fn(),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('StatsController', () => {
  let controller: StatsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new StatsController(mockService as never);
  });

  // ── getMotosStats ──────────────────────────────────────────────────────────

  it('getMotosStats delegates to service', async () => {
    const result = { total: 10, disponibles: 7, vendues: 3, topViewed: [] };
    mockService.getMotosStats.mockResolvedValue(result);

    expect(await controller.getMotosStats()).toBe(result);
    expect(mockService.getMotosStats).toHaveBeenCalledTimes(1);
  });

  // ── getViews ───────────────────────────────────────────────────────────────

  it('getViews without motoId queries global timeline', async () => {
    const timeline = [{ date: '2024-01-01', _sum: { count: 5 } }];
    mockService.getViewsTimeline.mockResolvedValue(timeline);

    expect(await controller.getViews(undefined)).toBe(timeline);
    expect(mockService.getViewsTimeline).toHaveBeenCalledWith(undefined);
  });

  it('getViews with motoId scopes query to that moto', async () => {
    const timeline = [{ date: '2024-01-01', _sum: { count: 3 } }];
    mockService.getViewsTimeline.mockResolvedValue(timeline);

    expect(await controller.getViews(42)).toBe(timeline);
    expect(mockService.getViewsTimeline).toHaveBeenCalledWith(42);
  });
});
