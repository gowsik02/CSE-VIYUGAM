import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Award,
  Users,
  Download,
  FileText,
  Sparkles,
  Search,
  ChevronRight,
  CheckCircle,
  Clock,
  Building,
  UserCheck,
  Zap,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateEventParticipation, calculateEventDetailedBreakdown } from '../utils/analytics';
import { formatDate } from '../utils/formatters';
import { exportSingleEventPDF, exportAllEventsPDF } from '../utils/pdfExport';

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

  const handleExportSingleEventPDF = (eventObj) => {
    exportSingleEventPDF(eventObj);
  };

  const handleExportAllEventsPDF = () => {
    exportAllEventsPDF(eventDetailedBreakdown);
  };

  if (eventStats.length === 0) {
    return (
      <div className="card-elevated rounded-2xl p-12 text-center shadow-xs">
        <CalendarDays className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-extrabold text-slate-800 font-outfit">
          Event Analytics & Reports Unavailable
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
          No event selections were detected in the active spreadsheet dataset.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Event Popularity Bar Chart & Summary Header */}
      <div className="card-elevated rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-outfit uppercase tracking-wider flex items-center gap-2">
              <Award className="h-5 w-5 text-burgundy-800" /> Symposium Event Overview & Analytics
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Registration volume breakdown across {eventStats.length} technical and non-technical competitions
            </p>
          </div>
          <button
            onClick={handleExportAllEventsPDF}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-bold text-rose-900 hover:bg-rose-100 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <FileText className="h-4 w-4 text-rose-700" />
            <span>Download All Events PDF</span>
          </button>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={eventStats}
              margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="eventName"
                angle={-20}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                formatter={(value) => [`${value} Registrations`, 'Participants']}
                contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                itemStyle={{ color: '#F8FAFC' }}
              />
              <Bar dataKey="participants" fill="#731010" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Event Roster Cards Section */}
      <div className="space-y-4">
        
        {/* Event Quick Filter Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedEventFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedEventFilter === 'ALL'
                  ? 'bg-burgundy-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Events ({eventDetailedBreakdown.length})
            </button>
            {eventStats.map((e, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedEventFilter(e.eventName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedEventFilter === e.eventName
                    ? 'bg-burgundy-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {e.eventName} ({e.participants})
              </button>
            ))}
          </div>

          <div className="relative shrink-0">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in events..."
              className="pl-8 pr-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800"
            />
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 gap-6">
          {displayedEvents.map((evt, idx) => (
            <div key={idx} className="card-elevated rounded-2xl overflow-hidden">
              
              <div className="p-4 bg-slate-50/90 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-burgundy-100 border border-burgundy-200 flex items-center justify-center text-burgundy-800 font-bold">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 font-outfit">
                      {evt.eventName}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {evt.participants.length} registered participant{evt.participants.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleExportSingleEventPDF(evt)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-xs font-bold text-rose-900 hover:bg-rose-100 shadow-2xs cursor-pointer active:scale-95 transition-all"
                >
                  <FileText className="h-3.5 w-3.5 text-rose-700" />
                  <span>Download PDF Report</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr>
                      <th className="table-header-cell">#</th>
                      <th className="table-header-cell">Participant Name</th>
                      <th className="table-header-cell">College / Institution</th>
                      <th className="table-header-cell">Department & Year</th>
                      <th className="table-header-cell">Verification Status</th>
                      <th className="table-header-cell">Date Registered</th>
                      <th className="table-header-cell text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {evt.participants.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-400">
                          No registered students match current filter.
                        </td>
                      </tr>
                    ) : (
                      evt.participants.map((p, pIdx) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="table-body-cell font-mono text-slate-400 text-[11px]">
                            #{pIdx + 1}
                          </td>
                          <td className="table-body-cell">
                            <div
                              onClick={() => onSelectParticipant && onSelectParticipant(p)}
                              className="font-bold text-slate-900 hover:text-burgundy-800 cursor-pointer flex items-center gap-1.5 flex-wrap"
                            >
                              <span>{p.name}</span>
                              {p.teamName && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                  {p.teamName}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{p.id}</div>
                          </td>
                          <td className="table-body-cell font-medium text-slate-700">
                            {p.college}
                          </td>
                          <td className="table-body-cell text-slate-600">
                            {p.department} ({p.year})
                          </td>
                          <td className="table-body-cell">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              p.isVerified
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                : 'bg-rose-100 text-rose-900 border border-rose-200'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${p.isVerified ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                              <span>{p.isVerified ? 'Verified (YES)' : 'Non-Verified (NO)'}</span>
                            </span>
                          </td>
                          <td className="table-body-cell text-slate-500 font-mono text-[11px]">
                            {formatDate(p.timestamp)}
                          </td>
                          <td className="table-body-cell text-center">
                            <button
                              type="button"
                              onClick={() => onSelectParticipant && onSelectParticipant(p)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
