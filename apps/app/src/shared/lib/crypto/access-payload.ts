/**
 * Booth QR / deep-link access payload.
 *
 * NOT a secret. Client-side AES with VITE_SECRET_KEY was removed because
 * Vite public env vars ship in the bundle. Integrity must come from a
 * server-signed short-TTL token (next iteration). Until then we only
 * transport opaque base64url JSON that anyone can decode — same trust
 * model as an unsigned query string, without pretending it's encrypted.
 */
export type BoothAccessPayload = {
  userId: string;
  tableId?: number;
};

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Encode booth access data for QR / deep links (URL-safe, no secret). */
export function encodeAccessPayload(
  payload: BoothAccessPayload,
): string | null {
  if (!payload?.userId) return null;
  const json = JSON.stringify(payload);
  return bytesToBase64Url(new TextEncoder().encode(json));
}

/** Decode booth access data from QR / deep links. */
export function decodeAccessPayload(
  encoded: string,
): BoothAccessPayload | null {
  if (!encoded) return null;
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(encoded));
    const data = JSON.parse(json) as BoothAccessPayload;
    if (!data?.userId) return null;
    return data;
  } catch {
    return null;
  }
}

/** @deprecated Use encodeAccessPayload — kept as alias during migration. */
export const encryptJson = (jsonObject: object) =>
  encodeAccessPayload(jsonObject as BoothAccessPayload);

/** @deprecated Use decodeAccessPayload — kept as alias during migration. */
export const decryptJson = (encryptedString: string) =>
  decodeAccessPayload(encryptedString);
