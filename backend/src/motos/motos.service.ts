import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Moto } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateMotoDto } from './dto/create-moto.dto';
import { FilterMotoDto } from './dto/filter-moto.dto';
import { UpdateMotoDto } from './dto/update-moto.dto';
import slugify from 'slugify';

/** Cloudinary folder where moto images are stored. */
const CLOUDINARY_FOLDER = 'motosuisse/motos';

/**
 * Extracts the Cloudinary public ID from a CDN URL.
 * URL format: https://res.cloudinary.com/{cloud}/image/upload/v{n}/{public_id}.{ext}
 */
function cloudinaryPublicId(url: string): string {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  return match ? match[1] : url;
}

@Injectable()
export class MotosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadService,
  ) {}

  async findAll(filters: FilterMotoDto) {
    const { marque, prix_min, prix_max, kilometrage_max, statut, featured, page = 1, limit = 12 } = filters;

    const where = {
      ...(marque && { marque: { contains: marque, mode: 'insensitive' as const } }),
      ...(statut && { statut }),
      ...(featured !== undefined && { featured }),
      ...(prix_min !== undefined || prix_max !== undefined
        ? { prix: { ...(prix_min !== undefined && { gte: prix_min }), ...(prix_max !== undefined && { lte: prix_max }) } }
        : {}),
      ...(kilometrage_max !== undefined && { kilometrage: { lte: kilometrage_max } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.moto.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: [{ statut: 'asc' }, { createdAt: 'desc' }] }),
      this.prisma.moto.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /** Fetches a moto by slug and records a view (public-facing endpoint). */
  async findBySlug(slug: string): Promise<Moto> {
    const moto = await this.prisma.moto.findUnique({ where: { slug } });
    if (!moto) throw new NotFoundException('Moto introuvable');

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    await this.prisma.vue.upsert({
      where: { motoId_date: { motoId: moto.id, date: today } },
      update: { count: { increment: 1 } },
      create: { motoId: moto.id, date: today, count: 1 },
    });

    return moto;
  }

  /** Fetches a moto by slug WITHOUT recording a view (admin edit page). */
  async findBySlugAdmin(slug: string): Promise<Moto> {
    const moto = await this.prisma.moto.findUnique({ where: { slug } });
    if (!moto) throw new NotFoundException('Moto introuvable');
    return moto;
  }

  async create(dto: CreateMotoDto) {
    const baseSlug = slugify(`${dto.marque}-${dto.modele}-${dto.annee}`, { lower: true, strict: true });
    const slug = await this.resolveSlug(baseSlug);
    try {
      return await this.prisma.moto.create({ data: { ...dto, slug, images: [] } });
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === 'P2002') {
        throw new ConflictException('Une moto avec ce slug existe déjà');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateMotoDto) {
    await this.findById(id);
    return this.prisma.moto.update({ where: { id }, data: dto });
  }

  async addImage(id: number, buffer: Buffer) {
    await this.findById(id);
    const url = await this.upload.uploadImage(buffer, CLOUDINARY_FOLDER);
    return this.prisma.moto.update({ where: { id }, data: { images: { push: url } } });
  }

  /** Removes one image URL from the listing and deletes it from Cloudinary. */
  async removeImage(id: number, imageUrl: string) {
    const moto = await this.findById(id);
    if (!moto.images.includes(imageUrl)) throw new NotFoundException('Image introuvable');
    const publicId = cloudinaryPublicId(imageUrl);
    await this.upload.deleteImage(publicId);
    return this.prisma.moto.update({
      where: { id },
      data: { images: moto.images.filter((u) => u !== imageUrl) },
    });
  }

  /** Deletes the listing and removes all associated Cloudinary images. */
  async remove(id: number) {
    const moto = await this.findById(id);
    // Delete Cloudinary assets first; ignore individual failures so the DB row
    // is always cleaned up even if Cloudinary is temporarily unreachable.
    await Promise.allSettled(
      moto.images.map((url) => this.upload.deleteImage(cloudinaryPublicId(url))),
    );
    return this.prisma.moto.delete({ where: { id } });
  }

  private async findById(id: number): Promise<Moto> {
    const moto = await this.prisma.moto.findUnique({ where: { id } });
    if (!moto) throw new NotFoundException('Moto introuvable');
    return moto;
  }

  /**
   * Finds an available slug by checking the exact candidate against the DB
   * and incrementing a numeric suffix until a free slot is found.
   */
  private async resolveSlug(base: string): Promise<string> {
    let slug = base;
    let suffix = 1;
    while (await this.prisma.moto.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${base}-${++suffix}`;
    }
    return slug;
  }
}
