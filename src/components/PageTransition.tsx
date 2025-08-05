'use client';

import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (displayChildren !== children) {
      const timer = setTimeout(() => {
        setDisplayChildren(children);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [children, displayChildren]);

  // Простая версия без сложной логики
  return (
    <div className="transition-all duration-300 ease-in-out">
      {children}
    </div>
  );
} 