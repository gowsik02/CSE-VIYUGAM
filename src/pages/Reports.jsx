import React from 'react';
import { Download, Printer, FileSpreadsheet, Award, Users, ShieldCheck, Building, CreditCard, Calendar, FileCheck2, FileX2 } from 'lucide-react';
import { calculateSummaryMetrics, calculateCollegeParticipation, calculateEventParticipation, calculateEventDetailedBreakdown } from '../utils/analytics';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';
import { exportVerifiedReportPDF, exportNonVerifiedReportPDF } from '../utils/pdfExport';

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
      { Metric: 'Verified Registrations (YES in Excel)', Value: `${metrics.verifiedCount} (${metrics.verifiedRate}%)` },
      { Metric: 'Non-Verified Submissions (NO in Excel)', Value: metrics.newCount },
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
          'Verification Status': p.isVerified ? 'YES (Verified)' : 'NO (Non-Verified)',
          'Excel Status': p.excelVerification || (p.isVerified ? 'YES' : 'NO'),
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
      <div className="card-elevated rounded-2xl p-5 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 no-print bg-white">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
            Symposium Reports & Export Center
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Generate official Verified and Non-Verified PDF reports, executive summaries, and CSV datasets
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Verified PDF */}
          <button
            onClick={() => exportVerifiedReportPDF(data)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-950 hover:bg-emerald-100 shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Download official Verified Participants PDF report (YES in Excel)"
          >
            <FileCheck2 className="h-4 w-4 text-emerald-700" />
            <span>Verified PDF ({metrics.verifiedCount})</span>
          </button>

          {/* Download Non-Verified PDF */}
          <button
            onClick={() => exportNonVerifiedReportPDF(data)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50 text-xs font-bold text-rose-950 hover:bg-rose-100 shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Download Non-Verified Submissions Audit PDF report (NO in Excel)"
          >
            <FileX2 className="h-4 w-4 text-rose-700" />
            <span>Non-Verified PDF ({metrics.newCount})</span>
          </button>

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
            <span>Print Report</span>
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
              <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">All students registered</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Participating Colleges</span>
              <div className="text-xl font-extrabold text-slate-900 font-outfit mt-1">{formatNumber(metrics.totalColleges)}</div>
              <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">Institutions represented</span>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Verified (YES in Excel)</span>
                <button
                  type="button"
                  onClick={() => exportVerifiedReportPDF(data)}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline inline-flex items-center gap-0.5"
                >
                  <FileCheck2 className="h-3 w-3" /> PDF
                </button>
              </div>
              <div className="text-xl font-extrabold text-emerald-950 font-outfit mt-1">
                {metrics.verifiedCount} <span className="text-xs font-semibold text-emerald-700">({metrics.verifiedRate}%)</span>
              </div>
              <span className="text-[10px] text-emerald-700 mt-0.5 block font-medium">Fee: {formatCurrency(metrics.verifiedAmount)}</span>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider block">Non-Verified (NO in Excel)</span>
                <button
                  type="button"
                  onClick={() => exportNonVerifiedReportPDF(data)}
                  className="text-[10px] font-bold text-rose-700 hover:text-rose-900 hover:underline inline-flex items-center gap-0.5"
                >
                  <FileX2 className="h-3 w-3" /> PDF
                </button>
              </div>
              <div className="text-xl font-extrabold text-rose-950 font-outfit mt-1">
                {metrics.newCount} <span className="text-xs font-semibold text-rose-700">({100 - metrics.verifiedRate}%)</span>
              </div>
              <span className="text-[10px] text-rose-700 mt-0.5 block font-medium">Pending organizer check</span>
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

        {/* 4. Verification Audit Classification (Excel Verification Slide) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
              4. Verification Audit Classification (Excel Verification Slide)
            </h3>
            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={() => exportVerifiedReportPDF(data)}
                className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <FileCheck2 className="h-3.5 w-3.5 text-emerald-700" />
                <span>Export Verified PDF ({metrics.verifiedCount})</span>
              </button>
              <button
                type="button"
                onClick={() => exportNonVerifiedReportPDF(data)}
                className="text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <FileX2 className="h-3.5 w-3.5 text-rose-700" />
                <span>Export Non-Verified PDF ({metrics.newCount})</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                  Official Verified Attendees (YES in Excel)
                </span>
                <div className="text-2xl font-extrabold font-outfit text-emerald-950 mt-1">
                  {metrics.verifiedCount} <span className="text-sm font-semibold text-emerald-700">Students</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1 font-medium">
                  Marked as YES in spreadsheet. Confirmed credentials & attendance roster.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-200 text-emerald-900 font-mono">
                {metrics.verifiedRate}%
              </span>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-rose-900 uppercase tracking-wider block">
                  Non-Verified Submissions (NO in Excel)
                </span>
                <div className="text-2xl font-extrabold font-outfit text-rose-950 mt-1">
                  {metrics.newCount} <span className="text-sm font-semibold text-rose-700">Students</span>
                </div>
                <p className="text-xs text-rose-800 mt-1 font-medium">
                  Marked as NO in spreadsheet. Awaiting fee reconciliation or verification.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-200 text-rose-900 font-mono">
                {(100 - parseFloat(metrics.verifiedRate)).toFixed(1)}%
              </span>
            </div>
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
