import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('articles')
@Controller('api/articles')
export class ArticlesController {
  constructor(private articles: ArticlesService) {}

  /** Returns published articles only — no auth required. */
  @ApiOperation({ summary: 'List published articles (public)' })
  @Get()
  findAll() {
    return this.articles.findAll(false);
  }

  /** Returns all articles including drafts — admin only. */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all articles including drafts (admin)' })
  @Get('admin')
  findAllAdmin() {
    return this.articles.findAll(true);
  }

  /** Returns a single article by ID — admin only. Must be before :slug. */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get article by ID (admin)' })
  @Get('admin/:id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.articles.findById(id);
  }

  @ApiOperation({ summary: 'Get article by slug (public)' })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.articles.findBySlug(slug);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create article (admin)' })
  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.articles.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update article (admin)' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateArticleDto) {
    return this.articles.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete article (admin)' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articles.remove(id);
  }
}
