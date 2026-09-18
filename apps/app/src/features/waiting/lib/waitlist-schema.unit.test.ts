import {
  createWaitlistSchema,
  formatPhoneInput,
} from '@/features/waiting/lib/waitlist-schema';

describe('features/waiting waitlist-schema (unit)', () => {
  const schema = createWaitlistSchema({
    nameRequired: 'name required',
    phoneInvalid: 'phone invalid',
    partySizeInvalid: 'party invalid',
  });

  it('accepts valid waitlist payload', () => {
    const result = schema.safeParse({
      name: '홍길동',
      phone: '010-1234-5678',
      partySize: 2,
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid phone and empty name', () => {
    const result = schema.safeParse({
      name: '',
      phone: '01012345678',
      partySize: 0,
    });

    expect(result.success).toBe(false);
  });

  it('formats phone numbers as the user types', () => {
    expect(formatPhoneInput('010')).toBe('010');
    expect(formatPhoneInput('0101234')).toBe('010-1234');
    expect(formatPhoneInput('01012345678')).toBe('010-1234-5678');
    expect(formatPhoneInput('010-12ab34-5678999')).toBe('010-1234-5678');
  });
});
