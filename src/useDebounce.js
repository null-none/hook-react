import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handleId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handleId);
  }, [delay, value]);

  return debouncedValue;
};
