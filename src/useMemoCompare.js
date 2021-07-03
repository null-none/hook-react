import { useRef, useEffect } from 'react';

export const useMemoCompare = (value, compare) => {
  const { current } = useRef({
    first: value,
    last: value,
  });
  const isEqual = current.last === value || current.first === value || compare(current.last, value);
  useEffect(() => {
    if (!isEqual) {
      current.first = value;
    }
    current.last = value;
  });
  return isEqual ? current.first : value;
};
