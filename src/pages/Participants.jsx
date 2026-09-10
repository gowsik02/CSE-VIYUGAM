import React, { useState, useEffect, useMemo } from 'react';
import { Download, ArrowUpDown, ChevronLeft, ChevronRight, CheckCircle, Clock, RotateCcw, Filter, UserCheck, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Participants({ data, initialTab = 'new', onSelectParticipant, onToggleVerify, onExportCSV }) {
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

  return (
    <div className="card-elevated rounded-2xl space-y-0 overflow-hidden">
      
      {/* Header Bar */}
      <div className="p-5 border-b border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
        <div>
          <h2 className="text-base font-extrabold text-neutral-900 font-outfit uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-burgundy-800" /> Participant Registration Directory
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5 font-medium">
            Inspect complete registration records, filter by status, or verify payments
          </p>
        </div>

        <button
          onClick={() => onExportCSV(tabFilteredData, `cse_viyugam_${activeTab}_registrations.csv`)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs active:scale-95"
        >
          <Download className="h-4 w-4 text-burgundy-800" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Modern Pill Section Tabs */}
      <div className="px-5 pt-3 bg-neutral-50/80 border-b border-neutral-200/80 flex items-center space-x-2 overflow-x-auto">
        
        {/* New Registrations Tab */}
        <button
          onClick={() => { setActiveTab('new'); setCurrentPage(1); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all border-b-2 ${
            activeTab === 'new'
              ? 'bg-white text-amber-950 border-amber-600 shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900 border-transparent'
          }`}
        >
          <Clock className="h-4 w-4 text-amber-600" />
          <span>New Registrations</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 border border-amber-200">
            {newCount}
          </span>
        </button>

        {/* Verified Registrations Tab */}
        <button
          onClick={() => { setActiveTab('verified'); setCurrentPage(1); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all border-b-2 ${
            activeTab === 'verified'
              ? 'bg-white text-emerald-950 border-emerald-600 shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900 border-transparent'
          }`}
        >
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Verified Registrations</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-200">
            {verifiedCount}
          </span>
        </button>

        {/* All Registrations Tab */}
        <button
          onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all border-b-2 ${
            activeTab === 'all'
              ? 'bg-white text-burgundy-950 border-burgundy-800 shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900 border-transparent'
          }`}
        >
          <Filter className="h-4 w-4 text-neutral-400" />
          <span>All Registrations</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-neutral-200 text-neutral-800">
            {data.length}
          </span>
        </button>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50/90 border-b border-neutral-200/80 text-neutral-500 font-extrabold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-neutral-900" onClick={() => handleSort('name')}>
                <div className="flex items-center space-x-1">
                  <span>Participant Name</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-neutral-900" onClick={() => handleSort('college')}>
                <div className="flex items-center space-x-1">
                  <span>Institution</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Date & Time Registered</th>
              <th className="py-3.5 px-4">Dept / Year</th>
              <th className="py-3.5 px-4">Events</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-neutral-900" onClick={() => handleSort('amount')}>
                <div className="flex items-center space-x-1">
                  <span>Fee</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-neutral-900" onClick={() => handleSort('paymentStatus')}>
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-neutral-400 font-medium">
                  No records in "{activeTab}" section matching filters.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const initials = item.name ? item.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'P';
                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectParticipant(item)}
                    className="hover:bg-burgundy-50/30 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-neutral-400 text-[11px] font-medium">
                      {item.rowIndex}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-burgundy-100 to-burgundy-200 border border-burgundy-300/60 flex items-center justify-center text-burgundy-900 font-extrabold text-xs shrink-0 shadow-2xs">
                          {initials}
                        </div>
                        <div>
                          <div className="font-extrabold text-neutral-900 group-hover:text-burgundy-900 transition-colors">{item.name}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">{item.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-800 font-bold max-w-xs truncate">
                      {item.college}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600 text-[11px]">
                      <div className="font-medium text-neutral-800">{item.phone || item.email || 'N/A'}</div>
                      {item.transactionId && (
                        <div className="text-[10px] text-neutral-400 font-mono">Txn: {item.transactionId}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-700 text-[11px]">
                      <div className="font-bold text-neutral-800 flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="h-3 w-3 text-burgundy-800 shrink-0" />
                        {formatDate(item.timestamp)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600 text-[11px] font-medium">
                      {item.department} {item.year !== 'N/A' ? `(${item.year})` : ''}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      {item.events && item.events.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.events.slice(0, 2).map((evt, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[10px] font-bold border border-neutral-200/80">
                              {evt}
                            </span>
                          ))}
                          {item.events.length > 2 && (
                            <span className="text-[10px] text-neutral-400 font-extrabold">
                              +{item.events.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-neutral-900 font-mono">
                      {formatCurrency(item.amount)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs ${
                        item.isVerified ? 'badge-glow-emerald' : 'badge-glow-amber'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${item.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{item.isVerified ? 'Verified' : 'New Submission'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {!item.isVerified ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleVerify(item);
                          }}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs shadow-md shadow-emerald-900/20 active:scale-95 transition-all"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Verify</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleVerify(item);
                          }}
                          className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl border border-neutral-300/80 text-neutral-600 hover:text-amber-800 hover:bg-amber-50 text-[11px] font-bold transition-all active:scale-95"
                          title="Move back to New Registrations"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Unverify</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-neutral-200/80 flex items-center justify-between text-xs text-neutral-600 bg-white">
        <div className="font-medium">
          Page <strong className="text-neutral-900 font-extrabold">{currentPage}</strong> of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 active:scale-95 disabled:opacity-40 shadow-2xs"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 active:scale-95 disabled:opacity-40 shadow-2xs"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
