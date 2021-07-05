import { useEffect, useState, useRef } from 'react';

export const useHeight = () => {
  const ref = useRef(null);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    const newHeight = ref.current.offsetHeight;
    if (newHeight) setHeight(newHeight);
  }, [ref]);

  return { ref, height, isHeightSet: !!height };
};
