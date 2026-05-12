import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

/**
 * Payload for creating a new customer review.
 * All text fields are length-capped to prevent oversized content reaching the DB.
 */
export class CreateReviewDto {
  /** Reviewer's first name. */
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nom: string;

  /** Optional city of the reviewer. */
  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ville?: string;

  /** Optional model of the purchased motorcycle. */
  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  moto?: string;

  /** Star rating from 1 (lowest) to 5 (highest). */
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  note: number;

  /** Review body. At least 10 characters, capped at 2 000. */
  @ApiProperty({ minLength: 10, maxLength: 2000 })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  texte: string;
}
