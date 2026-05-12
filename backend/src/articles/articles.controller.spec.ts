import { ArticlesController } from './articles.controller';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ArticlesController', () => {
  let controller: ArticlesController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ArticlesController(mockService as never);
  });

  it('findAll calls service with includeAdmin=false', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalledWith(false);
  });

  it('findAllAdmin calls service with includeAdmin=true', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAllAdmin();
    expect(mockService.findAll).toHaveBeenCalledWith(true);
  });

  it('findById delegates id to service', async () => {
    const article = { id: 5, titre: 'Test' };
    mockService.findById.mockResolvedValue(article);
    expect(await controller.findById(5)).toBe(article);
    expect(mockService.findById).toHaveBeenCalledWith(5);
  });

  it('findOne delegates slug to service', async () => {
    const article = { id: 1, slug: 'test-article' };
    mockService.findBySlug.mockResolvedValue(article);
    expect(await controller.findOne('test-article')).toBe(article);
    expect(mockService.findBySlug).toHaveBeenCalledWith('test-article');
  });

  it('create delegates dto to service', async () => {
    const dto = { titre: 'Nouveau titre', contenu: '<p>Contenu</p>' };
    const article = { id: 1, ...dto };
    mockService.create.mockResolvedValue(article);
    expect(await controller.create(dto as never)).toBe(article);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update passes id and dto to service', async () => {
    const dto = { titre: 'Titre modifié' };
    const article = { id: 1, titre: 'Titre modifié' };
    mockService.update.mockResolvedValue(article);
    expect(await controller.update(1, dto as never)).toBe(article);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
  });

  it('remove delegates id to service', async () => {
    mockService.remove.mockResolvedValue(undefined);
    await controller.remove(1);
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});
