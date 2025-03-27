import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Performance optimizations
const optimizeAppPerformance = () => {
  // Add support for native lazy loading of images
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      if (!img.hasAttribute('loading') && img.getAttribute('src') !== '/images/hero-particles.svg') {
        img.setAttribute('loading', 'lazy');
      }
    });
  }
  
  // Optimize animations based on user preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduced-motion');
  }
  
  // Preload critical assets
  const preloadLinks = [
    { rel: 'preload', href: '/images/hero-particles.svg', as: 'image' },
    { rel: 'preload', href: 'https://i.imgur.com/WzQYOFg.png', as: 'image' }
  ];
  
  preloadLinks.forEach(link => {
    const linkEl = document.createElement('link');
    linkEl.rel = link.rel;
    linkEl.href = link.href;
    linkEl.as = link.as;
    document.head.appendChild(linkEl);
  });
};

// Run performance optimizations on mount
if (typeof window !== 'undefined') {
  // Execute on first contentful paint
  window.addEventListener('DOMContentLoaded', optimizeAppPerformance);
}

createRoot(document.getElementById("root")!).render(<App />);
