import { getEnv, env } from '@/shared/config/env';

describe('shared/config/env (unit)', () => {
  it('reads known keys from process.env', () => {
    expect(env.VITE_API_URL).toBe('http://api.test');
    expect(env.VITE_SOCKET_URL).toBe('http://socket.test');
    expect(env.VITE_SENTRY_DSN).toBe('');
  });

  it('returns empty string for missing keys', () => {
    expect(getEnv('MISSING_KEY_FOR_TEST', {})).toBe('');
    expect(getEnv('MISSING_KEY_FOR_TEST', { OTHER: 'x' })).toBe('');
  });

  it('reads from an explicit env source', () => {
    expect(getEnv('VITE_API_URL', { VITE_API_URL: 'http://custom' })).toBe(
      'http://custom',
    );
  });
});
