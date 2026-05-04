import { type RefObject, useEffect, useState } from "react";

/**
 * Vertical shift derived from how far the section's center is from the viewport center.
 * Use for subtle translateY on decorative layers (parallax). Respects `prefers-reduced-motion`.
 */
export function useParallaxOffset(ref: RefObject<HTMLElement | null>, strength = 0.12): number {
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const centerDist = rect.top + rect.height / 2 - vh / 2;
        setShift(centerDist * strength);
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, [ref, strength]);

  return shift;
}
