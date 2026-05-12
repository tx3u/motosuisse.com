import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatutArticle } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  titre: string;

  @ApiProperty()
  @IsString()
  contenu: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image_couverture?: string;

  @ApiPropertyOptional({ enum: StatutArticle })
  @IsOptional()
  @IsEnum(StatutArticle)
  statut?: StatutArticle;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meta_title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meta_description?: string;
}
