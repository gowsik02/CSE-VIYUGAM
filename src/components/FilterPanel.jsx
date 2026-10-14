import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, RotateCcw, X, SlidersHorizontal, User, Building, CheckCircle, Clock, ChevronRight, Award, Sparkles } from 'lucide-react';
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

  const activeFilters = useMemo(() => {
    const list = [];
    if (selectedCollege !== 'All') list.push({ key: 'college', label: `College: ${selectedCollege}`, onRemove: () => onCollegeChange('All') });
    if (selectedStatus !== 'All') list.push({ key: 'status', label: `Status: ${selectedStatus}`, onRemove: () => onStatusChange('All') });
    if (selectedEvent !== 'All') list.push({ key: 'event', label: `Event: ${selectedEvent}`, onRemove: () => onEventChange('All') });
    if (selectedDept !== 'All') list.push({ key: 'dept', label: `Dept: ${selectedDept}`, onRemove: () => onDeptChange('All') });
    if (selectedYear !== 'All') list.push({ key: 'year', label: `Year: ${selectedYear}`, onRemove: () => onYearChange('All') });
    if (searchTerm) list.push({ key: 'search', label: `Search: "${searchTerm}"`, onRemove: () => onSearchChange('') });
    return list;
  }, [selectedCollege, selectedStatus, selectedEvent, selectedDept, selectedYear, searchTerm, onCollegeChange, onStatusChange, onEventChange, onDeptChange, onYearChange, onSearchChange]);

  // Filter participants for live autocomplete suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) return [];
    const term = searchTerm.trim().toLowerCase();

    return allParticipants.filter((item) => {
      const matchName = item.name && item.name.toLowerCase().includes(term);
      const matchCollege = item.college && item.college.toLowerCase().includes(term);
      const matchId = item.id && item.id.toLowerCase().includes(term);
      const matchEmail = item.email && item.email.toLowerCase().includes(term);
      const matchPhone = item.phone && item.phone.includes(term);
      const matchTxn = item.transactionId && item.transactionId.toLowerCase().includes(term);
      const matchEvents = Array.isArray(item.events) && item.events.some(e => e.toLowerCase().includes(term));
      const matchDept = item.department && item.department.toLowerCase().includes(term);
      const matchTeam = item.teamName && item.teamName.toLowerCase().includes(term);

      return matchName || matchCollege || matchId || matchEmail || matchPhone || matchTxn || matchEvents || matchDept || matchTeam;
    }).slice(0, 8);
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

  const handleSelectSuggestion = (participant) => {
    setIsDropdownOpen(false);
    if (onSelectParticipant) {
      onSelectParticipant(participant);
    }
  };

  return (
    <div className="card-elevated rounded-2xl p-4 sm:p-5 mb-6 space-y-4">
      
      {/* Top Bar: Title & Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-burgundy-50 border border-burgundy-100 flex items-center justify-center text-burgundy-800">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
            Search & Filter Controls
          </h3>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900 font-bold">{totalFilteredCount}</strong> of <strong className="text-slate-900">{totalRawCount}</strong> registrations
          </div>
          {activeFilters.length > 0 && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-700 hover:text-rose-800 hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        
        {/* Instant Spotlight Search with Autocomplete */}
        <div className="md:col-span-12 lg:col-span-4 relative" ref={searchContainerRef}>
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search by student name, college, phone, txn ID..."
              className="w-full pl-9 pr-8 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Floating Autocomplete Dropdown */}
          {isDropdownOpen && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-dropdown border border-slate-200 z-50 overflow-hidden max-h-80 overflow-y-auto">
              <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Matching Participants ({searchSuggestions.length})</span>
                <span className="text-slate-400 font-normal">Click to inspect</span>
              </div>
              <div className="divide-y divide-slate-100">
                {searchSuggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="p-2.5 hover:bg-burgundy-50/50 cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-burgundy-100 text-burgundy-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {item.name ? item.name[0].toUpperCase() : 'P'}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-burgundy-800 transition-colors truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                          <Building className="h-2.5 w-2.5 text-slate-400" />
                          <span>{item.college}</span>
                          {item.transactionId && (
                            <span className="font-mono text-slate-400 ml-1">• Txn: {item.transactionId}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ml-2 ${
                      item.isVerified ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-rose-100 text-rose-900 border border-rose-200'
                    }`}>
                      {item.isVerified ? 'Verified (YES)' : 'Non-Verified (NO)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* College Filter */}
        <div className="md:col-span-6 lg:col-span-3">
          <select
            value={selectedCollege}
            onChange={(e) => onCollegeChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 transition-all shadow-2xs cursor-pointer"
          >
            <option value="All">🏢 All Colleges ({collegesList.length})</option>
            {collegesList.map((col, idx) => (
              <option key={idx} value={col}>{col}</option>
            ))}
          </select>
        </div>

        {/* Payment / Verification Status Filter */}
        <div className="md:col-span-6 lg:col-span-2">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 transition-all shadow-2xs cursor-pointer"
          >
            <option value="All">⚡ All Statuses</option>
            <option value="Verified">✅ Verified Names (YES in Excel)</option>
            <option value="New">❌ Non-Verified Names (NO in Excel)</option>
          </select>
        </div>

        {/* Event Filter */}
        <div className="md:col-span-6 lg:col-span-3">
          <select
            value={selectedEvent}
            onChange={(e) => onEventChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 transition-all shadow-2xs cursor-pointer"
          >
            <option value="All">🏆 All Events ({eventsList.length})</option>
            {eventsList.map((evt, idx) => (
              <option key={idx} value={evt}>{evt}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1">Active:</span>
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-burgundy-50 border border-burgundy-100 text-burgundy-900 text-xs font-bold"
            >
              <span>{f.label}</span>
              <button
                type="button"
                onClick={f.onRemove}
                className="text-burgundy-700 hover:text-burgundy-950 p-0.5 rounded-full hover:bg-burgundy-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

    </div>
  );
}
