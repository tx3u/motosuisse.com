import { NotFoundException } from '@nestjs/common';
import { ServicesService } from './services.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPrisma = {
  service: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeService = (overrides = {}) => ({
  id: 1,
  titre: 'Pose de stickers',
  description: 'Application de films et stickers personnalisés.',
  prix_indicatif: '80.00',
  image: null,
  actif: true,
  ordre: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ServicesService', () => {
  let svc: ServicesService;

  beforeEach(() => {
    jest.clearAllMocks();
    svc = new ServicesService(mockPrisma as never);
  });

  // ── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all services sorted by ordre ascending', async () => {
      const services = [makeService({ ordre: 0 }), makeService({ id: 2, ordre: 1 })];
      mockPrisma.service.findMany.mockResolvedValue(services);

      const result = await svc.findAll();

      expect(result).toEqual(services);
      expect(mockPrisma.service.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { ordre: 'asc' } }),
      );
    });
  });

  // ── findOne ────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns the service when it exists', async () => {
      const svcFixture = makeService();
      mockPrisma.service.findUnique.mockResolvedValue(svcFixture);

      const result = await svc.findOne(1);

      expect(result).toEqual(svcFixture);
    });

    it('throws NotFoundException when service does not exist', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(svc.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates the service with the provided DTO', async () => {
      const dto = { titre: 'Consignation', description: 'Vente en consignation.' };
      mockPrisma.service.create.mockResolvedValue(makeService(dto));

      await svc.create(dto);

      expect(mockPrisma.service.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  // ── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates the service when it exists', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(makeService());
      mockPrisma.service.update.mockResolvedValue(makeService({ titre: 'Updated' }));

      const result = await svc.update(1, { titre: 'Updated' });

      expect(mockPrisma.service.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { titre: 'Updated' },
      });
      expect(result.titre).toBe('Updated');
    });

    it('throws NotFoundException when service does not exist', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(svc.update(99, { titre: 'x' })).rejects.toThrow(NotFoundException);
      expect(mockPrisma.service.update).not.toHaveBeenCalled();
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes the service when it exists', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(makeService());
      mockPrisma.service.delete.mockResolvedValue(makeService());

      await svc.remove(1);

      expect(mockPrisma.service.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('throws NotFoundException when service does not exist', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(svc.remove(99)).rejects.toThrow(NotFoundException);
      expect(mockPrisma.service.delete).not.toHaveBeenCalled();
    });
  });
});
