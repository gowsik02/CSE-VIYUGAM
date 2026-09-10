import React from 'react';
import { CalendarDays, Award, Users, Download, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateEventParticipation } from '../utils/analytics';
import { formatNumber } from '../utils/formatters';

export default function Events({ data, onExportCSV }) {
  const eventStats = calculateEventParticipation(data);

  if (eventStats.length === 0) {
    return (
      <div className="card-elevated rounded-2xl p-12 text-center shadow-xs">
        <CalendarDays className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
        <h3 className="text-base font-extrabold text-neutral-800 font-outfit">
          Event Analytics Unavailable
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 font-medium">
          No specific event selection column was detected in the active spreadsheet dataset.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Event Popularity Bar Chart */}
      <div className="card-elevated rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-extrabold text-neutral-900 font-outfit uppercase tracking-wider flex items-center gap-2">
              <Award className="h-5 w-5 text-burgundy-800" /> Symposium Event Popularity Rankings
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              Student enrollment distribution across all {eventStats.length} technical and non-technical events
            </p>
          </div>
          <button
            onClick={() => onExportCSV(eventStats, 'event_participation_summary.csv')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-800 hover:bg-neutral-50 shadow-2xs active:scale-95 transition-all"
          >
            <Download className="h-4 w-4 text-burgundy-800" />
            <span>Export Event CSV</span>
          </button>
        </div>

        <div className="h-72 w-full mt-4">
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

      {/* Events Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventStats.map((evt, idx) => (
          <div key={idx} className="card-elevated rounded-2xl p-5 flex items-center justify-between group">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">
                Rank #{idx + 1} Event
              </span>
              <h4 className="text-sm font-extrabold text-neutral-900 font-outfit group-hover:text-burgundy-900 transition-colors">
                {evt.name}
              </h4>
            </div>
            
            <div className="h-12 w-14 rounded-2xl bg-gradient-to-br from-burgundy-50 to-burgundy-100/80 border border-burgundy-200/80 flex flex-col items-center justify-center text-burgundy-950 shrink-0 font-extrabold font-outfit text-base shadow-2xs">
              {evt.count}
              <span className="text-[9px] font-bold text-burgundy-700 leading-none uppercase">Regs</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
