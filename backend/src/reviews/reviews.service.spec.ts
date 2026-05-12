import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ReviewsService } from './reviews.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPrisma = {
  review: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeReview = (overrides = {}) => ({
  id: 1,
  nom: 'Marie',
  ville: 'Lausanne',
  moto: 'Honda CB500F 2020',
  note: 5,
  texte: 'Très bon service !',
  visible: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReviewsService(mockPrisma as never);
  });

  // ── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates a review with the provided data', async () => {
      const dto = { nom: 'Marie', note: 5, texte: 'Top !' };
      mockPrisma.review.create.mockResolvedValue(makeReview());

      await service.create(dto);

      expect(mockPrisma.review.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  // ── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all reviews including hidden ones, ordered by newest first', async () => {
      const reviews = [makeReview({ id: 2 }), makeReview({ id: 1, visible: false })];
      mockPrisma.review.findMany.mockResolvedValue(reviews);

      const result = await service.findAll();

      expect(result).toEqual(reviews);
      expect(mockPrisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
      );
      // No visibility filter — admin sees everything
      const call = mockPrisma.review.findMany.mock.calls[0][0];
      expect(call.where).toBeUndefined();
    });
  });

  // ── findVisible ────────────────────────────────────────────────────────────

  describe('findVisible', () => {
    it('returns only visible reviews for the public homepage', async () => {
      const visible = [makeReview()];
      mockPrisma.review.findMany.mockResolvedValue(visible);

      const result = await service.findVisible();

      expect(result).toEqual(visible);
      expect(mockPrisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { visible: true } }),
      );
    });
  });

  // ── toggleVisibility ───────────────────────────────────────────────────────

  describe('toggleVisibility', () => {
    it('sets visible to false when review is currently visible', async () => {
      mockPrisma.review.findUnique.mockResolvedValue(makeReview({ visible: true }));
      mockPrisma.review.update.mockResolvedValue(makeReview({ visible: false }));

      const result = await service.toggleVisibility(1);

      expect(mockPrisma.review.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { visible: false },
      });
      expect(result.visible).toBe(false);
    });

    it('sets visible to true when review is currently hidden', async () => {
      mockPrisma.review.findUnique.mockResolvedValue(makeReview({ visible: false }));
      mockPrisma.review.update.mockResolvedValue(makeReview({ visible: true }));

      await service.toggleVisibility(1);

      expect(mockPrisma.review.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { visible: true },
      });
    });

    it('throws NotFoundException when review does not exist', async () => {
      mockPrisma.review.findUnique.mockResolvedValue(null);

      await expect(service.toggleVisibility(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes the review and returns a confirmation', async () => {
      mockPrisma.review.delete.mockResolvedValue(makeReview());

      const result = await service.remove(1);

      expect(mockPrisma.review.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Avis supprimé.' });
    });

    it('throws NotFoundException when record does not exist (P2025)', async () => {
      const err = new Prisma.PrismaClientKnownRequestError('Not found', {
        code: 'P2025',
        clientVersion: '5.0.0',
      });
      mockPrisma.review.delete.mockRejectedValue(err);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('re-throws unexpected Prisma errors unchanged', async () => {
      const err = new Error('DB unavailable');
      mockPrisma.review.delete.mockRejectedValue(err);

      await expect(service.remove(1)).rejects.toThrow('DB unavailable');
    });
  });
});
