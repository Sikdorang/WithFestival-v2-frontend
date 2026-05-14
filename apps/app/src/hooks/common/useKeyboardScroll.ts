import { useCallback, useRef } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

export const useKeyboardScroll = <T extends HTMLElement = HTMLDivElement>() => {
  const targetRef = useRef<T>(null);

  const handleFocus = useCallback(() => {
    setTimeout(() => {
      if (targetRef.current) {
        scrollIntoView(targetRef.current, {
          scrollMode: 'if-needed',
          block: 'center',
          behavior: 'smooth',
        });
      }
    }, 200);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  return {
    targetRef,
    handleFocus,
    handleBlur,
  };
};
