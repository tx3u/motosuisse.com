import * as passportJwt from 'passport-jwt';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

const mockConfig = {
  getOrThrow: jest.fn().mockReturnValue('test-refresh-secret'),
};

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;
  let capturedExtractor: (req: unknown) => string | null;

  beforeEach(() => {
    jest.spyOn(passportJwt.ExtractJwt, 'fromExtractors').mockImplementationOnce((extractors) => {
      capturedExtractor = extractors[0] as (req: unknown) => string | null;
      return jest.fn();
    });
    strategy = new JwtRefreshStrategy(mockConfig as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('validate returns the jwt payload ignoring the request', () => {
    const payload = { sub: 1, email: 'admin@motosuisse.ch' };
    expect(strategy.validate({} as never, payload)).toEqual(payload);
  });

  it('cookie extractor returns the refresh token from cookies', () => {
    expect(capturedExtractor({ cookies: { refresh_token: 'my-refresh-token' } })).toBe('my-refresh-token');
  });

  it('cookie extractor returns null when refresh_token cookie is absent', () => {
    expect(capturedExtractor({ cookies: {} })).toBeNull();
  });

  it('cookie extractor returns null when there are no cookies', () => {
    expect(capturedExtractor({})).toBeNull();
  });
});
