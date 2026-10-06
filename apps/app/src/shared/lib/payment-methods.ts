export type PaymentMethodSettings = {
  remitEnabled: boolean;
  easyPayEnabled: boolean;
};

const DEFAULT_SETTINGS: PaymentMethodSettings = {
  remitEnabled: true,
  easyPayEnabled: true,
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
    const easyPayEnabled = parsed.easyPayEnabled !== false;
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
