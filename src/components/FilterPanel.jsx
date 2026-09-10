import React from 'react';
import { Search, RotateCcw, X, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function FilterPanel({
  searchTerm,
  onSearchChange,
  selectedCollege,
  onCollegeChange,
  selectedStatus,
  onStatusChange,
  selectedEvent,
  onEventChange,
  selectedDept,
  onDeptChange,
  selectedYear,
  onYearChange,
  collegesList = [],
  eventsList = [],
  deptsList = [],
  yearsList = [],
  onResetFilters,
  totalFilteredCount,
  totalRawCount,
}) {
  const activeFiltersCount = [
    selectedCollege !== 'All' ? selectedCollege : null,
    selectedStatus !== 'All' ? selectedStatus : null,
    selectedEvent !== 'All' ? selectedEvent : null,
    selectedDept !== 'All' ? selectedDept : null,
    selectedYear !== 'All' ? selectedYear : null,
    searchTerm ? 'search' : null,
  ].filter(Boolean).length;

  return (
    <div className="card-elevated rounded-2xl p-5 mb-6 space-y-4">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-lg bg-burgundy-50 border border-burgundy-100 flex items-center justify-center text-burgundy-800">
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs font-extrabold text-neutral-900 font-outfit uppercase tracking-wider">
              Registration Intelligence & Filters
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">
            Search participants dynamically across all institutions, departments, and event categories
          </p>
        </div>

        {/* Counter & Reset Action */}
        <div className="flex items-center space-x-2.5 self-start md:self-auto">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-neutral-100/80 text-neutral-800 border border-neutral-200/80">
            <span className="text-neutral-500 font-medium">Showing:</span>
            <span className="text-burgundy-800 font-extrabold">{totalFilteredCount}</span>
            <span className="text-neutral-400 font-normal">/ {totalRawCount}</span>
          </span>

          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl border border-burgundy-200 text-xs font-bold text-burgundy-800 bg-burgundy-50 hover:bg-burgundy-100 active:scale-95 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Search Field */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-burgundy-800 transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by student name, college, email, phone, transaction ID, or registered event..."
          className="block w-full pl-10 pr-10 py-2.5 text-xs font-medium border border-neutral-200/90 rounded-xl bg-neutral-50/70 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 focus:bg-white transition-all shadow-2xs"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        
        <div>
          <label className="block text-[10px] font-extrabold text-neutral-500 uppercase mb-1 tracking-wider">
            Institution
          </label>
          <select
            value={selectedCollege}
            onChange={(e) => onCollegeChange(e.target.value)}
            className="w-full text-xs py-2 px-2.5 border border-neutral-200/90 rounded-xl bg-white text-neutral-800 font-bold focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 shadow-2xs"
          >
            <option value="All">All Colleges ({collegesList.length})</option>
            {collegesList.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold text-neutral-500 uppercase mb-1 tracking-wider">
            Verification Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full text-xs py-2 px-2.5 border border-neutral-200/90 rounded-xl bg-white text-neutral-800 font-bold focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 shadow-2xs"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified Only (Approved)</option>
            <option value="New">New / Pending Only</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold text-neutral-500 uppercase mb-1 tracking-wider">
            Event Category
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => onEventChange(e.target.value)}
            className="w-full text-xs py-2 px-2.5 border border-neutral-200/90 rounded-xl bg-white text-neutral-800 font-bold focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 shadow-2xs"
          >
            <option value="All">All Events ({eventsList.length})</option>
            {eventsList.map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold text-neutral-500 uppercase mb-1 tracking-wider">
            Department
          </label>
          <select
            value={selectedDept}
            onChange={(e) => onDeptChange(e.target.value)}
            className="w-full text-xs py-2 px-2.5 border border-neutral-200/90 rounded-xl bg-white text-neutral-800 font-bold focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 shadow-2xs"
          >
            <option value="All">All Departments</option>
            {deptsList.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold text-neutral-500 uppercase mb-1 tracking-wider">
            Academic Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full text-xs py-2 px-2.5 border border-neutral-200/90 rounded-xl bg-white text-neutral-800 font-bold focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 shadow-2xs"
          >
            <option value="All">All Years</option>
            {yearsList.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
