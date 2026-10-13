import React, { useState, useMemo } from 'react';
import {
  Users,
  Building2,
  CreditCard,
  DollarSign,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  Users2,
  Crown,
  Search,
  CheckCircle2,
  Check,
  Building,
  Filter,
  Shield,
} from 'lucide-react';
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
  calculateTeamsSummary,
} from '../utils/analytics';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

export default function Dashboard({
  data,
  onSelectParticipant,
  onNavigate,
  onToggleVerify,
  onBatchVerify,
  onViewTeam,
}) {
  const [teamSearch, setTeamSearch] = useState('');
  const [teamStatusFilter, setTeamStatusFilter] = useState('all'); // 'all', 'verified', 'pending'

  const metrics = calculateSummaryMetrics(data);
  const collegeStats = calculateCollegeParticipation(data, 7);
  const paymentStats = calculatePaymentSummary(data);
  const eventStats = calculateEventParticipation(data);
  const qualityMetrics = calculateDataQuality(data);
  const teamsStats = useMemo(() => calculateTeamsSummary(data), [data]);

  const filteredTeams = useMemo(() => {
    return teamsStats.teamsList.filter((team) => {
      if (teamStatusFilter === 'verified' && team.status !== 'Verified') return false;
      if (teamStatusFilter === 'partial' && team.status !== 'Partial') return false;
      if (teamStatusFilter === 'pending' && team.status === 'Verified') return false;

      if (teamSearch.trim()) {
        const term = teamSearch.toLowerCase().trim();
        const matchesName = team.name.toLowerCase().includes(term);
        const matchesCollege = team.college.toLowerCase().includes(term);
        const matchesLead = team.leadName && team.leadName.toLowerCase().includes(term);
        const matchesMembers = team.members.some((m) => m.name.toLowerCase().includes(term));
        const matchesEvents = team.events.some((e) => e.toLowerCase().includes(term));
        return matchesName || matchesCollege || matchesLead || matchesMembers || matchesEvents;
      }
      return true;
    });
  }, [teamsStats.teamsList, teamSearch, teamStatusFilter]);

  const handleVerifySquad = (team) => {
    if (!team || !team.members || team.members.length === 0) return;
    const shouldVerify = !team.allVerified;

    if (onBatchVerify) {
      onBatchVerify(team.members, shouldVerify);
    } else if (onToggleVerify) {
      team.members.forEach((m) => {
        if (shouldVerify ? !m.isVerified : m.isVerified) {
          onToggleVerify(m);
        }
      });
    }
  };

  // Recent 5 Registrations
  const recentRegistrations = [...data].slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* 🌟 Organizer Welcome & Verification Progress Hero Banner */}
      <div className="gradient-hero rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-burgundy-950/20 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold tracking-wider uppercase text-rose-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Organizer Executive Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-outfit tracking-tight leading-tight text-white">
              CSE VIYUGAM 2026 — Live Symposium Command
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              Real-time analytics synchronized with official Google Form records. Monitor live institution registrations, audit incoming transaction receipts, and track verified revenue velocity.
            </p>
          </div>

          {/* Progress & Quick Action Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 min-w-[300px] sm:min-w-[340px] space-y-3.5 shadow-inner">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-neutral-200 uppercase tracking-wider text-[10px]">Verification Rate</span>
              <span className="text-emerald-400 font-mono text-sm">
                {metrics.verifiedCount} / {metrics.totalParticipants} ({metrics.verifiedRate}%)
              </span>
            </div>

            {/* Glowing Progress Bar */}
            <div className="w-full h-3 bg-neutral-900/60 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-glow-emerald transition-all duration-700 ease-out"
                style={{ width: `${Math.max(parseFloat(metrics.verifiedRate) || 0, 4)}%` }}
              />
            </div>

            <button
              onClick={() => onNavigate('participants', 'new')}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-white text-burgundy-950 hover:bg-neutral-100 active:scale-[0.98] rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-black/20 group cursor-pointer"
            >
              <Clock className="h-4 w-4 text-burgundy-800" />
              <span>Verify Pending Submissions ({metrics.newCount})</span>
              <ArrowRight className="h-4 w-4 text-burgundy-800 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard
          title="Total Participants"
          value={formatNumber(metrics.totalParticipants)}
          subtitle="All students registered"
          icon={Users}
          badgeText="Live"
          badgeColor="bg-burgundy-50 text-burgundy-800"
          onClick={() => onNavigate('participants', 'all')}
          accentColor="from-burgundy-700 to-burgundy-900"
          iconBg="bg-burgundy-50 border-burgundy-100 text-burgundy-800"
        />

        <StatCard
          title="Registered Teams"
          value={formatNumber(teamsStats.totalTeams)}
          subtitle={`${teamsStats.teamParticipantsCount} in teams (${teamsStats.avgTeamSize} avg)`}
          icon={Users2}
          badgeText={`${teamsStats.totalTeams} Squads`}
          badgeColor="bg-purple-100 text-purple-900 border border-purple-200"
          onClick={() => {
            const el = document.getElementById('teams-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          accentColor="from-purple-700 to-indigo-900"
          iconBg="bg-purple-50 border-purple-200 text-purple-800"
        />

        <StatCard
          title="Total Colleges"
          value={formatNumber(metrics.totalColleges)}
          subtitle="Institutions participating"
          icon={Building2}
          onClick={() => onNavigate('colleges')}
          accentColor="from-slate-700 to-slate-900"
          iconBg="bg-slate-50 border-slate-200 text-slate-700"
        />

        <StatCard
          title="New Registrations"
          value={formatNumber(metrics.newCount)}
          subtitle="Needs verification"
          icon={Clock}
          badgeText={metrics.newCount > 0 ? `${metrics.newCount} Pending` : 'All Done'}
          badgeColor="bg-amber-100 text-amber-900"
          onClick={() => onNavigate('participants', 'new')}
          accentColor="from-amber-500 to-amber-600"
          iconBg="bg-amber-50 border-amber-200 text-amber-800"
        />

        <StatCard
          title="Verified Registrations"
          value={formatNumber(metrics.verifiedCount)}
          subtitle="Confirmed participants"
          icon={CheckCircle}
          badgeText={`${metrics.verifiedRate}% Rate`}
          badgeColor="bg-emerald-100 text-emerald-900"
          onClick={() => onNavigate('participants', 'verified')}
          accentColor="from-emerald-500 to-emerald-600"
          iconBg="bg-emerald-50 border-emerald-200 text-emerald-800"
        />

        <StatCard
          title="Verified Revenue"
          value={formatCurrency(metrics.verifiedAmount)}
          subtitle="Confirmed in account"
          icon={CreditCard}
          badgeText="Confirmed"
          badgeColor="bg-emerald-50 text-emerald-800 border border-emerald-200"
          onClick={() => onNavigate('payments')}
          accentColor="from-emerald-600 to-teal-700"
          iconBg="bg-emerald-50 border-emerald-200 text-emerald-800"
        />

        <StatCard
          title="Total Potential"
          value={formatCurrency(metrics.totalAmount)}
          subtitle="Verified + Pending sum"
          icon={DollarSign}
          onClick={() => onNavigate('payments')}
          accentColor="from-slate-800 to-neutral-900"
          iconBg="bg-slate-100 border-slate-200 text-slate-800"
        />
      </div>

      {/* Row 1: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Verification Status Donut Chart */}
        <div className="lg:col-span-5 card-elevated rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
                Verification Breakdown
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                Confirmed collections vs pending organizer audit
              </p>
            </div>
            <button
              onClick={() => onNavigate('participants', 'new')}
              className="text-xs font-bold text-burgundy-800 hover:text-burgundy-900 hover:underline cursor-pointer"
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
                  innerRadius={65}
                  outerRadius={92}
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

          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 text-center text-xs">
            <button
              onClick={() => onNavigate('participants', 'new')}
              className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 hover:bg-amber-100/80 active:scale-95 transition-all text-left cursor-pointer"
            >
              <span className="text-[10px] text-amber-800 font-extrabold uppercase block tracking-wider">New / Pending</span>
              <span className="font-extrabold text-amber-950 text-base">{metrics.newCount}</span>
              <span className="text-[11px] text-amber-700 block font-mono font-semibold">{formatCurrency(metrics.newAmount)}</span>
            </button>

            <button
              onClick={() => onNavigate('participants', 'verified')}
              className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/80 hover:bg-emerald-100/80 active:scale-95 transition-all text-left cursor-pointer"
            >
              <span className="text-[10px] text-emerald-800 font-extrabold uppercase block tracking-wider">Verified</span>
              <span className="font-extrabold text-emerald-950 text-base">{metrics.verifiedCount}</span>
              <span className="text-[11px] text-emerald-700 block font-mono font-semibold">{formatCurrency(metrics.verifiedAmount)}</span>
            </button>
          </div>
        </div>

        {/* Top Colleges Bar Chart */}
        <div className="lg:col-span-7 card-elevated rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
                Top Participating Institutions
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                Institutions with highest registration volume
              </p>
            </div>
            <button
              onClick={() => onNavigate('colleges')}
              className="text-xs font-bold text-burgundy-800 hover:text-burgundy-900 hover:underline cursor-pointer"
            >
              View Full Leaderboard →
            </button>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={collegeStats.topColleges}
                margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
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
                <Bar dataKey="participants" fill="#731010" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="text-[11px]">
              Active across <strong className="text-slate-900 font-bold">{metrics.totalColleges} Institutions</strong>
            </span>
            <button
              onClick={() => onNavigate('colleges')}
              className="text-burgundy-800 font-bold text-[11px] hover:underline"
            >
              Inspect Institutional Roster →
            </button>
          </div>
        </div>

      </div>

      {/* 🏆 Row 2: Registered Teams & Squads Section */}
      <div id="teams-section" className="card-elevated rounded-2xl p-5 sm:p-6 space-y-5 bg-white border border-slate-200">
        
        {/* Teams Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-800 shadow-2xs">
              <Users2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit uppercase tracking-wider flex items-center gap-2">
                <span>Registered Teams & Squads</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 font-mono font-bold">
                  {teamsStats.totalTeams} Teams
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Collaborative student squads, leadership, team rosters, and registered competitive events
              </p>
            </div>
          </div>

          {/* Quick Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                placeholder="Search team, lead, college..."
                className="pl-8 pr-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-800/20 focus:border-purple-800 transition-all w-full sm:w-56"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setTeamStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  teamStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({teamsStats.totalTeams})
              </button>
              <button
                type="button"
                onClick={() => setTeamStatusFilter('verified')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  teamStatusFilter === 'verified' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Verified ({teamsStats.fullyVerifiedTeams})
              </button>
              {teamsStats.partialTeams > 0 && (
                <button
                  type="button"
                  onClick={() => setTeamStatusFilter('partial')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    teamStatusFilter === 'partial' ? 'bg-white text-blue-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Partial ({teamsStats.partialTeams})
                </button>
              )}
              <button
                type="button"
                onClick={() => setTeamStatusFilter('pending')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  teamStatusFilter === 'pending' ? 'bg-white text-amber-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pending ({teamsStats.pendingTeams})
              </button>
            </div>
          </div>
        </div>

        {/* Teams Mini-Ribbon Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block">Total Squads</span>
              <span className="text-xl font-extrabold font-outfit text-purple-950 font-mono">{teamsStats.totalTeams}</span>
            </div>
            <Users2 className="h-5 w-5 text-purple-700/60 shrink-0" />
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">Students in Teams</span>
              <span className="text-xl font-extrabold font-outfit text-blue-950 font-mono">{teamsStats.teamParticipantsCount}</span>
            </div>
            <Users className="h-5 w-5 text-blue-700/60 shrink-0" />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Avg Squad Size</span>
              <span className="text-xl font-extrabold font-outfit text-slate-900 font-mono">{teamsStats.avgTeamSize} <span className="text-xs text-slate-500 font-sans font-medium">members</span></span>
            </div>
            <Award className="h-5 w-5 text-slate-400 shrink-0" />
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">Fully Verified</span>
              <span className="text-xl font-extrabold font-outfit text-emerald-950 font-mono">{teamsStats.fullyVerifiedTeams} / {teamsStats.totalTeams}</span>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-600/70 shrink-0" />
          </div>
        </div>

        {/* Team Cards Grid */}
        {filteredTeams.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            No teams found matching your search or filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeams.map((team) => (
              <div
                key={team.key}
                className="rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-card transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Team Card Header */}
                <div className="p-4 bg-gradient-to-br from-slate-50/80 to-white border-b border-slate-100 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-800 to-indigo-900 text-white font-extrabold flex items-center justify-center text-sm shadow-sm shrink-0">
                        {team.name ? team.name.slice(0, 2).toUpperCase() : 'TM'}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm font-outfit leading-tight group-hover:text-purple-900 transition-colors">
                          {team.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {team.memberCount} Members
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 ${
                      team.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : team.status === 'Partial'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}>
                      {team.status === 'Verified' ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                          <span>All {team.memberCount} Verified</span>
                        </>
                      ) : team.status === 'Partial' ? (
                        <>
                          <Clock className="h-3 w-3 text-blue-700" />
                          <span>{team.verifiedCount}/{team.memberCount} Verified</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-amber-700" />
                          <span>0/{team.memberCount} Verified</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* College & Dept */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-700 font-semibold truncate" title={team.college}>
                      <Building className="h-3.5 w-3.5 text-burgundy-800 shrink-0" />
                      <span className="truncate">{team.college}</span>
                    </div>
                    {team.department && (
                      <div className="text-[11px] text-slate-500 font-medium pl-5 truncate">
                        {team.department} ({team.year})
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Members List */}
                <div className="p-4 space-y-2.5 flex-1">
                  <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <span>Squad Roster</span>
                    <span className="text-[10px] font-mono text-slate-500 lowercase">{team.memberCount} registered</span>
                  </div>

                  <div className="space-y-1.5">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => onSelectParticipant && onSelectParticipant(member)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-between gap-2 cursor-pointer transition-colors group/item"
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <div className={`h-6 w-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            member.isLead
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-blue-100 text-blue-900 border border-blue-200'
                          }`}>
                            {member.name ? member.name[0].toUpperCase() : 'M'}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 text-xs truncate block group-hover/item:text-purple-900 transition-colors">
                              {member.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {member.id}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          {member.isLead ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
                              <Crown className="h-2.5 w-2.5 text-purple-700" />
                              <span>Lead</span>
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200">
                              Member
                            </span>
                          )}

                          {/* Individual Member Verification Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleVerify && onToggleVerify(member);
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0 ${
                              member.isVerified
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                            }`}
                            title={member.isVerified ? `Click to unverify ${member.name}` : `Click to verify ${member.name}`}
                          >
                            {member.isVerified ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                                <span>Verified</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 text-white" />
                                <span>Verify</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Registered Events */}
                  {team.events && team.events.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Registered Events
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {team.events.map((evt, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-burgundy-50 border border-burgundy-100 text-burgundy-900 text-[10px] font-bold"
                          >
                            {evt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Team Card Footer Actions */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onViewTeam ? onViewTeam(team.name) : onNavigate('participants', 'all')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>View in Directory</span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerifySquad(team)}
                    className={`py-1.5 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                      team.allVerified
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                    }`}
                  >
                    {team.allVerified
                      ? 'Unverify Squad'
                      : team.verifiedCount > 0
                      ? `Verify Remaining (${team.memberCount - team.verifiedCount})`
                      : 'Verify Squad'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Row 3: Live Recent Registrations Feed Table */}
      <div className="card-elevated rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-burgundy-800" /> Recent Registrations Stream
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Latest submissions received directly from Google Form
            </p>
          </div>
          <button
            onClick={() => onNavigate('participants', 'all')}
            className="inline-flex items-center space-x-1 text-xs font-bold text-burgundy-800 hover:text-burgundy-900 hover:underline cursor-pointer"
          >
            <span>View All ({data.length})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                <th className="table-header-cell">Participant</th>
                <th className="table-header-cell">College</th>
                <th className="table-header-cell">Dept / Year</th>
                <th className="table-header-cell">Txn ID / Proof</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell text-center">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRegistrations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="table-body-cell">
                    <div
                      onClick={() => onSelectParticipant && onSelectParticipant(item)}
                      className="cursor-pointer group flex items-center space-x-2.5"
                    >
                      <div className="h-8 w-8 rounded-lg bg-burgundy-50 border border-burgundy-100 text-burgundy-800 font-bold flex items-center justify-center shrink-0 group-hover:bg-burgundy-800 group-hover:text-white transition-colors">
                        {item.name ? item.name[0].toUpperCase() : 'P'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-burgundy-800 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="table-body-cell font-medium text-slate-700">
                    <div className="truncate max-w-[200px]" title={item.college}>
                      {item.college}
                    </div>
                  </td>

                  <td className="table-body-cell text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold text-[11px]">
                      {item.department} ({item.year})
                    </span>
                  </td>

                  <td className="table-body-cell">
                    {item.transactionId ? (
                      <span className="font-mono text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {item.transactionId}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>

                  <td className="table-body-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.isVerified ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {item.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>

                  <td className="table-body-cell text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleVerify(item)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                          item.isVerified
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                        }`}
                      >
                        {item.isVerified ? 'Unverify' : 'Verify'}
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectParticipant && onSelectParticipant(item)}
                        className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Insights & Data Quality Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Insights data={data} />
        <DataQuality qualityMetrics={qualityMetrics} onSelectParticipant={onSelectParticipant} />
      </div>

    </div>
  );
}
