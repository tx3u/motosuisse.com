import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

const CLOUDINARY_FOLDER = 'motosuisse/services';

/**
 * Extracts the Cloudinary public ID from a CDN URL.
 * URL format: https://res.cloudinary.com/{cloud}/image/upload/v{n}/{public_id}.{ext}
 */
function cloudinaryPublicId(url: string): string {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  return match ? match[1] : url;
}

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadService,
  ) {}

  findAll() {
    return this.prisma.service.findMany({ orderBy: { ordre: 'asc' } });
  }

  findOne(id: number) {
    return this.getOrFail(id);
  }

  create(dto: CreateServiceDto) {
    return this.prisma.service.create({ data: dto });
  }

  async update(id: number, dto: UpdateServiceDto) {
    await this.getOrFail(id);
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  /**
   * Uploads an image to Cloudinary and sets it as the service's cover image.
   * Replaces the previous image if there was one (and removes it from Cloudinary).
   */
  async setImage(id: number, buffer: Buffer) {
    const service = await this.getOrFail(id);
    const newUrl = await this.upload.uploadImage(buffer, CLOUDINARY_FOLDER);
    if (service.image) {
      // Best-effort cleanup of the previous image; don't block the request.
      await this.upload.deleteImage(cloudinaryPublicId(service.image)).catch(() => undefined);
    }
    return this.prisma.service.update({ where: { id }, data: { image: newUrl } });
  }

  /**
   * Removes the image from the service and deletes it from Cloudinary.
   */
  async removeImage(id: number) {
    const service = await this.getOrFail(id);
    if (!service.image) throw new NotFoundException('Aucune image à supprimer');
    await this.upload.deleteImage(cloudinaryPublicId(service.image)).catch(() => undefined);
    return this.prisma.service.update({ where: { id }, data: { image: null } });
  }

  async remove(id: number) {
    const service = await this.getOrFail(id);
    if (service.image) {
      await this.upload.deleteImage(cloudinaryPublicId(service.image)).catch(() => undefined);
    }
    return this.prisma.service.delete({ where: { id } });
  }

  private async getOrFail(id: number) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service introuvable');
    return service;
  }
}
