import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMotoDto } from './dto/create-moto.dto';
import { FilterMotoDto } from './dto/filter-moto.dto';
import { UpdateMotoDto } from './dto/update-moto.dto';
import { MotosService } from './motos.service';

/** Maximum uploaded image size in bytes (5 MB). */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Multer fileFilter — rejects uploads that are not images. Exported for unit testing. */
export function imageFileFilter(
  _: unknown,
  file: Express.Multer.File,
  cb: (err: Error | null, accept: boolean) => void,
): void {
  if (!file.mimetype.match(/^image\//)) {
    cb(new Error('Fichier non supporté — seules les images sont acceptées'), false);
    return;
  }
  cb(null, true);
}

class RemoveImageDto {
  @IsString()
  url: string;
}

@ApiTags('motos')
@Controller('api/motos')
export class MotosController {
  constructor(private readonly motos: MotosService) {}

  @ApiOperation({ summary: 'List motorcycles (paginated, public)' })
  @Get()
  findAll(@Query() filters: FilterMotoDto) {
    return this.motos.findAll(filters);
  }

  /**
   * Admin-only fetch by slug — does NOT increment the view counter.
   * Must be declared before :slug to avoid routing ambiguity.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get motorcycle by slug without view tracking (admin)' })
  @Get('admin/:slug')
  findOneAdmin(@Param('slug') slug: string) {
    return this.motos.findBySlugAdmin(slug);
  }

  @ApiOperation({ summary: 'Get motorcycle by slug + record view (public)' })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.motos.findBySlug(slug);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create motorcycle listing (admin)' })
  @Post()
  create(@Body() dto: CreateMotoDto) {
    return this.motos.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update motorcycle listing (admin)' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMotoDto) {
    return this.motos.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload motorcycle image (admin)' })
  @Post(':id/images')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_IMAGE_BYTES },
      fileFilter: imageFileFilter,
    }),
  )
  addImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.motos.addImage(id, file.buffer);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove one image from listing (admin)' })
  @ApiBody({ type: RemoveImageDto })
  @Delete(':id/images')
  removeImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RemoveImageDto,
  ) {
    return this.motos.removeImage(id, dto.url);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete motorcycle listing (admin)' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.motos.remove(id);
  }
}
