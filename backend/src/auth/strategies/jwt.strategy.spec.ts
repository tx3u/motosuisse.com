import { JwtStrategy } from './jwt.strategy';

const mockConfig = {
  getOrThrow: jest.fn().mockReturnValue('test-secret'),
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy(mockConfig as never);
  });

  it('validate returns the jwt payload unchanged', () => {
    const payload = { sub: 1, email: 'admin@motosuisse.ch' };
    expect(strategy.validate(payload)).toEqual(payload);
  });
});
