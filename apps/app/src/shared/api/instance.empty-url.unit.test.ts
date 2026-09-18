/**
 * Reloads the axios instance with an empty API URL to cover the `|| ''` branch.
 */
describe('shared/api/instance empty API URL (unit)', () => {
  const original = process.env.VITE_API_URL;

  afterEach(() => {
    process.env.VITE_API_URL = original;
    jest.resetModules();
  });

  it('falls back to /api when VITE_API_URL is empty', async () => {
    jest.resetModules();
    process.env.VITE_API_URL = '';
    jest.doMock('@/shared/lib/navigation', () => ({
      redirectTo: jest.fn(),
    }));

    const { default: instance } = await import('@/shared/api/instance');
    expect(instance.defaults.baseURL).toBe('/api');
  });
});
