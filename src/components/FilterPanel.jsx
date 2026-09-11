import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, RotateCcw, X, Filter, Sparkles, SlidersHorizontal, User, Building, CheckCircle, Clock, ChevronRight, Award } from 'lucide-react';
import { formatDate } from '../utils/formatters';

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
  allParticipants = [],
  onSelectParticipant,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const activeFiltersCount = [
    selectedCollege !== 'All' ? selectedCollege : null,
    selectedStatus !== 'All' ? selectedStatus : null,
    selectedEvent !== 'All' ? selectedEvent : null,
    selectedDept !== 'All' ? selectedDept : null,
    selectedYear !== 'All' ? selectedYear : null,
    searchTerm ? 'search' : null,
  ].filter(Boolean).length;

  // Filter participants for live autocomplete suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) return [];
    const term = searchTerm.trim().toLowerCase();

    return allParticipants.filter((item) => {
      const matchName = item.name && item.name.toLowerCase().includes(term);
      const matchCollege = item.college && item.college.toLowerCase().includes(term);
      const matchId = item.id && item.id.toLowerCase().includes(term);
      const matchRow = item.rowIndex && String(item.rowIndex).includes(term);
      const matchEmail = item.email && item.email.toLowerCase().includes(term);
      const matchPhone = item.phone && item.phone.includes(term);
      const matchTxn = item.transactionId && item.transactionId.toLowerCase().includes(term);
      const matchEvents = Array.isArray(item.events) && item.events.some(e => e.toLowerCase().includes(term));
      const matchDept = item.department && item.department.toLowerCase().includes(term);

      return matchName || matchCollege || matchId || matchRow || matchEmail || matchPhone || matchTxn || matchEvents || matchDept;
    });
  }, [searchTerm, allParticipants]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Esc key to close dropdown
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const handleSelectSuggestion = (participant) => {
    setIsDropdownOpen(false);
    if (onSelectParticipant) {
      onSelectParticipant(participant);
    }
  };

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
              onClick={() => {
                onResetFilters();
                setIsDropdownOpen(false);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl border border-burgundy-200 text-xs font-bold text-burgundy-800 bg-burgundy-50 hover:bg-burgundy-100 active:scale-95 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Search Field with Autocomplete Dropdown */}
      <div className="relative group" ref={searchContainerRef}>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-burgundy-800 transition-colors z-10">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setIsDropdownOpen(true);
          }}
          placeholder="Search by student name, ID, college, email, phone, transaction ID, or registered event..."
          className="block w-full pl-10 pr-10 py-2.5 text-xs font-medium border border-neutral-200/90 rounded-xl bg-neutral-50/70 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 focus:bg-white transition-all shadow-2xs"
        />
        {searchTerm && (
          <button
            onClick={() => {
              onSearchChange('');
              setIsDropdownOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Dynamic Search Autocomplete Dropdown */}
        {isDropdownOpen && searchTerm && searchTerm.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in duration-150">
            
            {/* Dropdown Header */}
            <div className="px-4 py-2.5 bg-neutral-50/90 border-b border-neutral-200/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-1.5 text-neutral-600 font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-burgundy-800" />
                <span>Matching Participants</span>
                <span className="text-burgundy-800 bg-burgundy-50 px-2 py-0.5 rounded-full border border-burgundy-200 font-extrabold text-[10px]">
                  {searchSuggestions.length} found
                </span>
              </div>
              <span className="text-neutral-400 text-[10px]">Click any participant to view details</span>
            </div>

            {/* Suggestions List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
              {searchSuggestions.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-500 font-medium">
                  No matching participant records found for "<strong className="text-neutral-800">{searchTerm}</strong>".
                </div>
              ) : (
                searchSuggestions.slice(0, 8).map((participant) => {
                  const initials = participant.name ? participant.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'P';
                  return (
                    <div
                      key={participant.id}
                      onClick={() => handleSelectSuggestion(participant)}
                      className="p-3.5 hover:bg-burgundy-50/40 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* Student Initials Avatar */}
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-burgundy-700 to-burgundy-900 border border-burgundy-600/40 flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-neutral-900 group-hover:text-burgundy-900 text-xs truncate font-outfit">
                              {participant.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded shrink-0">
                              {participant.id}
                            </span>
                          </div>

                          <div className="text-[11px] text-neutral-600 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                            <Building className="h-3 w-3 text-burgundy-800 shrink-0" />
                            <span className="truncate">{participant.college}</span>
                            <span className="text-neutral-300">•</span>
                            <span className="text-neutral-500 shrink-0">{participant.department}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5 shrink-0 ml-3">
                        {/* Status Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          participant.isVerified
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {participant.isVerified ? 'Verified' : 'New'}
                        </span>

                        <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-burgundy-800 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Dropdown Footer */}
            {searchSuggestions.length > 8 && (
              <div className="p-2.5 bg-neutral-50 text-center text-[11px] text-neutral-500 font-bold border-t border-neutral-200/80">
                + {searchSuggestions.length - 8} more matches in table directory below
              </div>
            )}

          </div>
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
