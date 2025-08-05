'use client';

import { Link } from '@/i18n/routing';
import { ReactNode } from 'react';

interface SmoothLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function SmoothLink({ href, className, children }: SmoothLinkProps) {
  return (
    <Link 
      href={href} 
      className={className}
    >
      {children}
    </Link>
  );
} 