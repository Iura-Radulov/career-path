'use client';

export default function CTAIllustration() {
  return (
    <div className="relative w-16 h-16 mx-auto mb-6" aria-hidden="true">
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ctaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="ctaGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Outer glow ring */}
        <circle cx="32" cy="32" r="30" stroke="#34D399" strokeWidth="1" opacity="0.2" className="animate-ring-expand" />

        {/* Compass circle */}
        <circle cx="32" cy="32" r="24" stroke="url(#ctaGrad)" strokeWidth="2" opacity="0.6" className="animate-ring-expand" style={{ animationDelay: '0.5s' }} />

        {/* Arrow pointing up-right (growth direction) */}
        <path
          d="M32 18 L38 28 L32 25 L26 28 Z"
          fill="url(#ctaGrad)"
          className="animate-btn-pulse"
          filter="url(#ctaGlow)"
        />

        {/* Second arrow (rotation hint) */}
        <path
          d="M32 18 L38 28 L32 25 L26 28 Z"
          fill="url(#ctaGrad)"
          opacity="0.3"
          transform="rotate(45 32 32)"
        />

        {/* Center dot */}
        <circle cx="32" cy="32" r="3" fill="#34D399" className="animate-btn-pulse" style={{ animationDelay: '0.3s' }} />
      </svg>
    </div>
  );
}
