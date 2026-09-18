export const IDEMPOTENCY_HEADER = 'Idempotency-Key';

/** First click runs immediately; repeats inside this window are dropped. */
export const SUBMIT_GUARD_MS = 200;
export const LEADING_SUBMIT_OPTIONS = {
  leading: true,
  trailing: false,
} as const;

/** UUID key for a single user intent (one submit / one retry chain). */
export function createIdempotencyKey(scope?: string): string {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  return scope ? `${scope}_${id}` : id;
}

export function idempotencyHeaders(key: string): Record<string, string> {
  return { [IDEMPOTENCY_HEADER]: key };
}

/**
 * Sync lock that blocks overlapping mutations before React re-renders.
 * Debounce / isLoading alone cannot stop double-clicks in the same tick.
 */
export function createInFlightLock() {
  let locked = false;

  return {
    tryAcquire(): boolean {
      if (locked) return false;
      locked = true;
      return true;
    },
    release(): void {
      locked = false;
    },
    get isLocked(): boolean {
      return locked;
    },
  };
}
