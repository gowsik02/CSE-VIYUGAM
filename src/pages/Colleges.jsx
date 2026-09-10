import React, { useState } from 'react';
import { Building2, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateCollegeParticipation } from '../utils/analytics';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function Colleges({ data, onExportCSV }) {
  const [showAll, setShowAll] = useState(false);
  const collegeMetrics = calculateCollegeParticipation(data, showAll ? 9999 : 10);
  const displayedColleges = showAll ? collegeMetrics.allColleges : collegeMetrics.topColleges;

  return (
    <div className="space-y-6">
      
      {/* College Ranking Chart */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900 font-outfit uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-5 w-5 text-burgundy-800" /> College Participation Rankings
            </h2>
            <p className="text-xs text-neutral-500">
              Institutional distribution across {collegeMetrics.totalColleges} total colleges
            </p>
          </div>
          <button
            onClick={() => onExportCSV(displayedColleges, 'college_participation_summary.csv')}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-burgundy-800" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={collegeMetrics.topColleges}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="college"
                width={150}
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => val.length > 22 ? `${val.substring(0, 19)}...` : val}
              />
              <Tooltip
                formatter={(value) => [`${value} Participants`, 'Registrations']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Bar dataKey="participants" fill="#7A0E0E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* College Ranking Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900 font-outfit uppercase tracking-wider">
            Detailed Institutional Table
          </h3>
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-3 py-1.5 rounded-lg bg-burgundy-50 text-burgundy-800 border border-burgundy-200 text-xs font-semibold hover:bg-burgundy-100 transition-colors"
          >
            {showAll ? 'Show Top 10 Only' : `View All ${collegeMetrics.totalColleges} Colleges`}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">College / Institution Name</th>
                <th className="py-3 px-4 text-center">Participants</th>
                <th className="py-3 px-4 text-center">% Share</th>
                <th className="py-3 px-4 text-center">Verified Regs</th>
                <th className="py-3 px-4 text-right">Amount Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {displayedColleges.map((item) => (
                <tr key={item.rank} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3 px-4 text-center font-bold font-mono text-neutral-700">
                    {item.rank <= 3 ? (
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                        #{item.rank}
                      </span>
                    ) : (
                      `#${item.rank}`
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-900">
                    {item.college}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-burgundy-800">
                    {formatNumber(item.participants)}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-neutral-600">
                    {item.percentage}%
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-emerald-800">
                    {item.verified}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-neutral-900">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
