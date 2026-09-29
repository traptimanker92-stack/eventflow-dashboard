import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  colorScheme = 'indigo',
  onClick,
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      iconBg: 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30',
      hoverGlow: 'hover:border-indigo-500/40 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]',
      gradient: 'from-indigo-500/10 to-transparent',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      iconBg: 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30',
      hoverGlow: 'hover:border-cyan-500/40 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]',
      gradient: 'from-cyan-500/10 to-transparent',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30',
      hoverGlow: 'hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]',
      gradient: 'from-emerald-500/10 to-transparent',
    },
    fuchsia: {
      bg: 'bg-fuchsia-500/10',
      border: 'border-fuchsia-500/20',
      iconBg: 'bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30',
      hoverGlow: 'hover:border-fuchsia-500/40 hover:shadow-[0_8px_30px_rgba(217,70,239,0.15)]',
      gradient: 'from-fuchsia-500/10 to-transparent',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-600/20 text-amber-400 border border-amber-500/30',
      hoverGlow: 'hover:border-amber-500/40 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]',
      gradient: 'from-amber-500/10 to-transparent',
    },
  };

  const currentTheme = colorMap[colorScheme] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-300 ${currentTheme.hoverGlow} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Background soft ambient gradient */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${currentTheme.gradient} rounded-full blur-2xl pointer-events-none -mr-8 -mt-8`}
      />

      <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${currentTheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2.5 relative z-10">
        <span className="text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <div
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${
              trendPositive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {trendPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {trend}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-gray-400 relative z-10 flex items-center gap-1.5">
          {subtitle}
        </p>
      )}
    </div>
  );
};
