'use client';

import {useEffect, useRef} from 'react';
import {prefersReducedMotion, addResourceHints, inlineCriticalCSS, optimizeNetworkRequests} from '@/utils/optimization';
import {PERFORMANCE} from '@/utils/constants';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableOptimizations?: boolean;
}

export default function PerformanceOptimizer({
  children,
  enableOptimizations = true
}: PerformanceOptimizerProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!enableOptimizations || initialized.current) return;
    initialized.current = true;

    // Add resource hints
    addResourceHints();

    // Check for reduced motion preference
    if (prefersReducedMotion()) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--animation-delay', '0ms');
    }

    // Optimize images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: PERFORMANCE.LAZY_LOAD_THRESHOLD
    });

    images.forEach(img => imageObserver.observe(img));

    // Cleanup function
    return () => {
      imageObserver.disconnect();
    };
  }, [enableOptimizations]);

  // Performance monitoring
  useEffect(() => {
    if (!enableOptimizations) return;

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });

      return () => observer.disconnect();
    }
  }, [enableOptimizations]);

  // Memory optimization
  useEffect(() => {
    if (!enableOptimizations) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, reduce memory usage
        const images = document.querySelectorAll('img:not([data-critical])');
        images.forEach(img => {
          if (img instanceof HTMLImageElement) {
            img.style.filter = 'blur(1px)';
            img.style.transform = 'scale(0.1)';
          }
        });
      } else {
        // Page is visible, restore images
        const images = document.querySelectorAll('img:not([data-critical])');
        images.forEach(img => {
          if (img instanceof HTMLImageElement) {
            img.style.filter = '';
            img.style.transform = '';
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enableOptimizations]);

  // Network optimization
  useEffect(() => {
    if (!enableOptimizations) return;

    // Prefetch next page on hover
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const href = link.getAttribute('href');
        if (href) {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = href;
          document.head.appendChild(prefetchLink);
        }
      });
    });

    // Cleanup prefetch links
    return () => {
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
      prefetchLinks.forEach(link => link.remove());
    };
  }, [enableOptimizations]);

  return <>{children}</>;
} 