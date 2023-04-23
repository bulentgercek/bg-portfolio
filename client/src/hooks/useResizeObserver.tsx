import { useEffect, useRef, useState } from "react";

/**
 * Custom resize observer hook for DOM elements
 * and returning RefObject reference and contentRect data
 * @returns Array
 */
export const useResizeObserver = <T extends HTMLElement>(): [React.RefObject<T>, DOMRectReadOnly?] => {
  const refElement = useRef<T>(null);
  const [contentRectData, setContentRectData] = useState<DOMRectReadOnly>();

  useEffect(() => {
    if (refElement.current) {
      const Observer = new ResizeObserver((entries) => {
        setContentRectData(entries[0].contentRect);
      });
      Observer.observe(refElement.current);

      return () => {
        Observer.disconnect();
      };
    }
  }, []);

  return [refElement, contentRectData];
};
