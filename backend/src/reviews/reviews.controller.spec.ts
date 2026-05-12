import { ReviewsController } from './reviews.controller';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockService = {
  findVisible: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  toggleVisibility: jest.fn(),
  remove: jest.fn(),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ReviewsController', () => {
  let controller: ReviewsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ReviewsController(mockService as never);
  });

  it('findVisible returns only published reviews (public)', async () => {
    const result = [{ id: 1, visible: true }];
    mockService.findVisible.mockResolvedValue(result);

    expect(await controller.findVisible()).toBe(result);
    expect(mockService.findVisible).toHaveBeenCalledTimes(1);
  });

  it('findAll returns all reviews including hidden (admin)', async () => {
    const result = [{ id: 1, visible: true }, { id: 2, visible: false }];
    mockService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
    expect(mockService.findAll).toHaveBeenCalledTimes(1);
  });

  it('create delegates dto to service', async () => {
    const dto = { nom: 'Jean', note: 5, texte: 'Excellent service' };
    const result = { id: 1, ...dto };
    mockService.create.mockResolvedValue(result);

    expect(await controller.create(dto as never)).toBe(result);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('toggleVisibility delegates id to service', async () => {
    const result = { id: 1, visible: false };
    mockService.toggleVisibility.mockResolvedValue(result);

    expect(await controller.toggleVisibility(1)).toBe(result);
    expect(mockService.toggleVisibility).toHaveBeenCalledWith(1);
  });

  it('remove delegates id to service', async () => {
    mockService.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});
