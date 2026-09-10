import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { calculateSummaryMetrics, calculateGenderDistribution, calculateCollegeParticipation } from '../utils/analytics';
import { formatNumber } from '../utils/formatters';

export default function Gender({ data }) {
  const metrics = calculateSummaryMetrics(data);
  const genderDonut = calculateGenderDistribution(data);
  const collegeStats = calculateCollegeParticipation(data, 10);

  return (
    <div className="space-y-6">
      
      {/* Top Gender Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Male Participants</div>
          <div className="text-3xl font-extrabold font-outfit text-blue-900 mt-2">
            {formatNumber(metrics.maleCount)}
          </div>
          <p className="text-xs text-blue-700 font-medium mt-1">
            {metrics.malePercent}% of total registrations
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Female Participants</div>
          <div className="text-3xl font-extrabold font-outfit text-pink-900 mt-2">
            {formatNumber(metrics.femaleCount)}
          </div>
          <p className="text-xs text-pink-700 font-medium mt-1">
            {metrics.femalePercent}% of total registrations
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Overall Gender Ratio</div>
          <div className="text-3xl font-extrabold font-outfit text-burgundy-900 mt-2">
            {metrics.femaleCount > 0 ? (metrics.maleCount / metrics.femaleCount).toFixed(2) : '1.00'} : 1
          </div>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Male to Female Ratio
          </p>
        </div>
      </div>

      {/* Row 2: Donut Chart & Ratio Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 font-outfit uppercase tracking-wider pb-3 border-b border-neutral-100">
            Demographic Distribution Donut
          </h3>
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderDonut}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderDonut.map((entry, index) => (
                    <Cell key={`cell-g-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} Participants`, name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stacked Gender by College */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 font-outfit uppercase tracking-wider pb-3 border-b border-neutral-100">
            Gender Distribution by Top Colleges
          </h3>
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collegeStats.topColleges} margin={{ top: 10, right: 10, left: 0, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="college"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  tickFormatter={(val) => val.length > 12 ? `${val.substring(0, 10)}...` : val}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Bar dataKey="male" name="Male" stackId="a" fill="#1E40AF" />
                <Bar dataKey="female" name="Female" stackId="a" fill="#BE185D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
