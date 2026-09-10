import React, { useState, useEffect, useMemo } from 'react';
import { Download, ArrowUpDown, ChevronLeft, ChevronRight, CheckCircle, Clock, RotateCcw, Filter, UserCheck, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

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
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs space-y-0">
      
      {/* Header Bar */}
      <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 font-outfit uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-burgundy-800" /> Participant Registration Directory
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Click any row to inspect complete participant details or toggle verification
          </p>
        </div>

        <button
          onClick={() => onExportCSV(tabFilteredData, `cse_viyugam_${activeTab}_registrations.csv`)}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-xs"
        >
          <Download className="h-3.5 w-3.5 text-burgundy-800" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Understandable Section Tabs */}
      <div className="px-5 pt-3 bg-neutral-50/70 border-b border-neutral-200 flex items-center space-x-2">
        
        {/* New Registrations Tab */}
        <button
          onClick={() => { setActiveTab('new'); setCurrentPage(1); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg text-xs font-bold transition-all border-b-2 ${
            activeTab === 'new'
              ? 'bg-white text-amber-950 border-amber-600 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900 border-transparent'
          }`}
        >
          <Clock className="h-4 w-4 text-amber-600" />
          <span>New Registrations (Action Needed: {newCount})</span>
        </button>

        {/* Verified Registrations Tab */}
        <button
          onClick={() => { setActiveTab('verified'); setCurrentPage(1); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg text-xs font-bold transition-all border-b-2 ${
            activeTab === 'verified'
              ? 'bg-white text-emerald-950 border-emerald-600 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900 border-transparent'
          }`}
        >
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Verified Registrations (Approved: {verifiedCount})</span>
        </button>

        {/* All Registrations Tab */}
        <button
          onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg text-xs font-bold transition-all border-b-2 ${
            activeTab === 'all'
              ? 'bg-white text-burgundy-950 border-burgundy-800 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900 border-transparent'
          }`}
        >
          <Filter className="h-4 w-4 text-neutral-400" />
          <span>All Registrations ({data.length})</span>
        </button>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 cursor-pointer hover:text-neutral-900" onClick={() => handleSort('name')}>
                <div className="flex items-center space-x-1">
                  <span>Participant Name</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-neutral-900" onClick={() => handleSort('college')}>
                <div className="flex items-center space-x-1">
                  <span>College / Institution</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4">Contact Details</th>
              <th className="py-3 px-4">Dept / Year</th>
              <th className="py-3 px-4">Events</th>
              <th className="py-3 px-4 cursor-pointer hover:text-neutral-900" onClick={() => handleSort('amount')}>
                <div className="flex items-center space-x-1">
                  <span>Fee</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-neutral-900" onClick={() => handleSort('paymentStatus')}>
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-neutral-500 font-medium">
                  No records in "{activeTab}" section.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectParticipant(item)}
                  className="hover:bg-neutral-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 text-center font-mono text-neutral-400 text-[11px]">
                    {item.rowIndex}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-neutral-900">{item.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{item.id}</div>
                  </td>
                  <td className="py-3 px-4 text-neutral-800 font-medium max-w-xs truncate">
                    {item.college}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 text-[11px]">
                    <div>{item.phone || item.email || 'N/A'}</div>
                    {item.transactionId && (
                      <div className="text-[10px] text-neutral-400 font-mono">Txn: {item.transactionId}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 text-[11px]">
                    {item.department} {item.year !== 'N/A' ? `(${item.year})` : ''}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    {item.events && item.events.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.events.slice(0, 2).map((evt, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-medium">
                            {evt}
                          </span>
                        ))}
                        {item.events.length > 2 && (
                          <span className="text-[10px] text-neutral-400 font-semibold">
                            +{item.events.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-neutral-400 italic text-[11px]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-neutral-900">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      item.isVerified ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}>
                      {item.isVerified ? 'Verified' : 'New Submissions'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {!item.isVerified ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVerify(item);
                        }}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.02]"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Verify Registration</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVerify(item);
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-neutral-300 text-neutral-500 hover:text-amber-800 hover:bg-amber-50 text-[11px] font-medium transition-colors"
                        title="Move back to New Registrations"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Unverify</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
        <div>
          Page <strong className="text-neutral-900">{currentPage}</strong> of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
