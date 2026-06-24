'use client';

export default function HeroIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" aria-hidden="true">
      <svg
        viewBox="0 0 600 500"
        className="w-full h-full max-w-[600px] lg:max-w-[650px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="pathGlow" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="nodeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="skyGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="1" />
            <stop offset="50%" stopColor="#0F172A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mountain1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="mountain2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background gradient */}
        <rect x="0" y="0" width="600" height="500" fill="url(#skyGrad)" />

        {/* Mountains (background) */}
        <g className="animate-float-slow">
          <path d="M0 450 Q80 320 170 380 Q220 340 300 360 Q380 300 450 340 Q520 310 600 360 L600 500 L0 500 Z" fill="url(#mountain2)" opacity="0.4" />
          <path d="M0 470 Q120 380 200 420 Q300 370 400 400 Q500 360 600 420 L600 500 L0 500 Z" fill="url(#mountain1)" opacity="0.6" />
        </g>

        {/* Career path - animated dashed line */}
        <path
          d="M60 420 C100 380 120 360 160 330 C200 300 220 260 250 250 C280 240 290 200 310 190 C330 180 350 140 380 130 C410 120 430 90 480 70"
          stroke="url(#pathGlow)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="8 6"
          className="animate-path-dash"
          filter="url(#softGlow)"
        />

        {/* Nodes on the path */}
        {/* Node 1 - Start */}
        <g className="animate-node-pulse" style={{ animationDelay: '0s' }}>
          <circle cx="60" cy="420" r="8" fill="#059669" opacity="0.3" filter="url(#glow)" />
          <circle cx="60" cy="420" r="5" fill="url(#nodeGrad)" />
        </g>

        {/* Node 2 */}
        <g className="animate-node-pulse" style={{ animationDelay: '0.6s' }}>
          <circle cx="160" cy="330" r="9" fill="#059669" opacity="0.3" filter="url(#glow)" />
          <circle cx="160" cy="330" r="6" fill="url(#nodeGrad)" />
        </g>

        {/* Node 3 */}
        <g className="animate-node-pulse" style={{ animationDelay: '1.2s' }}>
          <circle cx="250" cy="250" r="10" fill="#059669" opacity="0.3" filter="url(#glow)" />
          <circle cx="250" cy="250" r="7" fill="url(#nodeGrad)" />
        </g>

        {/* Node 4 */}
        <g className="animate-node-pulse" style={{ animationDelay: '1.8s' }}>
          <circle cx="340" cy="185" r="9" fill="#059669" opacity="0.3" filter="url(#glow)" />
          <circle cx="340" cy="185" r="6" fill="url(#nodeGrad)" />
        </g>

        {/* Node 5 - Summit */}
        <g className="animate-node-pulse" style={{ animationDelay: '2.4s' }}>
          <circle cx="480" cy="70" r="12" fill="#059669" opacity="0.3" filter="url(#glow)" />
          <circle cx="480" cy="70" r="8" fill="url(#nodeGrad)" filter="url(#glow)" />
          {/* Star on top */}
          <path
            d="M480 56 L483 63 L490 63 L485 68 L487 75 L480 71 L473 75 L475 68 L470 63 L477 63 Z"
            fill="#34D399"
            opacity="0.8"
          />
        </g>

        {/* Floating particles */}
        <g className="animate-float-up" opacity="0.6">
          <circle cx="120" cy="380" r="2" fill="#34D399" />
        </g>
        <g className="animate-float-up" style={{ animationDelay: '0.8s' }} opacity="0.5">
          <circle cx="200" cy="300" r="1.5" fill="#6EE7B7" />
        </g>
        <g className="animate-float-up" style={{ animationDelay: '1.5s' }} opacity="0.4">
          <circle cx="290" cy="240" r="2.5" fill="#34D399" />
        </g>
        <g className="animate-float-up" style={{ animationDelay: '2.2s' }} opacity="0.5">
          <circle cx="380" cy="180" r="1.8" fill="#6EE7B7" />
        </g>
        <g className="animate-float-up" style={{ animationDelay: '3s' }} opacity="0.3">
          <circle cx="450" cy="120" r="2" fill="#34D399" />
        </g>

        {/* Small decorative stars */}
        <g opacity="0.3">
          <text x="80" y="280" fontSize="10" fill="#34D399">✦</text>
          <text x="350" y="100" fontSize="8" fill="#6EE7B7">✦</text>
          <text x="500" y="200" fontSize="12" fill="#34D399" opacity="0.4">✦</text>
          <text x="180" y="200" fontSize="6" fill="#6EE7B7">✦</text>
        </g>
      </svg>
    </div>
  );
}
