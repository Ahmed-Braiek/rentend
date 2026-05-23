// Fake async layer. Swap this file for a real backend later — call sites stay
// unchanged. Every helper returns a Promise that resolves after a small delay
// so the UI can render real loading states.

const wait = <T>(value: T, ms = 600): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const api = {
  submitVerification: () => wait({ ok: true } as const, 1800),
  publishListing: (id: string) => wait({ id, published: true } as const, 800),
  sendMessage: () => wait({ ok: true } as const, 200),
  advanceDelivery: () => wait({ ok: true } as const, 400),
};
