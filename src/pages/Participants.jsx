import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  RotateCcw,
  Filter,
  UserCheck,
  Calendar,
  Building,
  Mail,
  Phone,
  Image as ImageIcon,
  ExternalLink,
  Users,
  Award,
  FileCheck2,
  FileX2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportVerifiedReportPDF, exportNonVerifiedReportPDF } from '../utils/pdfExport';

export default function Participants({
  data,
  initialTab = 'new',
  onSelectParticipant,
  onToggleVerify,
  onExportCSV,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sortField, setSortField] = useState('rowIndex');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabFilteredData = useMemo(() => {
    if (activeTab === 'new') return data.filter(d => !d.isVerified);
    if (activeTab === 'verified') return data.filter(d => d.isVerified);
    if (activeTab === 'teams') return data.filter(d => Boolean(d.teamName));
    return data;
  }, [data, activeTab]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedData = useMemo(() => {
    return [...tabFilteredData].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [tabFilteredData, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage]);

  const newCount = useMemo(() => data.filter(d => !d.isVerified).length, [data]);
  const verifiedCount = useMemo(() => data.filter(d => d.isVerified).length, [data]);
  const teamsCount = useMemo(() => data.filter(d => Boolean(d.teamName)).length, [data]);

  return (
    <div className="card-elevated rounded-2xl space-y-0 overflow-hidden">
      
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 font-outfit uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-burgundy-800" /> Participant Directory & Verification Roster
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Manage registrations according to Excel verification slide. Download official Verified and Non-Verified PDF reports.
          </p>
        </div>

        {/* Action Buttons: Verified PDF, Non-Verified PDF, and CSV */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Verified PDF */}
          <button
            onClick={() => exportVerifiedReportPDF(data)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Download official PDF report for Verified attendees (YES in Excel)"
          >
            <FileCheck2 className="h-4 w-4 text-emerald-700" />
            <span>Verified PDF ({verifiedCount})</span>
          </button>

          {/* Download Non-Verified PDF */}
          <button
            onClick={() => exportNonVerifiedReportPDF(data)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50 text-xs font-bold text-rose-900 hover:bg-rose-100 transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Download audit PDF report for Non-Verified attendees (NO in Excel)"
          >
            <FileX2 className="h-4 w-4 text-rose-700" />
            <span>Non-Verified PDF ({newCount})</span>
          </button>

          {/* Export Filtered CSV */}
          <button
            onClick={() => onExportCSV(tabFilteredData, `cse_viyugam_${activeTab}_registrations.csv`)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <Download className="h-4 w-4 text-burgundy-800" />
            <span>Export CSV ({tabFilteredData.length})</span>
          </button>
        </div>
      </div>

      {/* Modern Pill Section Tabs */}
      <div className="px-4 sm:px-5 pt-3 bg-slate-50/80 border-b border-slate-200/90 flex items-center space-x-2 overflow-x-auto">
        
        {/* Verified Registrations Tab (YES in Excel) */}
        <button
          onClick={() => { setActiveTab('verified'); setCurrentPage(1); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
            activeTab === 'verified'
              ? 'bg-white text-emerald-950 border-emerald-600 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Verified Names (YES)</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-200 font-mono">
            {verifiedCount}
          </span>
        </button>

        {/* Non-Verified Submissions Tab (NO in Excel) */}
        <button
          onClick={() => { setActiveTab('new'); setCurrentPage(1); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
            activeTab === 'new'
              ? 'bg-white text-rose-950 border-rose-600 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          <Clock className="h-4 w-4 text-rose-600" />
          <span>Non-Verified Names (NO)</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-900 border border-rose-200 font-mono">
            {newCount}
          </span>
        </button>

        {/* Teams & Squads Tab */}
        <button
          onClick={() => { setActiveTab('teams'); setCurrentPage(1); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
            activeTab === 'teams'
              ? 'bg-white text-purple-950 border-purple-700 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          <Users className="h-4 w-4 text-purple-700" />
          <span>Teams & Squads</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-900 border border-purple-200 font-mono">
            {teamsCount}
          </span>
        </button>

        {/* All Registrations Tab */}
        <button
          onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white text-burgundy-950 border-burgundy-800 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          <Users className="h-4 w-4 text-burgundy-800" />
          <span>All Names</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-800 font-mono">
            {data.length}
          </span>
        </button>

      </div>

      {/* Directory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('rowIndex')}
                className="table-header-cell cursor-pointer hover:bg-slate-100"
              >
                <div className="flex items-center space-x-1.5">
                  <span>#</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('name')}
                className="table-header-cell cursor-pointer hover:bg-slate-100"
              >
                <div className="flex items-center space-x-1.5">
                  <span>Participant</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('college')}
                className="table-header-cell cursor-pointer hover:bg-slate-100"
              >
                <div className="flex items-center space-x-1.5">
                  <span>College / Institution</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>

              <th className="table-header-cell">Contact Info</th>
              <th className="table-header-cell">Events Registered</th>
              <th className="table-header-cell">Txn & Proof</th>

              <th
                onClick={() => handleSort('amount')}
                className="table-header-cell cursor-pointer hover:bg-slate-100"
              >
                <div className="flex items-center space-x-1.5">
                  <span>Fee</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>

              <th className="table-header-cell">Status</th>
              <th className="table-header-cell text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                  No registrations found in this view.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Row Index */}
                  <td className="table-body-cell font-mono text-slate-400 text-[11px] font-bold">
                    #{item.displayRowIndex || item.rowIndex}
                  </td>

                  {/* Participant Name & ID */}
                  <td className="table-body-cell">
                    <div
                      onClick={() => onSelectParticipant && onSelectParticipant(item)}
                      className="cursor-pointer group flex items-center space-x-2.5"
                    >
                      <div className={`h-8 w-8 rounded-lg font-bold flex items-center justify-center shrink-0 transition-colors ${
                        item.isTeamMember
                          ? 'bg-blue-50 border border-blue-200 text-blue-800 group-hover:bg-blue-800 group-hover:text-white'
                          : 'bg-burgundy-50 border border-burgundy-100 text-burgundy-800 group-hover:bg-burgundy-800 group-hover:text-white'
                      }`}>
                        {item.name ? item.name[0].toUpperCase() : 'P'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-burgundy-800 transition-colors flex items-center gap-1.5 flex-wrap">
                          <span>{item.name}</span>
                          {item.isTeamMember ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center">
                              Team Member
                            </span>
                          ) : item.teamName ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center">
                              Team Lead
                            </span>
                          ) : null}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 flex-wrap">
                          <span>{item.id}</span>
                          {item.teamName && (
                            <>
                              <span>•</span>
                              <span className="text-slate-600 font-semibold font-sans">Team: {item.teamName}</span>
                            </>
                          )}
                          {item.isTeamMember && item.leadName && (
                            <>
                              <span>•</span>
                              <span className="text-slate-500 font-sans">Lead: {item.leadName}</span>
                            </>
                          )}
                          {item.timestamp && (
                            <>
                              <span>•</span>
                              <span>{formatDate(item.timestamp)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* College Name & Department */}
                  <td className="table-body-cell">
                    <div className="font-semibold text-slate-800 max-w-[220px] truncate" title={item.college}>
                      {item.college}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {item.department} ({item.year})
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="table-body-cell text-[11px]">
                    <div className="flex items-center space-x-1 text-slate-700">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span>{item.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500 truncate max-w-[170px]" title={item.email}>
                      <Mail className="h-3 w-3 text-slate-400" />
                      <span className="truncate">{item.email || 'N/A'}</span>
                    </div>
                  </td>

                  {/* Events Registered */}
                  <td className="table-body-cell">
                    {item.events && item.events.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {item.events.map((evt, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-burgundy-50 border border-burgundy-100 text-burgundy-900 text-[10px] font-bold truncate max-w-[190px]"
                            title={evt}
                          >
                            {evt}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">No events chosen</span>
                    )}
                  </td>

                  {/* Transaction ID & Screenshot */}
                  <td className="table-body-cell">
                    {item.transactionId && (
                      <div className="font-mono text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded text-[11px] inline-block">
                        {item.transactionId}
                      </div>
                    )}
                    {item.paymentScreenshot && (
                      <div className="mt-1">
                        <a
                          href={item.paymentScreenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                        >
                          <ImageIcon className="h-3 w-3" />
                          <span>View Proof</span>
                          <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                        </a>
                      </div>
                    )}
                  </td>

                  {/* Fee Amount */}
                  <td className="table-body-cell font-mono font-bold text-slate-900">
                    {formatCurrency(item.amount)}
                  </td>

                  {/* Status Pill */}
                  <td className="table-body-cell">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.isVerified
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-100 text-rose-900 border border-rose-200'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${item.isVerified ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      <span>{item.isVerified ? 'Verified (YES)' : 'Non-Verified (NO)'}</span>
                    </span>
                    {item.excelVerification && (
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                        Excel: {item.excelVerification}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="table-body-cell text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleVerify(item)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                          item.isVerified
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                        }`}
                        title={item.isVerified ? `Click to unverify ${item.name}` : `Click to verify ${item.name}`}
                      >
                        {item.isVerified ? 'Unverify' : 'Verify'}
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectParticipant && onSelectParticipant(item)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          Showing rows <strong className="text-slate-900 font-bold">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
          <strong className="text-slate-900 font-bold">{Math.min(currentPage * pageSize, sortedData.length)}</strong> of{' '}
          <strong className="text-slate-900 font-bold">{sortedData.length}</strong>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="font-semibold text-slate-800">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
