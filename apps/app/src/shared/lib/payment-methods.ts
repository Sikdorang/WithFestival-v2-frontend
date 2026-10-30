export type PaymentMethodSettings = {
  remitEnabled: boolean;
  easyPayEnabled: boolean;
};

/**
 * Easy pay is not open to booths yet. While false, it is always off
 * (even if a device saved `true` earlier) and the admin toggle is blocked.
 */
export const EASY_PAY_AVAILABLE = false;

const DEFAULT_SETTINGS: PaymentMethodSettings = {
  remitEnabled: true,
  easyPayEnabled: false,
};

function storageKey(storeId: string | number) {
  return `withfestival.payment-methods.${storeId}`;
}

export function getPaymentMethodSettings(
  storeId: string | number,
): PaymentMethodSettings {
  try {
    const raw = localStorage.getItem(storageKey(storeId));
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<PaymentMethodSettings>;
    const remitEnabled = parsed.remitEnabled !== false;
    const easyPayEnabled = EASY_PAY_AVAILABLE && parsed.easyPayEnabled === true;
    if (!remitEnabled && !easyPayEnabled) return DEFAULT_SETTINGS;
    return { remitEnabled, easyPayEnabled };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function setPaymentMethodSettings(
  storeId: string | number,
  next: PaymentMethodSettings,
) {
  if (!next.remitEnabled && !next.easyPayEnabled) return false;
  localStorage.setItem(storageKey(storeId), JSON.stringify(next));
  return true;
}
