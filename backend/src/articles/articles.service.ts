import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StatutArticle } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  findAll(adminView = false) {
    return this.prisma.article.findMany({
      where: adminView ? {} : { statut: StatutArticle.publie },
      orderBy: { createdAt: 'desc' },
      select: { id: true, titre: true, slug: true, image_couverture: true, statut: true, createdAt: true },
    });
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article) throw new NotFoundException('Article introuvable');
    return article;
  }

  async findById(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article introuvable');
    return article;
  }

  async create(dto: CreateArticleDto) {
    const baseSlug = slugify(dto.titre, { lower: true, strict: true });
    const slug = await this.resolveSlug(baseSlug);
    try {
      return await this.prisma.article.create({ data: { ...dto, slug } });
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === 'P2002') {
        throw new ConflictException('Un article avec ce slug existe déjà');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateArticleDto) {
    await this.findById(id);
    return this.prisma.article.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findById(id);
    return this.prisma.article.delete({ where: { id } });
  }

  /**
   * Finds an available slug by checking the exact candidate slug against the
   * DB and incrementing a numeric suffix until a free one is found.
   * Avoids the count+insert race condition of the previous approach.
   */
  private async resolveSlug(base: string): Promise<string> {
    let slug = base;
    let suffix = 1;
    while (await this.prisma.article.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${base}-${++suffix}`;
    }
    return slug;
  }
}
