'use client';

export default function Logo({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const width = size === 'lg' ? 220 : 180;
  const height = size === 'lg' ? 55 : 45;

  return (
    <img
      src="/logos/logo-compass.svg"
      alt="Career Path Simulator"
      width={width}
      height={height}
      className="block h-auto"
      style={{ display: 'block', maxWidth: 'none' }}
    />
  );
}
