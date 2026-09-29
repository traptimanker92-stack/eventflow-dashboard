import React from 'react';
import { Search, X, Filter, SlidersHorizontal, LayoutGrid, Table } from 'lucide-react';
import { CATEGORIES, STATUS_OPTIONS } from '../data/initialData';

export const SearchFilter = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  placeholder = 'Search by event name, speaker, or venue...',
}) => {
  const hasActiveFilters =
    searchQuery || selectedStatus !== 'All' || (selectedCategory && selectedCategory !== 'All');

  const handleClear = () => {
    onSearchChange('');
    onStatusChange('All');
    if (onCategoryChange) onCategoryChange('All');
  };

  return (
    <div className="flex flex-col gap-3.5 w-full bg-[#111827]/80 backdrop-blur-xl border border-gray-800/80 p-4 rounded-2xl shadow-xl">
      {/* Search Input and View Switcher Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-9 py-2.5 bg-gray-900/90 border border-gray-700/60 rounded-xl text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category selector & View mode buttons */}
        <div className="flex items-center gap-2">
          {onCategoryChange && (
            <select
              value={selectedCategory || 'All'}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-3.5 py-2.5 bg-gray-900/90 border border-gray-700/60 rounded-xl text-xs font-semibold text-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-gray-900 text-gray-200">
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          )}

          {onViewModeChange && (
            <div className="flex items-center bg-gray-900 p-1 rounded-xl border border-gray-800">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Table View"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          )}

          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors shrink-0"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <span className="text-xs font-semibold text-gray-400 mr-2 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Status:
        </span>
        {STATUS_OPTIONS.map((status) => {
          const isSelected = selectedStatus === status;
          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
};
