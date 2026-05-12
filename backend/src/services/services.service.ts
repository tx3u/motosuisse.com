import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

/**
 * Manages the dealership's service offerings (e.g. sticker fitting,
 * consignment sales).
 *
 * Services are ordered by the `ordre` field so the admin can control
 * display order without relying on insertion order.
 */
@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all services sorted by `ordre` ascending.
   * Includes both active and inactive services (filtering happens on the
   * frontend for the public page, or can be added here if needed).
   */
  findAll() {
    return this.prisma.service.findMany({ orderBy: { ordre: 'asc' } });
  }

  /**
   * Returns a single service by primary key.
   *
   * @param id - Service primary key.
   * @throws {NotFoundException} If no service with the given ID exists.
   */
  findOne(id: number) {
    return this.getOrFail(id);
  }

  /**
   * Creates a new service entry.
   *
   * @param dto - Validated creation payload.
   */
  create(dto: CreateServiceDto) {
    return this.prisma.service.create({ data: dto });
  }

  /**
   * Updates one or more fields of an existing service.
   *
   * @param id  - Service primary key.
   * @param dto - Partial update payload.
   * @throws {NotFoundException} If no service with the given ID exists.
   */
  async update(id: number, dto: UpdateServiceDto) {
    await this.getOrFail(id);
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  /**
   * Permanently deletes a service entry.
   *
   * @param id - Service primary key.
   * @throws {NotFoundException} If no service with the given ID exists.
   */
  async remove(id: number) {
    await this.getOrFail(id);
    return this.prisma.service.delete({ where: { id } });
  }

  /**
   * Fetches a service by primary key or throws if it does not exist.
   * Used internally to pre-validate IDs before mutations.
   *
   * @param id - Service primary key.
   * @throws {NotFoundException} If no service with the given ID exists.
   */
  private async getOrFail(id: number) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service introuvable');
    return service;
  }
}
