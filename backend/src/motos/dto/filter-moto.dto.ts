import { ApiPropertyOptional } from '@nestjs/swagger';
import { Statut } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

/** Maximum price filter value in CHF — matches the create DTO cap. */
const MAX_PRICE = 1_000_000;

/** Maximum kilometre filter value — 1 M km covers any real-world motorcycle. */
const MAX_KM = 1_000_000;

/** Hard cap on page size to prevent accidental full-table scans. */
const MAX_LIMIT = 100;

/**
 * Query-string filters for the public motorcycle catalogue endpoint.
 * All numeric values are coerced from strings (query params arrive as strings).
 */
export class FilterMotoDto {
  /** Filter by brand name (case-insensitive partial match). */
  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  marque?: string;

  /** Minimum price in CHF (inclusive). Must be ≥ 0. */
  @ApiPropertyOptional({ minimum: 0, maximum: MAX_PRICE })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(MAX_PRICE)
  @Type(() => Number)
  prix_min?: number;

  /** Maximum price in CHF (inclusive). Must be ≥ 0. */
  @ApiPropertyOptional({ minimum: 0, maximum: MAX_PRICE })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(MAX_PRICE)
  @Type(() => Number)
  prix_max?: number;

  /** Maximum odometer reading in kilometres (inclusive). Must be ≥ 0. */
  @ApiPropertyOptional({ minimum: 0, maximum: MAX_KM })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_KM)
  @Type(() => Number)
  kilometrage_max?: number;

  /** Filter to featured listings only when `true`. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  featured?: boolean;

  /** Filter by availability status. */
  @ApiPropertyOptional({ enum: Statut })
  @IsOptional()
  @IsEnum(Statut)
  statut?: Statut;

  /** 1-based page number. Defaults to 1. */
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  /**
   * Number of results per page. Defaults to 12.
   * Capped at {@link MAX_LIMIT} to prevent accidental full-table loads.
   */
  @ApiPropertyOptional({ default: 12, minimum: 1, maximum: MAX_LIMIT })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  @Type(() => Number)
  limit?: number = 12;
}
