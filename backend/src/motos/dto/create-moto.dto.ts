import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Statut } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

/** Earliest plausible motorcycle manufacturing year. */
const MIN_YEAR = 1900;

/**
 * Latest accepted year — current year + 1 to allow next-model-year listings
 * without hard-coding a value that becomes stale.
 */
const MAX_YEAR = new Date().getFullYear() + 1;

/** Maximum price accepted in CHF (prevent accidental astronomical values). */
const MAX_PRICE = 1_000_000;

/**
 * Payload for creating a new motorcycle listing.
 * Slug is generated server-side from marque + modele + annee.
 */
export class CreateMotoDto {
  /** Brand name (e.g. "Honda", "BMW"). */
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  marque: string;

  /** Model name (e.g. "CB500F", "R 1250 GS"). */
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  modele: string;

  /** Four-digit model year. Must be between {@link MIN_YEAR} and {@link MAX_YEAR}. */
  @ApiProperty({ minimum: MIN_YEAR, maximum: MAX_YEAR })
  @IsInt()
  @Min(MIN_YEAR)
  @Max(MAX_YEAR)
  annee: number;

  /** Odometer reading in kilometres. Must be ≥ 0. */
  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  kilometrage: number;

  /** Asking price in CHF. Must be ≥ 0 and ≤ {@link MAX_PRICE}. */
  @ApiProperty({ minimum: 0, maximum: MAX_PRICE })
  @IsNumber()
  @Min(0)
  @Max(MAX_PRICE)
  prix: number;

  /** Free-text description of the motorcycle's condition and history. */
  @ApiPropertyOptional({ maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  /** Engine displacement string (e.g. "1254 cc"). */
  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  cylindree?: string;

  /** Power output string (e.g. "136 ch"). */
  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  puissance?: string;

  /** Motorcycle category (e.g. "Trail", "Roadster", "Sportive"). */
  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  /** Whether to feature this listing on the homepage carousel. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  /** Availability status. Defaults to `disponible` at the DB level. */
  @ApiPropertyOptional({ enum: Statut })
  @IsOptional()
  @IsEnum(Statut)
  statut?: Statut;
}
