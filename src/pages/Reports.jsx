import React from 'react';
import { Download, Printer, FileSpreadsheet, Award, Users } from 'lucide-react';
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
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-base font-bold text-neutral-900 font-outfit uppercase tracking-wider">
            Analytics Reports & Export Center
          </h2>
          <p className="text-xs text-neutral-500">
            Generate printable symposium summaries or download CSV datasets
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportAllEventsDetailedCSV}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg border border-burgundy-200 bg-burgundy-50 text-xs font-semibold text-burgundy-900 hover:bg-burgundy-100 shadow-xs"
          >
            <Download className="h-4 w-4 text-burgundy-800" />
            <span>Export Event-Wise Participant CSV</span>
          </button>

          <button
            onClick={() => onExportCSV(data, 'filtered_participants_export.csv')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg border border-neutral-300 bg-white text-xs font-medium text-neutral-800 hover:bg-neutral-50 shadow-xs"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
            <span>Export Participants CSV</span>
          </button>

          <button
            onClick={handleExportSummaryCSV}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg border border-neutral-300 bg-white text-xs font-medium text-neutral-800 hover:bg-neutral-50 shadow-xs"
          >
            <Download className="h-4 w-4 text-neutral-700" />
            <span>Export Summary CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-burgundy-800 text-white text-xs font-semibold hover:bg-burgundy-900 shadow-xs transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-md space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Document Letterhead Header */}
        <div className="flex justify-between items-start border-b-2 border-burgundy-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-outfit text-burgundy-800 tracking-tight">
              CSE VIYUGAM 2026
            </h1>
            <p className="text-sm font-semibold text-neutral-800">
              National Level Technical Symposium ● Executive Registration & Event Participation Report
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              Source: Official Google Spreadsheet Sync
            </p>
          </div>
          <div className="text-right text-xs text-neutral-600 font-mono">
            <div>Report Date: {new Date().toLocaleDateString('en-IN')}</div>
            <div>Data Updated: {formatDate(lastUpdated)}</div>
            <div className="text-emerald-700 font-semibold mt-1">Status: Verified</div>
          </div>
        </div>

        {/* Section 1: Executive KPI Metrics */}
        <div>
          <h3 className="text-xs font-bold text-neutral-900 font-outfit uppercase tracking-wider mb-3">
            1. Executive Key Performance Indicators
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
              <div className="text-[10px] text-neutral-500 uppercase font-semibold">Total Participants</div>
              <div className="text-xl font-bold text-neutral-900 font-outfit mt-1">{metrics.totalParticipants}</div>
            </div>
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
              <div className="text-[10px] text-neutral-500 uppercase font-semibold">Total Colleges</div>
              <div className="text-xl font-bold text-neutral-900 font-outfit mt-1">{metrics.totalColleges}</div>
            </div>
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
              <div className="text-[10px] text-neutral-500 uppercase font-semibold">Verification Status</div>
              <div className="text-xs font-bold text-neutral-900 mt-1">
                Verified: {metrics.verifiedCount} ({metrics.verifiedRate}%) <br />
                New: {metrics.newCount}
              </div>
            </div>
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
              <div className="text-[10px] text-neutral-500 uppercase font-semibold">Verified Collections</div>
              <div className="text-xl font-bold text-emerald-800 font-outfit mt-1">{formatCurrency(metrics.verifiedAmount)}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Top Participating Colleges */}
        <div>
          <h3 className="text-xs font-bold text-neutral-900 font-outfit uppercase tracking-wider mb-3">
            2. Top 10 Participating Colleges Summary
          </h3>
          <table className="w-full text-left text-xs border border-neutral-200">
            <thead className="bg-neutral-100 font-semibold border-b border-neutral-200">
              <tr>
                <th className="p-2 w-12 text-center">Rank</th>
                <th className="p-2">College Name</th>
                <th className="p-2 text-center">Participants</th>
                <th className="p-2 text-center">% Share</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {collegeStats.topColleges.map((c) => (
                <tr key={c.rank}>
                  <td className="p-2 text-center font-mono font-bold">#{c.rank}</td>
                  <td className="p-2 font-semibold text-neutral-900">{c.college}</td>
                  <td className="p-2 text-center font-bold text-burgundy-800">{c.participants}</td>
                  <td className="p-2 text-center font-mono">{c.percentage}%</td>
                  <td className="p-2 text-right font-bold text-neutral-900">{formatCurrency(c.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Event Popularity Summary */}
        {eventStats.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-neutral-900 font-outfit uppercase tracking-wider mb-3">
              3. Symposium Event Participation Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {eventStats.map((evt, idx) => (
                <div key={idx} className="p-2.5 bg-neutral-50 border border-neutral-200 rounded flex justify-between items-center">
                  <span className="font-semibold text-neutral-800">{evt.name}</span>
                  <span className="font-bold text-burgundy-800">{evt.count} Registrations</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Event-Wise Participant List Report */}
        {eventDetailedBreakdown.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-neutral-200">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-outfit uppercase tracking-wider">
                4. Event-Wise Detailed Participant Breakdown
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Participant names and college details listed separately for each registered event
              </p>
            </div>

            <div className="space-y-6">
              {eventDetailedBreakdown.map((evt) => (
                <div key={evt.eventName} className="border border-neutral-200 rounded-lg overflow-hidden page-break-inside-avoid">
                  
                  {/* Event Title Banner */}
                  <div className="bg-neutral-100 p-3 border-b border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-burgundy-800" />
                      <span className="font-bold text-neutral-900 text-xs font-outfit uppercase">{evt.eventName}</span>
                    </div>
                    <div className="text-xs font-bold text-neutral-700 font-mono bg-white px-2 py-0.5 rounded border border-neutral-200">
                      Total Participants: <strong className="text-burgundy-800">{evt.count}</strong>
                    </div>
                  </div>

                  {/* Participant Table */}
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold text-[10px] uppercase">
                      <tr>
                        <th className="p-2 w-10 text-center">S.No</th>
                        <th className="p-2">Participant Name</th>
                        <th className="p-2">College Name</th>
                        <th className="p-2">Department / Year</th>
                        <th className="p-2">Registered On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 bg-white">
                      {evt.participants.map((p, idx) => (
                        <tr key={p.id || idx}>
                          <td className="p-2 text-center font-mono font-bold text-neutral-400">{idx + 1}</td>
                          <td className="p-2 font-bold text-neutral-900">{p.name}</td>
                          <td className="p-2 font-semibold text-neutral-800">{p.college}</td>
                          <td className="p-2 text-neutral-600">{p.department} {p.year !== 'N/A' ? `(${p.year})` : ''}</td>
                          <td className="p-2 font-mono text-[11px] text-neutral-700">{formatDate(p.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Footer */}
        <div className="pt-6 border-t border-neutral-200 text-center text-xs text-neutral-400 font-mono">
          CSE VIYUGAM 2026 ● National Level Technical Symposium Organizers Dashboard Report
        </div>

      </div>

    </div>
  );
}
