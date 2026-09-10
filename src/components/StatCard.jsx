import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = 'bg-neutral-100 text-neutral-700',
  onClick,
  accentColor = 'from-burgundy-800 to-burgundy-900',
}) {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`card-elevated rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between select-none ${
        isClickable
          ? 'cursor-pointer group active:scale-[0.98]'
          : ''
      }`}
    >
      {/* Top Gradient Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentColor}`} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-burgundy-800 transition-colors">
          {title}
        </span>
        
        <div className="flex items-center space-x-1.5">
          {Icon && (
            <div className="h-9 w-9 rounded-xl bg-burgundy-50/80 border border-burgundy-100/80 flex items-center justify-center text-burgundy-800 shrink-0 group-hover:bg-burgundy-800 group-hover:text-white transition-all duration-200 group-hover:shadow-md group-hover:shadow-burgundy-900/20">
              <Icon className="h-4 w-4" />
            </div>
          )}
          {isClickable && (
            <ArrowUpRight className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-all duration-200 text-burgundy-800 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline flex-wrap gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-outfit text-neutral-900 tracking-tight">
            {value}
          </span>
          {badgeText && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs ${badgeColor}`}>
              {badgeText}
            </span>
          )}
        </div>
        
        {subtitle && (
          <p className="text-xs text-neutral-500 mt-1 font-medium flex items-center justify-between">
            <span>{subtitle}</span>
            {isClickable && (
              <span className="text-[11px] text-burgundy-800 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Explore →
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
