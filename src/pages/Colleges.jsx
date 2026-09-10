import React, { useState, useMemo } from 'react';
import { Building2, Download, Eye, Search, Trophy, Award, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateCollegeParticipation } from '../utils/analytics';
import { formatCurrency, formatNumber } from '../utils/formatters';
import CollegeDetailsModal from '../components/CollegeDetailsModal';

export default function Colleges({ data, onExportCSV, onToggleVerify, onViewInDirectory }) {
  const [showAll, setShowAll] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [selectedCollegeForModal, setSelectedCollegeForModal] = useState(null);

  const collegeMetrics = calculateCollegeParticipation(data, showAll ? 9999 : 15);
  
  const filteredColleges = useMemo(() => {
    const list = showAll ? collegeMetrics.allColleges : collegeMetrics.topColleges;
    if (!collegeSearch.trim()) return list;
    return list.filter(c => c.college.toLowerCase().includes(collegeSearch.toLowerCase().trim()));
  }, [collegeMetrics, showAll, collegeSearch]);

  // Filter participants for detail modal
  const collegeParticipants = selectedCollegeForModal
    ? data.filter(d => d.college.toLowerCase().trim() === selectedCollegeForModal.toLowerCase().trim())
    : [];

  return (
    <div className="space-y-6">
      
      {/* College Ranking Chart */}
      <div className="card-elevated rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-extrabold text-neutral-900 font-outfit uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-5 w-5 text-burgundy-800" /> College Participation Analytics
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              Institutional distribution across {collegeMetrics.totalColleges} participating colleges & universities
            </p>
          </div>
          <button
            onClick={() => onExportCSV(collegeMetrics.allColleges, 'college_participation_summary.csv')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-800 hover:bg-neutral-50 shadow-2xs active:scale-95 transition-all"
          >
            <Download className="h-4 w-4 text-burgundy-800" />
            <span>Export Ranking CSV</span>
          </button>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={collegeMetrics.topColleges}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis
                type="category"
                dataKey="college"
                width={150}
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                tickFormatter={(val) => val.length > 22 ? `${val.substring(0, 19)}...` : val}
              />
              <Tooltip
                formatter={(value) => [`${value} Participants`, 'Registrations']}
                contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                itemStyle={{ color: '#F8FAFC' }}
              />
              <Bar dataKey="participants" fill="#7A0E0E" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Institutional Table (Interactive) */}
      <div className="card-elevated rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <div>
            <h3 className="text-sm font-extrabold text-neutral-900 font-outfit uppercase tracking-wider">
              Institutional Leaderboard & Roster
            </h3>
            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
              Click any college row to view all registered students from that institution
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={collegeSearch}
                onChange={(e) => setCollegeSearch(e.target.value)}
                placeholder="Search college..."
                className="pl-8 pr-3 py-1.5 text-xs font-medium border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800"
              />
            </div>

            <button
              onClick={() => setShowAll(!showAll)}
              className="px-3.5 py-1.5 rounded-xl bg-burgundy-50 text-burgundy-900 border border-burgundy-200 text-xs font-extrabold hover:bg-burgundy-100 transition-all active:scale-95"
            >
              {showAll ? 'Top 15 Only' : `View All (${collegeMetrics.totalColleges})`}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/90 border-b border-neutral-200 text-neutral-500 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">College / Institution Name</th>
                <th className="py-3.5 px-4 text-center">Students</th>
                <th className="py-3.5 px-4 text-center">Share</th>
                <th className="py-3.5 px-4 text-center">Verified</th>
                <th className="py-3.5 px-4 text-right">Revenue</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {filteredColleges.map((item) => (
                <tr
                  key={item.rank}
                  onClick={() => setSelectedCollegeForModal(item.college)}
                  className="hover:bg-burgundy-50/30 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 text-center font-extrabold font-mono text-neutral-700">
                    {item.rank === 1 && (
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300 shadow-2xs">
                        🥇 1
                      </span>
                    )}
                    {item.rank === 2 && (
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-300 shadow-2xs">
                        🥈 2
                      </span>
                    )}
                    {item.rank === 3 && (
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-amber-700/15 text-amber-950 font-bold border border-amber-600/30 shadow-2xs">
                        🥉 3
                      </span>
                    )}
                    {item.rank > 3 && (
                      <span className="text-neutral-400">#{item.rank}</span>
                    )}
                  </td>
                  
                  <td className="py-3.5 px-4 font-bold text-neutral-900 group-hover:text-burgundy-900">
                    <div className="flex items-center justify-between">
                      <span>{item.college}</span>
                      <span className="text-[10px] text-burgundy-800 opacity-0 group-hover:opacity-100 font-extrabold transition-opacity">
                        Inspect Roster →
                      </span>
                    </div>
                    {/* Share Bar */}
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-burgundy-800 rounded-full"
                        style={{ width: `${Math.max(item.percentage, 2)}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-extrabold text-burgundy-800 text-sm">
                    {formatNumber(item.participants)}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-neutral-600 font-bold">
                    {item.percentage}%
                  </td>

                  <td className="py-3.5 px-4 text-center font-extrabold text-emerald-800">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-200">
                      <CheckCircle className="h-3 w-3 mr-1 text-emerald-600" />
                      {item.verified}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-extrabold text-neutral-900 font-mono">
                    {formatCurrency(item.amount)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCollegeForModal(item.college);
                      }}
                      className="p-1.5 rounded-xl text-neutral-400 hover:text-burgundy-800 hover:bg-burgundy-50 transition-colors"
                      title="Inspect college participants"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* College Roster Modal */}
      {selectedCollegeForModal && (
        <CollegeDetailsModal
          collegeName={selectedCollegeForModal}
          participants={collegeParticipants}
          onClose={() => setSelectedCollegeForModal(null)}
          onToggleVerify={onToggleVerify}
          onViewInDirectory={onViewInDirectory}
        />
      )}

    </div>
  );
}
