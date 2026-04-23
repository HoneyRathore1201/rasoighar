'use client';

const variants: Record<string, string> = {
  accent: 'bg-accent/15 text-accent',
  green: 'bg-success/15 text-success',
  saffron: 'bg-accent/15 text-accent',
  chili: 'bg-danger/15 text-danger',
  maroon: 'bg-warning/15 text-warning',
  gray: 'bg-bg-hover text-text-secondary',
};

export default function Badge({ children, variant = 'gray', size = 'sm' }: { children: React.ReactNode; variant?: string; size?: 'sm' | 'md' }) {
  const v = variants[variant] || variants.gray;
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${v} ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
      {children}
    </span>
  );
}
