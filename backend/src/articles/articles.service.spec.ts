import { ConflictException, NotFoundException } from '@nestjs/common';
import { ArticlesService } from './articles.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPrisma = {
  article: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeArticle = (overrides = {}) => ({
  id: 1,
  titre: 'Comment entretenir votre moto',
  slug: 'comment-entretenir-votre-moto',
  contenu: '<p>Contenu de l\'article</p>',
  image_couverture: null,
  statut: 'publie' as const,
  meta_title: null,
  meta_description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ArticlesService', () => {
  let service: ArticlesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ArticlesService(mockPrisma as never);
  });

  // ── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns only published articles for the public view', async () => {
      mockPrisma.article.findMany.mockResolvedValue([makeArticle()]);

      await service.findAll(false);

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { statut: 'publie' },
        }),
      );
    });

    it('returns all articles (including drafts) for the admin view', async () => {
      mockPrisma.article.findMany.mockResolvedValue([makeArticle(), makeArticle({ statut: 'brouillon' })]);

      await service.findAll(true);

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('selects only list-level fields (not full contenu)', async () => {
      mockPrisma.article.findMany.mockResolvedValue([]);

      await service.findAll(false);

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({ id: true, titre: true, slug: true }),
        }),
      );
    });
  });

  // ── findBySlug ─────────────────────────────────────────────────────────────

  describe('findBySlug', () => {
    it('returns the full article when the slug matches', async () => {
      const article = makeArticle();
      mockPrisma.article.findUnique.mockResolvedValue(article);

      const result = await service.findBySlug('comment-entretenir-votre-moto');

      expect(result).toEqual(article);
    });

    it('throws NotFoundException when no article matches the slug', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('unknown-slug')).rejects.toThrow(NotFoundException);
    });
  });

  // ── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    const dto = { titre: 'Mon premier article', contenu: '<p>Hello</p>' };

    it('generates a URL-safe slug from the titre', async () => {
      mockPrisma.article.count.mockResolvedValue(0);
      mockPrisma.article.create.mockResolvedValue(makeArticle({ slug: 'mon-premier-article' }));

      await service.create(dto);

      expect(mockPrisma.article.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ slug: 'mon-premier-article' }),
        }),
      );
    });

    it('appends a numeric suffix when the base slug already exists', async () => {
      // resolveSlug uses findUnique: base exists → -2 exists → -3 free
      mockPrisma.article.findUnique
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 })
        .mockResolvedValueOnce(null);
      mockPrisma.article.create.mockResolvedValue(makeArticle({ slug: 'mon-premier-article-3' }));

      await service.create(dto);

      expect(mockPrisma.article.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ slug: 'mon-premier-article-3' }),
        }),
      );
    });

    it('throws ConflictException on P2002 DB constraint violation', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);
      mockPrisma.article.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('re-throws unexpected create errors unchanged', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);
      mockPrisma.article.create.mockRejectedValue(new Error('DB connection lost'));

      await expect(service.create(dto)).rejects.toThrow('DB connection lost');
    });

    it('handles accented characters and spaces in the titre', async () => {
      mockPrisma.article.count.mockResolvedValue(0);
      mockPrisma.article.create.mockResolvedValue(makeArticle());

      await service.create({ titre: 'Conseils d\'entretien été', contenu: '...' });

      const createCall = mockPrisma.article.create.mock.calls[0][0];
      const slug: string = createCall.data.slug;
      // Should be lowercase, no accents, no apostrophes
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  // ── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates the article when it exists', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(makeArticle());
      mockPrisma.article.update.mockResolvedValue(makeArticle({ titre: 'Titre modifié' }));

      const result = await service.update(1, { titre: 'Titre modifié' });

      expect(mockPrisma.article.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { titre: 'Titre modifié' },
      });
      expect(result.titre).toBe('Titre modifié');
    });

    it('throws NotFoundException when article does not exist', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);

      await expect(service.update(99, { titre: 'x' })).rejects.toThrow(NotFoundException);
      expect(mockPrisma.article.update).not.toHaveBeenCalled();
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes the article when it exists', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(makeArticle());
      mockPrisma.article.delete.mockResolvedValue(makeArticle());

      await service.remove(1);

      expect(mockPrisma.article.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('throws NotFoundException when article does not exist', async () => {
      mockPrisma.article.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(mockPrisma.article.delete).not.toHaveBeenCalled();
    });
  });
});
