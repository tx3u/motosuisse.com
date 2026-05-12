import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPrisma = {
  admin: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwt = {
  signAsync: jest.fn(),
};

const mockConfig = {
  get: jest.fn(),
  getOrThrow: jest.fn((key: string) => {
    const map: Record<string, string> = {
      JWT_SECRET: 'test-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
    };
    return map[key] ?? (() => { throw new Error(`Missing: ${key}`); })();
  }),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockJwt.signAsync.mockResolvedValue('mock-token');
    service = new AuthService(
      mockPrisma as never,
      mockJwt as never,
      mockConfig as never,
    );
  });

  // ── login ──────────────────────────────────────────────────────────────────

  describe('login', () => {
    const hash = bcrypt.hashSync('password123', 10);
    const admin = { id: 1, email: 'admin@test.com', mot_de_passe_hash: hash };

    it('returns a token pair for valid credentials', async () => {
      mockPrisma.admin.findUnique.mockResolvedValue(admin);

      const result = await service.login({ email: admin.email, password: 'password123' });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('throws UnauthorizedException when email not found', async () => {
      mockPrisma.admin.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@test.com', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      mockPrisma.admin.findUnique.mockResolvedValue(admin);

      await expect(
        service.login({ email: admin.email, password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('uses a generic error for both failure cases (no user enumeration)', async () => {
      mockPrisma.admin.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'x@x.com', password: 'x' }),
      ).rejects.toThrow('Identifiants invalides');

      mockPrisma.admin.findUnique.mockResolvedValue(admin);
      await expect(
        service.login({ email: admin.email, password: 'bad' }),
      ).rejects.toThrow('Identifiants invalides');
    });
  });

  // ── refresh ────────────────────────────────────────────────────────────────

  describe('refresh', () => {
    it('returns a new token pair without hitting the DB', async () => {
      const result = await service.refresh(1, 'admin@test.com');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockPrisma.admin.findUnique).not.toHaveBeenCalled();
    });
  });

  // ── changePassword ─────────────────────────────────────────────────────────

  describe('changePassword', () => {
    const hash = bcrypt.hashSync('old-pass', 10);
    const admin = { id: 1, email: 'admin@test.com', mot_de_passe_hash: hash };

    it('updates the hash when current password is correct', async () => {
      mockPrisma.admin.findUnique.mockResolvedValue(admin);
      mockPrisma.admin.update.mockResolvedValue(admin);

      const result = await service.changePassword(1, 'old-pass', 'new-pass');

      expect(mockPrisma.admin.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
      expect(result).toEqual({ message: 'Mot de passe mis à jour' });
    });

    it('throws BadRequestException when current password is wrong', async () => {
      mockPrisma.admin.findUnique.mockResolvedValue(admin);

      await expect(
        service.changePassword(1, 'wrong', 'new'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws UnauthorizedException when admin record does not exist', async () => {
      mockPrisma.admin.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword(99, 'any', 'new'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('stores a bcrypt hash, not the plain-text password', async () => {
      mockPrisma.admin.findUnique.mockResolvedValue(admin);
      mockPrisma.admin.update.mockResolvedValue(admin);

      await service.changePassword(1, 'old-pass', 'new-pass');

      const updateCall = mockPrisma.admin.update.mock.calls[0][0];
      const storedHash: string = updateCall.data.mot_de_passe_hash;

      expect(storedHash).not.toBe('new-pass');
      expect(await bcrypt.compare('new-pass', storedHash)).toBe(true);
    });
  });
});
