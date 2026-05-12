import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Payload for the public contact form submission endpoint.
 * All string lengths are capped to prevent oversized payloads reaching the DB.
 */
export class ContactDto {
  /** Sender's full name. */
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nom: string;

  /** Sender's email address — used for reply-to in the notification email. */
  @ApiProperty({ maxLength: 254 })
  @IsEmail()
  @MaxLength(254)
  email: string;

  /** Optional phone number for a callback. */
  @ApiPropertyOptional({ maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telephone?: string;

  /** Optional subject line for the message. */
  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  sujet?: string;

  /** The message body. At least 10 characters, capped at 5 000. */
  @ApiProperty({ minLength: 10, maxLength: 5000 })
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;
}
