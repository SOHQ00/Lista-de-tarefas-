import React from 'react';
import { getPriorityById } from '../constants/priorities';
import { AlertCircle, AlertTriangle, ArrowDown } from 'lucide-react';

export function PriorityBadge({ priorityId, size = 'md', showIcon = true, className = '' }) {
  const p = getPriorityById(priorityId);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide uppercase',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wider uppercase',
    lg: 'text-sm px-3 py-1.5 font-semibold tracking-wider uppercase',
  };

  const renderIcon = () => {
    if (!showIcon) return null;
    const iconSize = size === 'sm' ? 12 : 14;
    if (p.id === 'ALTA') return <AlertCircle size={iconSize} className="text-rose-600" />;
    if (p.id === 'MEDIA') return <AlertTriangle size={iconSize} className="text-amber-600" />;
    return <ArrowDown size={iconSize} className="text-slate-500" />;
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border shadow-xs transition-all duration-150 ${p.badge} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {renderIcon()}
      <span>{p.label}</span>
    </span>
  );
}
