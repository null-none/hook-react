import { useState, useEffect } from 'react';

const ONE_SECOND_MS = 1000;

export const useInterval = (ms = ONE_SECOND_MS, deps = []) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setValue(Date.now()), ms);
    return () => clearInterval(interval);
  }, deps);

  return value;
}
