import { AuthController } from './auth.controller';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockService = {
  login: jest.fn(),
  refresh: jest.fn(),
  changePassword: jest.fn(),
};

const mockRes = {
  cookie: jest.fn(),
  clearCookie: jest.fn(),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(mockService as never);
  });

  // ── login ──────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('returns only the access token in the response body', async () => {
      mockService.login.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await controller.login(
        { email: 'admin@test.com', password: 'pass' } as never,
        mockRes as never,
      );

      expect(result).toEqual({ accessToken: 'access-token' });
    });

    it('sets the refresh token as an HttpOnly cookie', async () => {
      mockService.login.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      await controller.login(
        { email: 'admin@test.com', password: 'pass' } as never,
        mockRes as never,
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh-token',
        expect.objectContaining({ httpOnly: true, path: '/api/auth' }),
      );
    });
  });

  // ── refresh ────────────────────────────────────────────────────────────────

  describe('refresh', () => {
    it('returns a new access token and rotates the refresh cookie', async () => {
      mockService.refresh.mockResolvedValue({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      });

      const result = await controller.refresh(
        { user: { sub: 1, email: 'admin@test.com' } },
        mockRes as never,
      );

      expect(result).toEqual({ accessToken: 'new-access' });
      expect(mockService.refresh).toHaveBeenCalledWith(1, 'admin@test.com');
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'new-refresh',
        expect.objectContaining({ httpOnly: true }),
      );
    });
  });

  // ── logout ─────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('clears the refresh cookie', () => {
      controller.logout(mockRes as never);

      expect(mockRes.clearCookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.objectContaining({ httpOnly: true, path: '/api/auth' }),
      );
    });

    it('returns a confirmation message', () => {
      expect(controller.logout(mockRes as never)).toEqual({ message: 'Déconnecté' });
    });
  });

  // ── changePassword ─────────────────────────────────────────────────────────

  describe('changePassword', () => {
    it('delegates to service with admin id and passwords from dto', async () => {
      mockService.changePassword.mockResolvedValue({ message: 'Mot de passe mis à jour' });
      const dto = { currentPassword: 'old-pass', newPassword: 'new-pass' };

      await controller.changePassword({ user: { sub: 42 } }, dto as never);

      expect(mockService.changePassword).toHaveBeenCalledWith(42, 'old-pass', 'new-pass');
    });
  });
});
