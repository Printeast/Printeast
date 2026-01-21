import { useScroll, useSpring, useTransform, MotionValue } from "framer-motion";

export function useSmoothScroll() {
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return { scrollY, smoothY };
}

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [0, -distance]);
}
