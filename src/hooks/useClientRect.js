import { useState, useCallback, useRef } from 'react';

export default function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useRef(null);
  const setRef = useCallback((node) => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }

    ref.current = node;
  }, []);

  return [rect, ref, setRef];
}
