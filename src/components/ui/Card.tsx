'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Card({ children, className = '', hover, onClick }: { children: ReactNode; className?: string; hover?: boolean; onClick?: () => void }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      onClick={onClick}
      className={`bg-bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300
        ${hover ? 'cursor-pointer hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5' : ''}
        ${className}`}
    >
      {children}
    </motion.div>
  );
}
