import { ServicesController } from './services.controller';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ServicesController', () => {
  let controller: ServicesController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ServicesController(mockService as never);
  });

  it('findAll delegates to service', async () => {
    const result = [{ id: 1, titre: 'Pose de stickers' }];
    mockService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
    expect(mockService.findAll).toHaveBeenCalledTimes(1);
  });

  it('findOne delegates id to service', async () => {
    const result = { id: 1, titre: 'Pose de stickers' };
    mockService.findOne.mockResolvedValue(result);

    expect(await controller.findOne(1)).toBe(result);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('create delegates dto to service', async () => {
    const dto = { titre: 'Pose de stickers', description: 'Service de pose' };
    const result = { id: 1, ...dto };
    mockService.create.mockResolvedValue(result);

    expect(await controller.create(dto as never)).toBe(result);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update passes id and dto to service', async () => {
    const dto = { titre: 'Nouveau titre' };
    const result = { id: 1, titre: 'Nouveau titre' };
    mockService.update.mockResolvedValue(result);

    expect(await controller.update(1, dto as never)).toBe(result);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
  });

  it('remove delegates id to service', async () => {
    mockService.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});
