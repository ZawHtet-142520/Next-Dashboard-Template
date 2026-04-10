import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Hook to help render modal content via React portal
 * Ensures modals appear at document root level instead of being clipped by parent containers
 */
export function useModalPortal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    isMounted: mounted,
    createPortal: (element: React.ReactElement, target?: string) => {
      if (!mounted) return null;
      const container = target ? document.getElementById(target) : document.body;
      return container ? createPortal(element, container) : null;
    },
  };
}
