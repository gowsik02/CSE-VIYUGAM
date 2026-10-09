import React from 'react';
import { Download, Printer, FileSpreadsheet, Award, Users, ShieldCheck, Building, CreditCard, Calendar } from 'lucide-react';
import { calculateSummaryMetrics, calculateCollegeParticipation, calculateEventParticipation, calculateEventDetailedBreakdown } from '../utils/analytics';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

export default function Reports({ data, lastUpdated, onExportCSV }) {
  const metrics = calculateSummaryMetrics(data);
  const collegeStats = calculateCollegeParticipation(data, 10);
  const eventStats = calculateEventParticipation(data);
  const eventDetailedBreakdown = calculateEventDetailedBreakdown(data);

  const handlePrint = () => {
    window.print();
  };

  const handleExportSummaryCSV = () => {
    const summaryRows = [
      { Metric: 'Total Participants', Value: metrics.totalParticipants },
      { Metric: 'Total Colleges', Value: metrics.totalColleges },
      { Metric: 'Verified Registrations', Value: `${metrics.verifiedCount} (${metrics.verifiedRate}%)` },
      { Metric: 'New Registrations', Value: metrics.newCount },
      { Metric: 'Verified Revenue Collected', Value: formatCurrency(metrics.verifiedAmount) },
      { Metric: 'Total Potential Revenue', Value: formatCurrency(metrics.totalAmount) },
      { Metric: 'Report Generated Date', Value: new Date().toLocaleString() },
    ];
    onExportCSV(summaryRows, 'cse_viyugam_analytics_summary.csv');
  };

  const handleExportAllEventsDetailedCSV = () => {
    const allRows = [];
    eventDetailedBreakdown.forEach((evt) => {
      evt.participants.forEach((p, idx) => {
        allRows.push({
          'Event Name': evt.eventName,
          'S.No': idx + 1,
          'Participant Name': p.name,
          'College Name': p.college,
          'Department': p.department,
          'Academic Year': p.year,
          'Verification Status': p.isVerified ? 'Verified' : 'New / Pending',
          'Date & Time Registered': formatDate(p.timestamp),
          'Phone': p.phone,
          'Email': p.email,
        });
      });
    });
    onExportCSV(allRows, 'cse_viyugam_event_wise_participants_report.csv');
  };

  return (
    <div className="space-y-6">
      
      {/* Export Action Bar */}
      <div className="card-elevated rounded-2xl p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 no-print bg-white">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
            Symposium Reports & Export Center
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Generate printable official summaries or download CSV datasets for accreditation and audits
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportAllEventsDetailedCSV}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-burgundy-200 bg-burgundy-50 text-xs font-bold text-burgundy-900 hover:bg-burgundy-100 shadow-2xs cursor-pointer"
          >
            <Download className="h-4 w-4 text-burgundy-800" />
            <span>Event-Wise CSV</span>
          </button>

          <button
            onClick={() => onExportCSV(data, 'cse_viyugam_participants_export.csv')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
            <span>Participants CSV</span>
          </button>

          <button
            onClick={handleExportSummaryCSV}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-2xs cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-700" />
            <span>Summary CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-burgundy-800 text-white text-xs font-bold hover:bg-burgundy-900 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Printable Official Document Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-burgundy-800 block">
              Department of Computer Science & Engineering
            </span>
            <h1 className="text-2xl font-extrabold font-outfit text-slate-900 tracking-tight">
              CSE VIYUGAM 2026
            </h1>
            <p className="text-xs text-slate-600 font-semibold">
              National Level Technical Symposium — Official Executive Summary
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono space-y-1">
            <div className="font-bold text-slate-900">Official Report</div>
            <div>Source: Google Sheet Sync</div>
            <div>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            {lastUpdated && <div>Synced: {formatDate(lastUpdated)}</div>}
          </div>
        </div>

        {/* 1. Key Performance Indicators Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
            1. Executive Key Performance Indicators
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Total Registrations</span>
              <div className="text-xl font-extrabold text-slate-900 font-outfit mt-1">{formatNumber(metrics.totalParticipants)}</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Participating Colleges</span>
              <div className="text-xl font-extrabold text-slate-900 font-outfit mt-1">{formatNumber(metrics.totalColleges)}</div>
            </div>
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Verified Collections</span>
              <div className="text-xl font-extrabold text-emerald-950 font-outfit mt-1">{formatCurrency(metrics.verifiedAmount)}</div>
            </div>
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">Verification Rate</span>
              <div className="text-xl font-extrabold text-amber-950 font-outfit mt-1">{metrics.verifiedRate}% ({metrics.verifiedCount} / {metrics.totalParticipants})</div>
            </div>
          </div>
        </div>

        {/* 2. Institutional Participation Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
            2. Institutional Participation Summary (Top 10)
          </h3>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-2.5 border-b border-slate-200">#</th>
                <th className="p-2.5 border-b border-slate-200">College / Institution</th>
                <th className="p-2.5 border-b border-slate-200 text-center">Registrations</th>
                <th className="p-2.5 border-b border-slate-200 text-center">Verified</th>
                <th className="p-2.5 border-b border-slate-200 text-right">Confirmed Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {collegeStats.topColleges.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-500 font-bold">#{idx + 1}</td>
                  <td className="p-2.5 font-semibold text-slate-900">{c.college}</td>
                  <td className="p-2.5 text-center font-bold text-slate-800">{c.participants}</td>
                  <td className="p-2.5 text-center text-emerald-700 font-bold">{c.verifiedCount}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-900">{formatCurrency(c.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Event Roster Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
            3. Symposium Competitions Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {eventStats.map((evt, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">{evt.eventName}</span>
                <span className="font-mono text-xs font-extrabold text-burgundy-800 bg-burgundy-50 px-2 py-0.5 rounded border border-burgundy-100">
                  {evt.participants}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Signature & Verification Seal Section */}
        <div className="pt-12 border-t border-slate-200 grid grid-cols-3 text-center text-xs text-slate-600 font-semibold gap-4">
          <div className="space-y-12">
            <div className="h-0.5 bg-slate-300 w-3/4 mx-auto" />
            <div>Staff Coordinator</div>
          </div>
          <div className="space-y-12">
            <div className="h-0.5 bg-slate-300 w-3/4 mx-auto" />
            <div>Student Coordinator</div>
          </div>
          <div className="space-y-12">
            <div className="h-0.5 bg-slate-300 w-3/4 mx-auto" />
            <div>Head of Department (CSE)</div>
          </div>
        </div>

      </div>

    </div>
  );
}
