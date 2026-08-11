// Local debounce hook — built inside module to avoid importing from src/hooks/* (H4).
// Returns a debounced copy of `value` that updates only after `delay` ms of silence.

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
