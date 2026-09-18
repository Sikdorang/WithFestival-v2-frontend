import {
  decodeAccessPayload,
  decryptJson,
  encodeAccessPayload,
  encryptJson,
  type BoothAccessPayload,
} from '@/shared/lib/crypto';

describe('shared/lib/access-payload (unit)', () => {
  const payload: BoothAccessPayload = { userId: '12', tableId: 3 };

  it('round-trips booth access payloads without a client secret', () => {
    const encoded = encodeAccessPayload(payload);
    expect(encoded).toEqual(expect.any(String));
    expect(encoded).not.toContain('{');
    expect(decodeAccessPayload(encoded!)).toEqual(payload);
  });

  it('returns null for invalid inputs', () => {
    expect(encodeAccessPayload({ userId: '' })).toBeNull();
    expect(decodeAccessPayload('')).toBeNull();
    expect(decodeAccessPayload('!!!')).toBeNull();
  });

  it('keeps deprecated aliases working', () => {
    const encoded = encryptJson(payload);
    expect(decryptJson(encoded!)).toEqual(payload);
  });
});
