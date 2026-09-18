import { redirectTo } from '@/shared/lib/navigation';

describe('shared/lib/navigation (unit)', () => {
  it('assigns href on the provided location object', () => {
    const location = { href: 'http://localhost/' };
    redirectTo('/login', location);
    expect(location.href).toBe('/login');
  });

  it('defaults to window.location (hash navigation is supported in jsdom)', () => {
    redirectTo('#coverage-login');
    expect(window.location.hash).toBe('#coverage-login');
  });
});
