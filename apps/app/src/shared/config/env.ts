/**
 * Env access for Vite (via define) and Jest (via process.env in setup).
 * Never put secrets in VITE_* — they are embedded in the client bundle.
 */
export function getEnv(
  key: string,
  source: NodeJS.ProcessEnv = process.env,
): string {
  return source[key] ?? '';
}

export const env = {
  get VITE_API_URL() {
    return getEnv('VITE_API_URL');
  },
  get VITE_SOCKET_URL() {
    return getEnv('VITE_SOCKET_URL');
  },
  get VITE_SENTRY_DSN() {
    return getEnv('VITE_SENTRY_DSN');
  },
};
