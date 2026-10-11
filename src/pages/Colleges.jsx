import React, { useState, useMemo } from 'react';
import { Building2, Download, Eye, Search, Trophy, Award, CheckCircle, Clock, ArrowRight, ExternalLink } from 'lucide-react';
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

  // Top 3 Podium
  const topThree = useMemo(() => {
    return collegeMetrics.topColleges.slice(0, 3);
  }, [collegeMetrics]);

  // Filter participants for detail modal
  const collegeParticipants = selectedCollegeForModal
    ? data.filter(d => d.college.toLowerCase().trim() === selectedCollegeForModal.toLowerCase().trim())
    : [];

  return (
    <div className="space-y-6">
      
      {/* Top 3 Institutions Showcase Podium */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topThree.map((item, idx) => {
            const medalColors = [
              { bg: 'bg-amber-50 border-amber-200 text-amber-900', badge: 'bg-amber-500 text-white', label: '1st Place' },
              { bg: 'bg-slate-100 border-slate-300 text-slate-900', badge: 'bg-slate-400 text-white', label: '2nd Place' },
              { bg: 'bg-orange-50 border-orange-200 text-orange-950', badge: 'bg-orange-400 text-white', label: '3rd Place' },
            ][idx];

            return (
              <div
                key={idx}
                onClick={() => setSelectedCollegeForModal(item.college)}
                className={`card-elevated rounded-2xl p-5 border cursor-pointer group hover:scale-[1.01] transition-all select-none ${medalColors.bg}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs ${medalColors.badge}`}>
                    {medalColors.label}
                  </span>
                  <Trophy className="h-5 w-5 opacity-80" />
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-extrabold text-slate-900 font-outfit truncate group-hover:text-burgundy-800 transition-colors" title={item.college}>
                    {item.college}
                  </h4>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-2xl font-extrabold font-outfit text-slate-900">
                      {item.participants}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Participants</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-800 mt-1">
                    {formatCurrency(item.amount)} verified
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* College Ranking Chart */}
      <div className="card-elevated rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-outfit uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-5 w-5 text-burgundy-800" /> College Participation Distribution
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Institutional distribution across {collegeMetrics.totalColleges} participating colleges & universities
            </p>
          </div>
          <button
            onClick={() => onExportCSV(collegeMetrics.allColleges, 'college_participation_summary.csv')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-2xs active:scale-95 transition-all cursor-pointer"
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
                width={160}
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                tickFormatter={(val) => val.length > 22 ? `${val.substring(0, 20)}...` : val}
              />
              <Tooltip
                formatter={(value) => [`${value} Participants`, 'Registrations']}
                contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                itemStyle={{ color: '#F8FAFC' }}
              />
              <Bar dataKey="participants" fill="#731010" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Institutional Table (Interactive) */}
      <div className="card-elevated rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
              Institutional Leaderboard & Roster
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Click any college to view all registered students from that institution
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={collegeSearch}
                onChange={(e) => setCollegeSearch(e.target.value)}
                placeholder="Search college..."
                className="pl-8 pr-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800"
              />
            </div>

            <button
              onClick={() => setShowAll(!showAll)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {showAll ? 'Show Top 15' : `Show All (${collegeMetrics.allColleges.length})`}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                <th className="table-header-cell">Rank</th>
                <th className="table-header-cell">College / Institution Name</th>
                <th className="table-header-cell">Total Registered</th>
                <th className="table-header-cell">Verified Count</th>
                <th className="table-header-cell">Pending Count</th>
                <th className="table-header-cell">Total Collected</th>
                <th className="table-header-cell text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredColleges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No matching colleges found.
                  </td>
                </tr>
              ) : (
                filteredColleges.map((c, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedCollegeForModal(c.college)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="table-body-cell font-mono font-bold text-slate-400">
                      #{index + 1}
                    </td>

                    <td className="table-body-cell">
                      <div className="font-bold text-slate-900 group-hover:text-burgundy-800 transition-colors">
                        {c.college}
                      </div>
                    </td>

                    <td className="table-body-cell font-bold text-slate-900">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-extrabold">
                        {c.participants} students
                      </span>
                    </td>

                    <td className="table-body-cell">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        {c.verifiedCount}
                      </span>
                    </td>

                    <td className="table-body-cell">
                      <span className="text-amber-700 font-bold flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {c.newCount}
                      </span>
                    </td>

                    <td className="table-body-cell font-mono font-bold text-emerald-800">
                      {formatCurrency(c.amount)}
                    </td>

                    <td className="table-body-cell text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCollegeForModal(c.college);
                        }}
                        className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 group-hover:bg-burgundy-800 group-hover:text-white group-hover:border-burgundy-800 transition-all cursor-pointer"
                      >
                        View Roster
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal for College */}
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
