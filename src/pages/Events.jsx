import React from 'react';
import { CalendarDays, Award, Users, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateEventParticipation } from '../utils/analytics';
import { formatNumber } from '../utils/formatters';

export default function Events({ data, onExportCSV }) {
  const eventStats = calculateEventParticipation(data);

  if (eventStats.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center shadow-xs">
        <CalendarDays className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-neutral-800 font-outfit">
          Event Analytics Unavailable
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
          No specific event selection column was detected in the active spreadsheet range.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Event Popularity Bar Chart */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900 font-outfit uppercase tracking-wider flex items-center gap-2">
              <Award className="h-5 w-5 text-burgundy-800" /> Event Registration Popularity
            </h2>
            <p className="text-xs text-neutral-500">
              Total registrations detected across {eventStats.length} events
            </p>
          </div>
          <button
            onClick={() => onExportCSV(eventStats, 'event_participation_summary.csv')}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-burgundy-800" />
            <span>Export Events CSV</span>
          </button>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventStats} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value) => [`${value} Registrations`, 'Participants']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#7A0E0E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Events Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventStats.map((evt, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Rank #{idx + 1} Event
              </span>
              <h4 className="text-sm font-bold text-neutral-900 font-outfit mt-0.5">
                {evt.name}
              </h4>
            </div>
            <div className="h-10 w-12 rounded-lg bg-burgundy-50 border border-burgundy-100 flex flex-col items-center justify-center text-burgundy-900 shrink-0 font-bold font-outfit text-sm">
              {evt.count}
              <span className="text-[9px] font-normal text-burgundy-700 leading-none">Regs</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
