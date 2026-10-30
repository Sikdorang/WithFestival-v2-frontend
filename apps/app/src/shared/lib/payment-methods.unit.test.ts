import {
  getPaymentMethodSettings,
  setPaymentMethodSettings,
} from '@/shared/lib/payment-methods';

const KEY = 'withfestival.payment-methods.1';

describe('shared/lib/payment-methods (unit)', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to remit only, easy pay off', () => {
    expect(getPaymentMethodSettings(1)).toEqual({
      remitEnabled: true,
      easyPayEnabled: false,
    });
  });

  it('keeps easy pay off even if a device saved it on earlier', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ remitEnabled: true, easyPayEnabled: true }),
    );
    expect(getPaymentMethodSettings(1).easyPayEnabled).toBe(false);
  });

  it('falls back to defaults when nothing would be enabled', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ remitEnabled: false, easyPayEnabled: true }),
    );
    expect(getPaymentMethodSettings(1)).toEqual({
      remitEnabled: true,
      easyPayEnabled: false,
    });
  });

  it('falls back to defaults on unreadable storage', () => {
    localStorage.setItem(KEY, '{not json');
    expect(getPaymentMethodSettings(1).remitEnabled).toBe(true);
  });

  it('refuses to save with every method off', () => {
    expect(
      setPaymentMethodSettings(1, {
        remitEnabled: false,
        easyPayEnabled: false,
      }),
    ).toBe(false);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('saves a valid setting', () => {
    expect(
      setPaymentMethodSettings(1, {
        remitEnabled: true,
        easyPayEnabled: false,
      }),
    ).toBe(true);
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      remitEnabled: true,
      easyPayEnabled: false,
    });
  });
});
