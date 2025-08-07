import {PERFORMANCE} from './constants';

// Debounce function for performance optimization
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number = PERFORMANCE.DEBOUNCE_DELAY
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle function for performance optimization
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number = PERFORMANCE.THROTTLE_DELAY
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: PERFORMANCE.LAZY_LOAD_THRESHOLD,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(`(${PERFORMANCE.ANIMATION_REDUCED_MOTION})`).matches;
}

// Optimize images with lazy loading
export function optimizeImage(src: string, width: number, quality: number = PERFORMANCE.IMAGE_QUALITY): string {
  // Add image optimization parameters
  const url = new URL(src, window.location.origin);
  url.searchParams.set('w', width.toString());
  url.searchParams.set('q', quality.toString());
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  
  return url.toString();
}

// Preload critical resources
export function preloadResource(href: string, as: string = 'fetch'): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Prefetch non-critical resources
export function prefetchResource(href: string): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

// Cache management
export class CacheManager {
  private static instance: CacheManager;
  private cache = new Map<string, {data: unknown; timestamp: number; ttl: number}>();

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set(key: string, data: unknown, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): unknown | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string): () => void {
    const start = performance.now();
    return () => this.endTimer(name, start);
  }

  private endTimer(name: string, start: number): void {
    const duration = performance.now() - start;
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
  }

  getAverageTime(name: string): number {
    const times = this.metrics.get(name);
    if (!times || times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [name] of this.metrics) {
      result[name] = this.getAverageTime(name);
    }
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Memory management
export function cleanupMemory(): void {
  if (typeof window === 'undefined') return;
  
  // Clear unused event listeners
  // Clear unused timers
  // Clear unused intervals
  
  // Force garbage collection if available
  if (window.gc) {
    window.gc();
  }
}

// Network optimization
export function optimizeNetworkRequests(): void {
  if (typeof window === 'undefined') return;
  
  // Set up service worker for caching
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  }
}

// Bundle size optimization
export function getBundleSize(): number {
  if (typeof window === 'undefined') return 0;
  
  const performance = window.performance;
  if (!performance || !performance.getEntriesByType) return 0;
  
  const resources = performance.getEntriesByType('resource');
  return resources.reduce((total, resource) => {
    if (resource.name.includes('.js') || resource.name.includes('.css')) {
      return total + ((resource as PerformanceResourceTiming).transferSize || 0);
    }
    return total;
  }, 0);
}

// Critical CSS inlining
export function inlineCriticalCSS(): void {
  if (typeof window === 'undefined') return;
  
  const criticalCSS = `
    /* Critical CSS styles */
    .critical-hidden { display: none !important; }
    .critical-visible { display: block !important; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
}

// Resource hints
export function addResourceHints(): void {
  if (typeof window === 'undefined') return;
  
  // DNS prefetch for external domains
  const domains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
}

// Export singleton instances
export const cacheManager = CacheManager.getInstance();
export const performanceMonitor = PerformanceMonitor.getInstance(); 