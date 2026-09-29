import React from 'react';

export const ProgressBar = ({ current = 0, max = 100, showLabel = true, size = 'md' }) => {
  const percentage = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;

  // Dynamic gradient based on fill rate
  let barGradient = 'from-indigo-500 to-indigo-600';
  let badgeColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';

  if (percentage >= 95) {
    barGradient = 'from-rose-500 to-amber-500';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  } else if (percentage >= 75) {
    barGradient = 'from-amber-500 to-orange-500';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  } else if (percentage >= 40) {
    barGradient = 'from-blue-500 to-indigo-500';
    badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  } else {
    barGradient = 'from-emerald-500 to-teal-500';
    badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-gray-400">
            Capacity Fill: <strong className="text-gray-200">{current}</strong> / {max}
          </span>
          <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${badgeColor}`}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-800/80 rounded-full overflow-hidden p-0.5 border border-gray-700/50 ${heightClasses[size] || 'h-2.5'}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
