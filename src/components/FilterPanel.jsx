import React from 'react';
import { Search, RotateCcw, X, Filter, Sparkles } from 'lucide-react';

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
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs mb-6 space-y-4">
      
      {/* Top Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
        <div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-burgundy-800" />
            <h3 className="text-xs font-bold text-neutral-900 font-outfit uppercase tracking-wider">
              Search & Filter Panel
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Quickly locate participants by name, college, verification status, or event
          </p>
        </div>

        {/* Status Count & Clear Button */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
            Showing <strong className="text-burgundy-800 font-bold mx-1">{totalFilteredCount}</strong> of {totalRawCount}
          </span>

          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md border border-burgundy-200 text-xs font-semibold text-burgundy-800 bg-burgundy-50 hover:bg-burgundy-100 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear Filters ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by participant name, college, email, phone, transaction ID, event..."
          className="block w-full pl-10 pr-10 py-2.5 text-xs border border-neutral-300 rounded-lg bg-neutral-50/50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-burgundy-800 focus:border-burgundy-800 focus:bg-white transition-all shadow-xs"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        
        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1 tracking-wider">
            College / Institute
          </label>
          <select
            value={selectedCollege}
            onChange={(e) => onCollegeChange(e.target.value)}
            className="w-full text-xs py-2 px-2.5 border border-neutral-300 rounded-lg bg-white text-neutral-800 font-medium focus:ring-2 focus:ring-burgundy-800 focus:border-burgundy-800 shadow-xs"
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
          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1 tracking-wider">
            Verification Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full text-xs py-2 px-2.5 border border-neutral-300 rounded-lg bg-white text-neutral-800 font-medium focus:ring-2 focus:ring-burgundy-800 focus:border-burgundy-800 shadow-xs"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified Only (Approved)</option>
            <option value="New">New / Pending Only</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1 tracking-wider">
            Registered Event
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => onEventChange(e.target.value)}
            className="w-full text-xs py-2 px-2.5 border border-neutral-300 rounded-lg bg-white text-neutral-800 font-medium focus:ring-2 focus:ring-burgundy-800 focus:border-burgundy-800 shadow-xs"
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
          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1 tracking-wider">
            Department
          </label>
          <select
            value={selectedDept}
            onChange={(e) => onDeptChange(e.target.value)}
            className="w-full text-xs py-2 px-2.5 border border-neutral-300 rounded-lg bg-white text-neutral-800 font-medium focus:ring-2 focus:ring-burgundy-800 focus:border-burgundy-800 shadow-xs"
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
          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1 tracking-wider">
            Year of Study
          </label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full text-xs py-2 px-2.5 border border-neutral-300 rounded-lg bg-white text-neutral-800 font-medium focus:ring-2 focus:ring-burgundy-800 focus:border-burgundy-800 shadow-xs"
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
