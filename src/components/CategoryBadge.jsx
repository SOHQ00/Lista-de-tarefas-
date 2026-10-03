import React from 'react';
import { getCategoryById } from '../constants/categories';

export function CategoryBadge({ categoryId, size = 'md', className = '' }) {
  const cat = getCategoryById(categoryId);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide uppercase',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wider uppercase',
    lg: 'text-sm px-3 py-1.5 font-semibold tracking-wider uppercase',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs transition-all duration-150 ${cat.badge} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
      {cat.label}
    </span>
  );
}
