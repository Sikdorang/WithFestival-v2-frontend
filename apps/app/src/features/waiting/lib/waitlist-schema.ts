import { z } from 'zod';

export function createWaitlistSchema(messages: {
  nameRequired: string;
  phoneInvalid: string;
  partySizeInvalid: string;
}) {
  return z.object({
    name: z.string().min(1, messages.nameRequired),
    phone: z.string().regex(/^010-\d{3,4}-\d{4}$/, messages.phoneInvalid),
    partySize: z.number().gt(0, messages.partySizeInvalid),
  });
}

export function formatPhoneInput(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const truncated = cleaned.slice(0, 11);

  if (truncated.length > 7) {
    return `${truncated.slice(0, 3)}-${truncated.slice(3, 7)}-${truncated.slice(7)}`;
  }
  if (truncated.length > 3) {
    return `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
  }
  return truncated;
}
