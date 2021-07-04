import { useState, useCallback, useEffect } from 'react';

const getDeviceBreakpoint = width => {
  if (width < 576) {
    return 'xs';
  }
  if (width > 576 && width <= 768) {
    return 'sm';
  }
  if (width > 768 && width <= 992) {
    return 'md';
  }
  if (width > 922 && width <= 1200) {
    return 'lg';
  }
  if (width > 1200 && width <= 1400) {
    return 'xl';
  }
  return 'xxl';
};

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('xxl');

  const handleResize = useCallback(() => {
    const bp = getDeviceBreakpoint(window.innerWidth);
    setBreakpoint(bp);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return breakpoint;
};
