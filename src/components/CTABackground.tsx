'use client';

export default function CTABackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 animate-gradient-shift opacity-30"
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #0f172a 30%, #0f172a 70%, #34D399 100%)',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Floating glowing orbs */}
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl animate-orb-drift"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-emerald-400/8 blur-3xl animate-orb-drift"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-emerald-500/6 blur-3xl animate-orb-drift"
        style={{ animationDelay: '4s' }}
      />

      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
