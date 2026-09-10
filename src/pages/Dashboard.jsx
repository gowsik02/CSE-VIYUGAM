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
      <div className="gradient-hero rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-burgundy-950/20 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold tracking-wider uppercase text-rose-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Organizer Executive Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-outfit tracking-tight leading-tight text-white">
              CSE VIYUGAM 2026 — Live Symposium Command
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              Real-time analytics synchronized with official registration records. Monitor live institution signups, review unverified payments, and track revenue velocity.
            </p>
          </div>

          {/* Progress & Quick Action */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 min-w-[300px] space-y-3.5 shadow-inner">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-neutral-200 uppercase tracking-wider text-[10px]">Verification Rate</span>
              <span className="text-emerald-400 font-mono text-sm">{metrics.verifiedCount} / {metrics.totalParticipants} ({metrics.verifiedRate}%)</span>
            </div>

            {/* Glowing Progress Bar */}
            <div className="w-full h-3 bg-neutral-900/50 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-glow-emerald transition-all duration-700 ease-out"
                style={{ width: `${Math.max(parseFloat(metrics.verifiedRate) || 0, 5)}%` }}
              />
            </div>

            <button
              onClick={() => onNavigate('participants', 'new')}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-white text-burgundy-950 hover:bg-neutral-100 active:scale-[0.98] rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-black/20 group"
            >
              <Clock className="h-4 w-4 text-burgundy-800" />
              <span>Verify Pending Submissions ({metrics.newCount})</span>
              <ArrowRight className="h-4 w-4 text-burgundy-800 group-hover:translate-x-1 transition-transform" />
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
        <div className="lg:col-span-5 card-elevated rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-xs font-extrabold text-neutral-900 font-outfit uppercase tracking-wider">
                Verification Breakdown
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">
                Proportion of verified vs new unverified registrations
              </p>
            </div>
            <button
              onClick={() => onNavigate('participants', 'new')}
              className="text-xs font-bold text-burgundy-800 hover:text-burgundy-900 hover:underline"
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
                  outerRadius={88}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentStats.statusDonut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} Registrations`, name]}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-neutral-100 text-center text-xs">
            <button
              onClick={() => onNavigate('participants', 'new')}
              className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 hover:bg-amber-100/80 active:scale-95 transition-all text-left"
            >
              <span className="text-[10px] text-amber-800 font-extrabold uppercase block tracking-wider">New / Pending</span>
              <span className="font-extrabold text-amber-950 text-base">{metrics.newCount}</span>
              <span className="text-[11px] text-amber-700 block font-mono font-semibold">{formatCurrency(metrics.newAmount)}</span>
            </button>

            <button
              onClick={() => onNavigate('participants', 'verified')}
              className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 hover:bg-emerald-100/80 active:scale-95 transition-all text-left"
            >
              <span className="text-[10px] text-emerald-800 font-extrabold uppercase block tracking-wider">Verified Collected</span>
              <span className="font-extrabold text-emerald-950 text-base">{metrics.verifiedCount}</span>
              <span className="text-[11px] text-emerald-700 block font-mono font-semibold">{formatCurrency(metrics.verifiedAmount)}</span>
            </button>
          </div>
        </div>

        {/* Top Participating Colleges Bar Chart */}
        <div className="lg:col-span-7 card-elevated rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-xs font-extrabold text-neutral-900 font-outfit uppercase tracking-wider">
                Top Participating Colleges
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">
                Institutions leading student participation volume
              </p>
            </div>
            <button
              onClick={() => onNavigate('colleges')}
              className="text-xs font-bold text-burgundy-800 hover:text-burgundy-900 hover:underline"
            >
              View All Rankings →
            </button>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={collegeStats.topColleges}
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  type="category"
                  dataKey="college"
                  width={140}
                  tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                  tickFormatter={(val) => val.length > 20 ? `${val.substring(0, 18)}...` : val}
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

          <div className="text-right text-xs text-neutral-500 font-medium pt-2 border-t border-neutral-100">
            Showing Top {collegeStats.topColleges.length} of {collegeStats.totalColleges} Colleges
          </div>
        </div>

      </div>

      {/* Row 2: Event Participation Breakdown */}
      {eventStats.length > 0 && (
        <div className="card-elevated rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-xs font-extrabold text-neutral-900 font-outfit uppercase tracking-wider">
                Event Participation Breakdown
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">
                Popularity ranking of Technical and Non-Technical symposium events
              </p>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-bold text-burgundy-800 hover:text-burgundy-900 hover:underline"
            >
              All Events ({eventStats.length}) →
            </button>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventStats} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(value) => [`${value} Participants`, 'Event Registrations']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Bar dataKey="count" fill="#7A0E0E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Row 3: Daily Submission Trend */}
      {trendStats.length > 0 && (
        <div className="card-elevated rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-xs font-extrabold text-neutral-900 font-outfit uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-burgundy-800" /> Daily Registration Velocity
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">
                Submission momentum over time
              </p>
            </div>
          </div>

          <div className="h-60 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendStats} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(value) => [`${value} Registrations`, 'Submissions']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Line type="monotone" dataKey="registrations" stroke="#7A0E0E" strokeWidth={3.5} dot={{ r: 5, fill: '#7A0E0E', stroke: '#ffffff', strokeWidth: 2 }} />
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
