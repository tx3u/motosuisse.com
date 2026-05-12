import { Body, Controller, Patch, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

/** Maximum login attempts per minute before rate-limiting kicks in. */
const LOGIN_RATE_LIMIT = 5;

/** Time window (ms) for the login rate limit. */
const LOGIN_RATE_TTL_MS = 60_000;

/** Matches the refresh token JWT expiry (7 days in ms). */
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Writes the refresh token into an HttpOnly cookie so it is never accessible
 * to JavaScript.  The cookie is scoped to /api/auth so it is not sent on
 * every request — only on login and refresh calls.
 */
function setRefreshCookie(res: Response, token: string): void {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    path: '/api/auth',
  });
}

/**
 * Handles authentication endpoints: login, token refresh, logout, and
 * password change.  All write routes operate on the single admin account.
 */
@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /**
   * Authenticates the admin with email + password.
   * Returns the access token (15 min) in the body and sets the refresh token
   * (7 days) as an HttpOnly cookie — never exposed to JavaScript.
   * Rate-limited to {@link LOGIN_RATE_LIMIT} attempts per minute.
   */
  @Throttle({ default: { ttl: LOGIN_RATE_TTL_MS, limit: LOGIN_RATE_LIMIT } })
  @ApiOperation({ summary: 'Admin login' })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.auth.login(dto);
    setRefreshCookie(res, refreshToken);
    return { accessToken };
  }

  /**
   * Issues a new access token from the refresh token stored in the HttpOnly
   * cookie.  Also rotates the refresh cookie.
   */
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Refresh access token' })
  @Post('refresh')
  async refresh(
    @Request() req: { user: { sub: number; email: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.auth.refresh(req.user.sub, req.user.email);
    setRefreshCookie(res, refreshToken);
    return { accessToken };
  }

  /**
   * Clears the refresh token cookie, invalidating the session on this device.
   * The access token remains valid until its 15-minute expiry — callers should
   * also discard it from memory/storage.
   */
  @ApiOperation({ summary: 'Admin logout' })
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
    });
    return { message: 'Déconnecté' };
  }

  /**
   * Changes the admin password after verifying the current one.
   * Requires a valid JWT access token in the `Authorization` header.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change admin password' })
  @Patch('password')
  changePassword(
    @Request() req: { user: { sub: number } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.auth.changePassword(req.user.sub, dto.currentPassword, dto.newPassword);
  }
}
