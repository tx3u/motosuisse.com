import { MotosController, imageFileFilter } from './motos.controller';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockService = {
  findAll: jest.fn(),
  findBySlugAdmin: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  addImage: jest.fn(),
  removeImage: jest.fn(),
  remove: jest.fn(),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('MotosController', () => {
  let controller: MotosController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new MotosController(mockService as never);
  });

  it('findAll delegates to service with filters', async () => {
    const filters = { page: 1, limit: 12 };
    const result = { data: [], total: 0, page: 1, limit: 12 };
    mockService.findAll.mockResolvedValue(result);

    expect(await controller.findAll(filters as never)).toBe(result);
    expect(mockService.findAll).toHaveBeenCalledWith(filters);
  });

  it('findOneAdmin delegates to service (no view increment)', async () => {
    const moto = { id: 1, slug: 'honda-cb500f-2020' };
    mockService.findBySlugAdmin.mockResolvedValue(moto);

    expect(await controller.findOneAdmin('honda-cb500f-2020')).toBe(moto);
    expect(mockService.findBySlugAdmin).toHaveBeenCalledWith('honda-cb500f-2020');
  });

  it('findOne delegates to service (increments view)', async () => {
    const moto = { id: 1, slug: 'honda-cb500f-2020' };
    mockService.findBySlug.mockResolvedValue(moto);

    expect(await controller.findOne('honda-cb500f-2020')).toBe(moto);
    expect(mockService.findBySlug).toHaveBeenCalledWith('honda-cb500f-2020');
  });

  it('create delegates dto to service', async () => {
    const dto = { marque: 'Honda', modele: 'CB500F', annee: 2020, kilometrage: 5000, prix: 5500 };
    const moto = { id: 1, ...dto };
    mockService.create.mockResolvedValue(moto);

    expect(await controller.create(dto as never)).toBe(moto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update passes id and dto to service', async () => {
    const dto = { prix: 6000 };
    const moto = { id: 1, prix: '6000.00' };
    mockService.update.mockResolvedValue(moto);

    expect(await controller.update(1, dto as never)).toBe(moto);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
  });

  it('addImage passes buffer from multer file to service', async () => {
    const buffer = Buffer.from('fake-image');
    const file = { buffer } as Express.Multer.File;
    const result = { id: 1, images: ['https://cdn.example.com/img.jpg'] };
    mockService.addImage.mockResolvedValue(result);

    expect(await controller.addImage(1, file)).toBe(result);
    expect(mockService.addImage).toHaveBeenCalledWith(1, buffer);
  });

  it('removeImage passes url from body to service', async () => {
    const dto = { url: 'https://cdn.example.com/img.jpg' };
    const result = { id: 1, images: [] };
    mockService.removeImage.mockResolvedValue(result);

    expect(await controller.removeImage(1, dto)).toBe(result);
    expect(mockService.removeImage).toHaveBeenCalledWith(1, dto.url);
  });

  it('remove delegates id to service', async () => {
    mockService.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(mockService.remove).toHaveBeenCalledWith(1);
  });

  // ── imageFileFilter ────────────────────────────────────────────────────────

  describe('imageFileFilter', () => {
    it('accepts image/* mime types', () => {
      const cb = jest.fn();
      imageFileFilter(null, { mimetype: 'image/jpeg' } as never, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('rejects non-image mime types with an error', () => {
      const cb = jest.fn();
      imageFileFilter(null, { mimetype: 'application/pdf' } as never, cb);
      expect(cb).toHaveBeenCalledWith(expect.any(Error), false);
    });
  });
});
