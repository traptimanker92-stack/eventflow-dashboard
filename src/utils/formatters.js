export const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.round((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays > 7) return `In ${Math.ceil(diffDays / 7)} weeks`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'upcoming':
      return {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        border: 'border-indigo-500/30',
        dot: 'bg-indigo-400',
        glow: 'shadow-[0_0_12px_rgba(99,102,241,0.3)]',
      };
    case 'ongoing':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400 animate-pulse',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
      };
    case 'completed':
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
        glow: '',
      };
    default:
      return {
        bg: 'bg-gray-500/10',
        text: 'text-gray-400',
        border: 'border-gray-500/30',
        dot: 'bg-gray-400',
        glow: '',
      };
  }
};

export const calculateCapacityRate = (registered, capacity) => {
  if (!capacity || capacity === 0) return 0;
  return Math.min(100, Math.round((registered / capacity) * 100));
};

export const getCapacityColorClass = (rate) => {
  if (rate >= 90) return { bar: 'bg-rose-500', text: 'text-rose-400' };
  if (rate >= 75) return { bar: 'bg-amber-500', text: 'text-amber-400' };
  if (rate >= 40) return { bar: 'bg-indigo-500', text: 'text-indigo-400' };
  return { bar: 'bg-emerald-500', text: 'text-emerald-400' };
};
