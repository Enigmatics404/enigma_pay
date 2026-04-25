import React, { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export default function AnimatedCounter({ value, prefix = "", decimals = 0, className }: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return prefix + latest.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [value, count]);

  return (
    <motion.span className={className}>
      {rounded}
    </motion.span>
  );
}
