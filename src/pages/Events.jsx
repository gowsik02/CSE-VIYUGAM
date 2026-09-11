import React, { useState, useMemo } from 'react';
import { CalendarDays, Award, Users, Download, Sparkles, Search, ChevronRight, CheckCircle, Clock, Building, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateEventParticipation, calculateEventDetailedBreakdown } from '../utils/analytics';
import { formatDate } from '../utils/formatters';

export default function Events({ data, onExportCSV, onSelectParticipant, onToggleVerify }) {
  const [selectedEventFilter, setSelectedEventFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const eventStats = useMemo(() => calculateEventParticipation(data), [data]);
  const eventDetailedBreakdown = useMemo(() => calculateEventDetailedBreakdown(data), [data]);

  // Filter events according to selected tab and search query
  const displayedEvents = useMemo(() => {
    let list = eventDetailedBreakdown;

    if (selectedEventFilter !== 'ALL') {
      list = list.filter(e => e.eventName === selectedEventFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.map(evt => {
        const filteredParticipants = evt.participants.filter(p => 
          p.name.toLowerCase().includes(q) ||
          p.college.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q)
        );
        return {
          ...evt,
          participants: filteredParticipants
        };
      }).filter(evt => evt.participants.length > 0 || evt.eventName.toLowerCase().includes(q));
    }

    return list;
  }, [eventDetailedBreakdown, selectedEventFilter, searchQuery]);

  const handleExportSingleEventCSV = (eventObj) => {
    const csvData = eventObj.participants.map((p, idx) => ({
      'S.No': idx + 1,
      'Event Name': eventObj.eventName,
      'Participant Name': p.name,
      'College Name': p.college,
      'Department': p.department,
      'Academic Year': p.year,
      'Verification Status': p.isVerified ? 'Verified' : 'New / Pending',
      'Date & Time Registered': formatDate(p.timestamp),
      'Phone': p.phone,
      'Email': p.email,
    }));
    const sanitizedName = eventObj.eventName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    onExportCSV(csvData, `event_report_${sanitizedName}.csv`);
  };

  const handleExportAllEventsDetailedCSV = () => {
    const allRows = [];
    eventDetailedBreakdown.forEach((evt) => {
      evt.participants.forEach((p, idx) => {
        allRows.push({
          'Event Name': evt.eventName,
          'S.No': idx + 1,
          'Participant Name': p.name,
          'College Name': p.college,
          'Department': p.department,
          'Academic Year': p.year,
          'Verification Status': p.isVerified ? 'Verified' : 'New / Pending',
          'Date & Time Registered': formatDate(p.timestamp),
          'Phone': p.phone,
          'Email': p.email,
        });
      });
    });
    onExportCSV(allRows, 'cse_viyugam_all_events_detailed_report.csv');
  };

  if (eventStats.length === 0) {
    return (
      <div className="card-elevated rounded-2xl p-12 text-center shadow-xs">
        <CalendarDays className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
        <h3 className="text-base font-extrabold text-neutral-800 font-outfit">
          Event Analytics & Reports Unavailable
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 font-medium">
          No event selections were detected in the active spreadsheet dataset.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Event Popularity Bar Chart & Summary Header */}
      <div className="card-elevated rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-extrabold text-neutral-900 font-outfit uppercase tracking-wider flex items-center gap-2">
              <Award className="h-5 w-5 text-burgundy-800" /> Symposium Event Overview & Analytics
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              Enrollment distribution across all {eventStats.length} technical & non-technical events
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportAllEventsDetailedCSV}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-burgundy-800 hover:bg-burgundy-900 text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Export All Events Detailed Report (CSV)</span>
            </button>
          </div>
        </div>

        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventStats} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} interval={0} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                formatter={(value) => [`${value} Registrations`, 'Participants']}
                contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                itemStyle={{ color: '#F8FAFC' }}
              />
              <Bar dataKey="count" fill="#7A0E0E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="card-elevated rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-neutral-900 font-outfit uppercase tracking-wider flex items-center gap-2">
              <Users className="h-5 w-5 text-burgundy-800" /> Event-Wise Participant Reports
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              View student count and individual participant lists with college names for each event separately
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search participant or college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800"
            />
          </div>
        </div>

        {/* Event Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedEventFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
              selectedEventFilter === 'ALL'
                ? 'bg-burgundy-800 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            All Events ({eventDetailedBreakdown.length})
          </button>
          {eventDetailedBreakdown.map((evt) => (
            <button
              key={evt.eventName}
              onClick={() => setSelectedEventFilter(evt.eventName)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedEventFilter === evt.eventName
                  ? 'bg-burgundy-800 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/70 border border-neutral-200/60'
              }`}
            >
              <span>{evt.eventName}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedEventFilter === evt.eventName
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-200 text-neutral-800 font-bold'
              }`}>
                {evt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Individual Event Participant Reports */}
      <div className="space-y-6">
        {displayedEvents.length === 0 ? (
          <div className="card-elevated rounded-2xl p-8 text-center text-neutral-400 font-medium text-xs">
            No participants found for the selected event or search filter.
          </div>
        ) : (
          displayedEvents.map((evt) => (
            <div key={evt.eventName} className="card-elevated rounded-2xl overflow-hidden border border-neutral-200/90 shadow-sm">
              
              {/* Event Header Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-neutral-900 via-burgundy-950 to-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-burgundy-800/80 border border-burgundy-500/40 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold font-outfit text-white leading-tight">
                      {evt.eventName}
                    </h3>
                    <p className="text-xs text-neutral-300 font-medium">
                      Event Participant Directory Report
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Total Participant Count Badge */}
                  <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-amber-400" />
                    <span>No. of Participants: <strong className="text-amber-300 text-sm font-extrabold">{evt.count}</strong></span>
                  </div>

                  {/* Export Single Event CSV Button */}
                  <button
                    onClick={() => handleExportSingleEventCSV(evt)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-extrabold shadow-sm active:scale-95 transition-all shrink-0"
                  >
                    <Download className="h-3.5 w-3.5 text-burgundy-800" />
                    <span>Export {evt.eventName} CSV</span>
                  </button>
                </div>
              </div>

              {/* Event Participants Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-extrabold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">S.No</th>
                      <th className="py-3 px-4">Participant Name</th>
                      <th className="py-3 px-4">College Name</th>
                      <th className="py-3 px-4">Department & Year</th>
                      <th className="py-3 px-4">Date & Time Registered</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 bg-white">
                    {evt.participants.map((p, idx) => {
                      const initials = p.name ? p.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'P';
                      return (
                        <tr
                          key={p.id || idx}
                          onClick={() => onSelectParticipant && onSelectParticipant(p)}
                          className="hover:bg-burgundy-50/30 cursor-pointer transition-colors group"
                        >
                          <td className="py-3 px-4 text-center font-mono text-neutral-400 text-[11px] font-bold">
                            {idx + 1}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-burgundy-100 to-burgundy-200 border border-burgundy-300 flex items-center justify-center text-burgundy-900 font-extrabold text-[10px] shrink-0">
                                {initials}
                              </div>
                              <div>
                                <span className="font-extrabold text-neutral-900 group-hover:text-burgundy-900 transition-colors block">
                                  {p.name}
                                </span>
                                {p.phone && (
                                  <span className="text-[10px] text-neutral-400 font-mono block">
                                    {p.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-bold text-neutral-800">
                            <div className="flex items-center space-x-1.5">
                              <Building className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                              <span>{p.college}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-neutral-600 font-medium">
                            {p.department} {p.year !== 'N/A' ? `(${p.year})` : ''}
                          </td>

                          <td className="py-3 px-4 text-neutral-700 font-mono text-[11px]">
                            <div className="flex items-center gap-1 font-bold text-neutral-800">
                              <Clock className="h-3 w-3 text-burgundy-800 shrink-0" />
                              {formatDate(p.timestamp)}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              p.isVerified ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                            }`}>
                              <span>{p.isVerified ? 'Verified' : 'New'}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Card Footer Summary */}
              <div className="p-3 bg-neutral-50/80 border-t border-neutral-200/80 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                <span>Total {evt.count} registered participants listed above for {evt.eventName}</span>
                <button
                  onClick={() => handleExportSingleEventCSV(evt)}
                  className="text-burgundy-800 font-bold hover:underline flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  <span>Download CSV</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
