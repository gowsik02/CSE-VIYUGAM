import React from 'react';
import { Users, Building2, CreditCard, DollarSign, Award, TrendingUp, CheckCircle, Clock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import StatCard from '../components/StatCard';
import DataQuality from '../components/DataQuality';
import Insights from '../components/Insights';
import {
  calculateSummaryMetrics,
  calculateCollegeParticipation,
  calculatePaymentSummary,
  calculateEventParticipation,
  calculateRegistrationTrend,
  calculateDataQuality,
} from '../utils/analytics';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function Dashboard({ data, onSelectParticipant, onNavigate }) {
  const metrics = calculateSummaryMetrics(data);
  const collegeStats = calculateCollegeParticipation(data, 10);
  const paymentStats = calculatePaymentSummary(data);
  const eventStats = calculateEventParticipation(data);
  const trendStats = calculateRegistrationTrend(data);
  const qualityMetrics = calculateDataQuality(data);

  return (
    <div className="space-y-6">
      
      {/* 🌟 Organizer Welcome & Verification Progress Hero Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-2 bg-burgundy-800" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-burgundy-800" />
              <h2 className="text-lg font-bold font-outfit text-neutral-900">
                CSE VIYUGAM 2026 — Live Overview
              </h2>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Real-time symposium analytics synchronized with the Google Sheet. Review new registration submissions, verify payments, and monitor college participation.
            </p>
          </div>

          {/* Progress & Quick Action */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 min-w-[280px] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-neutral-800">Verification Progress</span>
              <span className="font-bold text-burgundy-800">{metrics.verifiedCount} of {metrics.totalParticipants} Verified ({metrics.verifiedRate}%)</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(parseFloat(metrics.verifiedRate) || 0, 5)}%` }}
              />
            </div>

            <button
              onClick={() => onNavigate('participants', 'new')}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-burgundy-800 hover:bg-burgundy-900 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Verify Pending Registrations ({metrics.newCount})</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* 📊 6 Clear & Interactive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Participants"
          value={formatNumber(metrics.totalParticipants)}
          subtitle="All students registered in sheet"
          icon={Users}
          badgeText="Live"
          badgeColor="bg-burgundy-50 text-burgundy-800"
          onClick={() => onNavigate('participants', 'all')}
        />

        <StatCard
          title="Total Colleges"
          value={formatNumber(metrics.totalColleges)}
          subtitle="Institutions participating"
          icon={Building2}
          onClick={() => onNavigate('colleges')}
        />

        <StatCard
          title="New Registrations"
          value={formatNumber(metrics.newCount)}
          subtitle="Needs organizer verification"
          icon={Clock}
          badgeText="Action Needed"
          badgeColor="bg-amber-100 text-amber-900"
          onClick={() => onNavigate('participants', 'new')}
        />

        <StatCard
          title="Verified Registrations"
          value={formatNumber(metrics.verifiedCount)}
          subtitle="Approved & confirmed"
          icon={CheckCircle}
          badgeText={`${metrics.verifiedRate}% Approved`}
          badgeColor="bg-emerald-100 text-emerald-900"
          onClick={() => onNavigate('participants', 'verified')}
        />

        <StatCard
          title="Verified Revenue"
          value={formatCurrency(metrics.verifiedAmount)}
          subtitle="Confirmed money in account"
          icon={CreditCard}
          badgeText="Confirmed"
          badgeColor="bg-emerald-50 text-emerald-800"
          onClick={() => onNavigate('payments')}
        />

        <StatCard
          title="Total Potential Revenue"
          value={formatCurrency(metrics.totalAmount)}
          subtitle="Verified + Unverified sum"
          icon={DollarSign}
          onClick={() => onNavigate('payments')}
        />
      </div>

      {/* Row 1: Visual Charts with Clear Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Verification Status Donut Chart */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 font-outfit uppercase tracking-wider">
                Registration Verification Breakdown
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Proportion of verified vs new unverified registrations
              </p>
            </div>
            <button
              onClick={() => onNavigate('participants', 'new')}
              className="text-xs font-semibold text-burgundy-800 hover:underline"
            >
              Verify Now →
            </button>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStats.statusDonut}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentStats.statusDonut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} Registrations`, name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100 text-center text-xs">
            <button
              onClick={() => onNavigate('participants', 'new')}
              className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors text-left"
            >
              <span className="text-[10px] text-amber-800 font-bold uppercase block">New / Pending</span>
              <span className="font-bold text-amber-950 text-sm">{metrics.newCount}</span>
              <span className="text-[10px] text-amber-700 block font-mono">{formatCurrency(metrics.newAmount)}</span>
            </button>

            <button
              onClick={() => onNavigate('participants', 'verified')}
              className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors text-left"
            >
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Verified Collected</span>
              <span className="font-bold text-emerald-950 text-sm">{metrics.verifiedCount}</span>
              <span className="text-[10px] text-emerald-700 block font-mono">{formatCurrency(metrics.verifiedAmount)}</span>
            </button>
          </div>
        </div>

        {/* Top Participating Colleges Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 font-outfit uppercase tracking-wider">
                Top Participating Colleges
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Which institutions sent the highest number of students
              </p>
            </div>
            <button
              onClick={() => onNavigate('colleges')}
              className="text-xs font-semibold text-burgundy-800 hover:underline"
            >
              View Ranking Table →
            </button>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={collegeStats.topColleges}
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="college"
                  width={140}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => val.length > 20 ? `${val.substring(0, 18)}...` : val}
                />
                <Tooltip
                  formatter={(value) => [`${value} Participants`, 'Registrations']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Bar dataKey="participants" fill="#7A0E0E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-right text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            Showing Top {collegeStats.topColleges.length} of {collegeStats.totalColleges} Colleges
          </div>
        </div>

      </div>

      {/* Row 2: Event Participation Breakdown */}
      {eventStats.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 font-outfit uppercase tracking-wider">
                Event Participation Breakdown
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Popularity ranking of Technical and Non-Technical symposium events
              </p>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-semibold text-burgundy-800 hover:underline"
            >
              All Events ({eventStats.length}) →
            </button>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventStats} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${value} Participants`, 'Event Registrations']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#7A0E0E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Row 3: Daily Submission Trend */}
      {trendStats.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 font-outfit uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-burgundy-800" /> Daily Submission Velocity
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Registration submission rate per day over time
              </p>
            </div>
          </div>

          <div className="h-60 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendStats} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${value} Registrations`, 'Submissions']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="registrations" stroke="#7A0E0E" strokeWidth={3} dot={{ r: 4, fill: '#7A0E0E' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Data Quality & Insights */}
      <DataQuality qualityMetrics={qualityMetrics} onSelectParticipant={onSelectParticipant} />
      <Insights data={data} />

    </div>
  );
}
