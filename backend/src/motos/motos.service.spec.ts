import { ConflictException, NotFoundException } from '@nestjs/common';
import { MotosService } from './motos.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPrisma = {
  moto: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  vue: {
    upsert: jest.fn(),
  },
};

const mockUpload = {
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
};

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeMoto = (overrides = {}) => ({
  id: 1,
  slug: 'honda-cb500f-2020',
  marque: 'Honda',
  modele: 'CB500F',
  annee: 2020,
  kilometrage: 15000,
  prix: '5500.00',
  description: null,
  cylindree: null,
  puissance: null,
  type: null,
  featured: false,
  statut: 'disponible' as const,
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('MotosService', () => {
  let service: MotosService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MotosService(mockPrisma as never, mockUpload as never);
  });

  // ── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns paginated data with defaults (page=1, limit=12)', async () => {
      const motos = [makeMoto()];
      mockPrisma.moto.findMany.mockResolvedValue(motos);
      mockPrisma.moto.count.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result).toEqual({ data: motos, total: 1, page: 1, limit: 12 });
      expect(mockPrisma.moto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 12 }),
      );
    });

    it('applies page and limit from filters', async () => {
      mockPrisma.moto.findMany.mockResolvedValue([]);
      mockPrisma.moto.count.mockResolvedValue(0);

      await service.findAll({ page: 3, limit: 5 });

      expect(mockPrisma.moto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 5 }),
      );
    });

    it('applies brand filter case-insensitively', async () => {
      mockPrisma.moto.findMany.mockResolvedValue([]);
      mockPrisma.moto.count.mockResolvedValue(0);

      await service.findAll({ marque: 'honda' });

      expect(mockPrisma.moto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            marque: { contains: 'honda', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('applies price range filter when both bounds given', async () => {
      mockPrisma.moto.findMany.mockResolvedValue([]);
      mockPrisma.moto.count.mockResolvedValue(0);

      await service.findAll({ prix_min: 1000, prix_max: 8000 });

      expect(mockPrisma.moto.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            prix: { gte: 1000, lte: 8000 },
          }),
        }),
      );
    });
  });

  // ── findBySlug ─────────────────────────────────────────────────────────────

  describe('findBySlug', () => {
    it('returns the moto and records a view', async () => {
      const moto = makeMoto();
      mockPrisma.moto.findUnique.mockResolvedValue(moto);
      mockPrisma.vue.upsert.mockResolvedValue({});

      const result = await service.findBySlug('honda-cb500f-2020');

      expect(result).toEqual(moto);
      expect(mockPrisma.vue.upsert).toHaveBeenCalledTimes(1);
    });

    it('buckets the view at UTC midnight', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(makeMoto());
      mockPrisma.vue.upsert.mockResolvedValue({});

      await service.findBySlug('honda-cb500f-2020');

      const upsertCall = mockPrisma.vue.upsert.mock.calls[0][0];
      const date: Date = upsertCall.where.motoId_date.date;
      expect(date.getUTCHours()).toBe(0);
      expect(date.getUTCMinutes()).toBe(0);
      expect(date.getUTCSeconds()).toBe(0);
    });

    it('throws NotFoundException when slug does not match any listing', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('unknown-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── findBySlugAdmin ────────────────────────────────────────────────────────

  describe('findBySlugAdmin', () => {
    it('returns the moto without recording a view', async () => {
      const moto = makeMoto();
      mockPrisma.moto.findUnique.mockResolvedValue(moto);

      const result = await service.findBySlugAdmin('honda-cb500f-2020');

      expect(result).toEqual(moto);
      expect(mockPrisma.vue.upsert).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when slug does not match any listing', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(null);

      await expect(service.findBySlugAdmin('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  // ── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    const dto = {
      marque: 'Honda',
      modele: 'CB500F',
      annee: 2020,
      kilometrage: 15000,
      prix: 5500,
    };

    it('generates a slug from marque + modele + annee', async () => {
      mockPrisma.moto.count.mockResolvedValue(0);
      mockPrisma.moto.create.mockResolvedValue(makeMoto());

      await service.create(dto);

      expect(mockPrisma.moto.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ slug: 'honda-cb500f-2020' }),
        }),
      );
    });

    it('appends a numeric suffix when the base slug already exists', async () => {
      // resolveSlug uses findUnique: base slug exists → -2 free
      mockPrisma.moto.findUnique
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce(null);
      mockPrisma.moto.create.mockResolvedValue(makeMoto({ slug: 'honda-cb500f-2020-2' }));

      await service.create(dto);

      expect(mockPrisma.moto.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ slug: 'honda-cb500f-2020-2' }),
        }),
      );
    });

    it('throws ConflictException on P2002 DB constraint violation', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(null);
      mockPrisma.moto.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('re-throws unexpected create errors unchanged', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(null);
      mockPrisma.moto.create.mockRejectedValue(new Error('DB connection failed'));

      await expect(service.create(dto)).rejects.toThrow('DB connection failed');
    });

    it('creates the listing with an empty images array', async () => {
      mockPrisma.moto.count.mockResolvedValue(0);
      mockPrisma.moto.create.mockResolvedValue(makeMoto());

      await service.create(dto);

      expect(mockPrisma.moto.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ images: [] }),
        }),
      );
    });
  });

  // ── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates the listing when it exists', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(makeMoto());
      mockPrisma.moto.update.mockResolvedValue(makeMoto({ prix: '6000.00' }));

      const result = await service.update(1, { prix: 6000 });

      expect(mockPrisma.moto.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { prix: 6000 } });
      expect(result.prix).toBe('6000.00');
    });

    it('throws NotFoundException when listing does not exist', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(null);

      await expect(service.update(99, { prix: 1000 })).rejects.toThrow(NotFoundException);
    });
  });

  // ── addImage ───────────────────────────────────────────────────────────────

  describe('addImage', () => {
    it('uploads to Cloudinary and pushes the URL into the images array', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(makeMoto());
      mockUpload.uploadImage.mockResolvedValue('https://cdn.example.com/img.jpg');
      mockPrisma.moto.update.mockResolvedValue(makeMoto({ images: ['https://cdn.example.com/img.jpg'] }));

      await service.addImage(1, Buffer.from('fake-image'));

      expect(mockUpload.uploadImage).toHaveBeenCalledWith(
        expect.any(Buffer),
        'motosuisse/motos',
      );
      expect(mockPrisma.moto.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { images: { push: 'https://cdn.example.com/img.jpg' } },
        }),
      );
    });

    it('throws NotFoundException when listing does not exist', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(null);

      await expect(service.addImage(99, Buffer.from(''))).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── removeImage ────────────────────────────────────────────────────────────

  describe('removeImage', () => {
    const imageUrl = 'https://res.cloudinary.com/demo/image/upload/v1234/motosuisse/motos/abc.jpg';

    it('removes the URL from the array and deletes it from Cloudinary', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(makeMoto({ images: [imageUrl] }));
      mockUpload.deleteImage.mockResolvedValue(undefined);
      mockPrisma.moto.update.mockResolvedValue(makeMoto({ images: [] }));

      await service.removeImage(1, imageUrl);

      expect(mockUpload.deleteImage).toHaveBeenCalledWith('motosuisse/motos/abc');
      expect(mockPrisma.moto.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { images: [] } }),
      );
    });

    it('uses the raw URL as Cloudinary public ID when it does not match the CDN pattern', async () => {
      const plainUrl = 'not-a-cloudinary-url';
      mockPrisma.moto.findUnique.mockResolvedValue(makeMoto({ images: [plainUrl] }));
      mockUpload.deleteImage.mockResolvedValue(undefined);
      mockPrisma.moto.update.mockResolvedValue(makeMoto({ images: [] }));

      await service.removeImage(1, plainUrl);

      expect(mockUpload.deleteImage).toHaveBeenCalledWith(plainUrl);
    });

    it('throws NotFoundException when the URL is not in the listing images', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(makeMoto({ images: ['https://other.url/img.jpg'] }));

      await expect(service.removeImage(1, imageUrl)).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when listing does not exist', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(null);

      await expect(service.removeImage(99, imageUrl)).rejects.toThrow(NotFoundException);
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes the listing when it exists', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(makeMoto());
      mockPrisma.moto.delete.mockResolvedValue(makeMoto());

      await service.remove(1);

      expect(mockPrisma.moto.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deletes all associated Cloudinary images before removing the DB record', async () => {
      const images = [
        'https://res.cloudinary.com/demo/image/upload/v1/a.jpg',
        'https://res.cloudinary.com/demo/image/upload/v1/b.jpg',
      ];
      mockPrisma.moto.findUnique.mockResolvedValue(makeMoto({ images }));
      mockUpload.deleteImage.mockResolvedValue(undefined);
      mockPrisma.moto.delete.mockResolvedValue(makeMoto());

      await service.remove(1);

      expect(mockUpload.deleteImage).toHaveBeenCalledTimes(2);
      expect(mockPrisma.moto.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('throws NotFoundException when listing does not exist', async () => {
      mockPrisma.moto.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
