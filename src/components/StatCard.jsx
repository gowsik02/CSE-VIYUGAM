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
}) {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`bg-white rounded-xl border border-neutral-200 p-5 shadow-xs transition-all duration-200 flex flex-col justify-between select-none ${
        isClickable
          ? 'hover:border-burgundy-800 hover:shadow-md cursor-pointer group active:scale-[0.99]'
          : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider group-hover:text-burgundy-800 transition-colors">
          {title}
        </span>
        <div className="flex items-center space-x-1">
          {Icon && (
            <div className="h-8 w-8 rounded-lg bg-burgundy-50 border border-burgundy-100 flex items-center justify-center text-burgundy-800 shrink-0 group-hover:bg-burgundy-800 group-hover:text-white transition-colors">
              <Icon className="h-4 w-4" />
            </div>
          )}
          {isClickable && (
            <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity text-burgundy-800" />
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-outfit text-neutral-900 tracking-tight">
            {value}
          </span>
          {badgeText && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${badgeColor}`}>
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-neutral-500 mt-1 font-medium flex items-center justify-between">
            <span>{subtitle}</span>
            {isClickable && (
              <span className="text-[10px] text-burgundy-800 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                View →
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
