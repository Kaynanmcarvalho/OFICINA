import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 1, className = '', prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { duration: duration * 1000 });

  useEffect(() => {
    spring.set(value);
    
    const unsubscribe = spring.onChange((latest) => {
      setDisplayValue(Math.floor(latest));
    });

    return () => unsubscribe();
  }, [value, spring]);

  return (
    <span className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};

export default AnimatedCounter;
