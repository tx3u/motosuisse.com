import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

/** bcrypt cost factor — 10 is the recommended minimum for interactive logins. */
const BCRYPT_ROUNDS = 10;

/** Access token lifetime. Short-lived to limit exposure after compromise. */
const ACCESS_TOKEN_EXPIRY = '15m';

/** Refresh token lifetime. Used only to obtain a new access token. */
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Core authentication service.
 *
 * Handles login credential verification, JWT token generation, and password
 * management. Works exclusively with the single {@link Admin} record.
 *
 * Token strategy:
 * - Access token: short-lived (15 min), sent as Bearer on every API call.
 * - Refresh token: long-lived (7 days), used only to rotate the access token.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Validates admin credentials and returns a fresh token pair.
   *
   * @param dto - Login credentials (email + password).
   * @throws {UnauthorizedException} If email not found or password incorrect.
   *   Both cases return the same generic message to prevent user enumeration.
   */
  async login(dto: LoginDto) {
    const admin = await this.prisma.admin.findUnique({ where: { email: dto.email } });
    // Deliberate: same error for "not found" and "wrong password" — prevents enumeration
    if (!admin) throw new UnauthorizedException('Identifiants invalides');

    const valid = await bcrypt.compare(dto.password, admin.mot_de_passe_hash);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    return this.signTokens(admin.id, admin.email);
  }

  /**
   * Issues a new token pair for an already-authenticated admin.
   * Called by the refresh endpoint after the JWT refresh strategy validates
   * the incoming refresh token.
   *
   * @param adminId - The admin's primary key.
   * @param email   - The admin's email address (embedded in the new tokens).
   */
  async refresh(adminId: number, email: string) {
    return this.signTokens(adminId, email);
  }

  /**
   * Updates the admin password after verifying the current one.
   *
   * @param adminId         - ID of the admin making the request.
   * @param currentPassword - Plain-text current password for verification.
   * @param newPassword     - New plain-text password to hash and store.
   * @throws {UnauthorizedException} If the admin record no longer exists.
   * @throws {BadRequestException}   If {@link currentPassword} is incorrect.
   */
  async changePassword(adminId: number, currentPassword: string, newPassword: string) {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new UnauthorizedException();

    const valid = await bcrypt.compare(currentPassword, admin.mot_de_passe_hash);
    if (!valid) throw new BadRequestException('Mot de passe actuel incorrect');

    const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.prisma.admin.update({ where: { id: adminId }, data: { mot_de_passe_hash: hash } });
    return { message: 'Mot de passe mis à jour' };
  }

  /**
   * Signs and returns both an access token and a refresh token for the given admin.
   *
   * @param sub   - Admin primary key (the `sub` JWT claim).
   * @param email - Admin email (embedded in the token payload).
   */
  private async signTokens(sub: number, email: string) {
    const payload = { sub, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_SECRET'),
        expiresIn: ACCESS_TOKEN_EXPIRY,
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: REFRESH_TOKEN_EXPIRY,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
