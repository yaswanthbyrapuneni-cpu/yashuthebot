// Lightweight debug utility for Virtual Try-On and face tracking
// Enable via window.DEBUG_VTO = true in DevTools or localStorage.DEBUG_VTO = "1"
export const isDebugVTO = (): boolean => {
  try {
    // @ts-ignore
    if (typeof window !== 'undefined' && (window.DEBUG_VTO === true)) return true;
    if (typeof window !== 'undefined' && window.localStorage?.getItem('DEBUG_VTO') === '1') return true;
  } catch (_) {}
  return false;
};

export const dlog = (...args: any[]) => {
  if (!isDebugVTO()) return;
  // eslint-disable-next-line no-console
  console.log('[VTO]', ...args);
};

export const dwarn = (...args: any[]) => {
  if (!isDebugVTO()) return;
  // eslint-disable-next-line no-console
  console.warn('[VTO]', ...args);
};

export const derror = (...args: any[]) => {
  if (!isDebugVTO()) return;
  // eslint-disable-next-line no-console
  console.error('[VTO]', ...args);
};
