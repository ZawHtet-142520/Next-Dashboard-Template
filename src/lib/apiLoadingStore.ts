let activeRequestCount = 0;

const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const incrementApiLoading = () => {
  activeRequestCount += 1;
  notify();
};

export const decrementApiLoading = () => {
  if (activeRequestCount > 0) {
    activeRequestCount -= 1;
    notify();
  }
};

export const subscribeApiLoading = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getApiLoadingSnapshot = () => activeRequestCount;
