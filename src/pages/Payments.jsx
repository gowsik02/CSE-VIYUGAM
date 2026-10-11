import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Check,
  Search,
  RotateCcw,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { calculateSummaryMetrics, calculatePaymentSummary } from '../utils/analytics';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function Payments({ data, onExportCSV, onToggleVerify }) {
  const [paymentSearch, setPaymentSearch] = useState('');
  const metrics = calculateSummaryMetrics(data);
  const paymentStats = calculatePaymentSummary(data);

  const filteredData = useMemo(() => {
    if (!paymentSearch.trim()) return data;
    const term = paymentSearch.toLowerCase().trim();
    return data.filter(d => 
      d.name.toLowerCase().includes(term) ||
      d.college.toLowerCase().includes(term) ||
      d.transactionId.toLowerCase().includes(term) ||
      d.email.toLowerCase().includes(term) ||
      d.phone.includes(term)
    );
  }, [data, paymentSearch]);

  const newRegs = filteredData.filter(d => !d.isVerified);
  const verifiedRegs = filteredData.filter(d => d.isVerified);

  return (
    <div className="space-y-6">
      
      {/* 4 Revenue & Verification KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="card-elevated rounded-2xl p-5 border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 to-white">
          <div className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Verified Collections
          </div>
          <div className="text-3xl font-extrabold font-outfit text-emerald-950 mt-2 font-mono">
            {formatCurrency(paymentStats.verifiedRevenue)}
          </div>
          <p className="text-xs text-emerald-700 font-bold mt-1 flex items-center justify-between">
            <span>{paymentStats.verifiedCount} Confirmed Payments</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-extrabold">Active</span>
          </p>
        </div>

        <div className="card-elevated rounded-2xl p-5 border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-white">
          <div className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-600" /> Pending Value
          </div>
          <div className="text-3xl font-extrabold font-outfit text-amber-950 mt-2 font-mono">
            {formatCurrency(paymentStats.newRevenue)}
          </div>
          <p className="text-xs text-amber-700 font-bold mt-1 flex items-center justify-between">
            <span>{paymentStats.newCount} Awaiting Verification</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-extrabold">Pending</span>
          </p>
        </div>

        <div className="card-elevated rounded-2xl p-5 border-slate-200">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Potential Revenue</div>
          <div className="text-3xl font-extrabold font-outfit text-slate-900 mt-2 font-mono">
            {formatCurrency(paymentStats.totalRevenue)}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Verified + Pending Registration Sum
          </p>
        </div>

        <div className="card-elevated rounded-2xl p-5 border-slate-200">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Verification Progress</div>
          <div className="text-3xl font-extrabold font-outfit text-burgundy-800 mt-2">
            {metrics.verifiedRate}%
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {paymentStats.verifiedCount} of {data.length} registered students
          </p>
        </div>

      </div>

      {/* Payment Search Bar */}
      <div className="relative group">
        <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3 group-focus-within:text-burgundy-800 transition-colors" />
        <input
          type="text"
          value={paymentSearch}
          onChange={(e) => setPaymentSearch(e.target.value)}
          placeholder="Search payments by student name, college, transaction ID, email, or mobile..."
          className="block w-full pl-10 pr-4 py-2.5 text-xs font-semibold border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 shadow-2xs transition-all"
        />
      </div>

      {/* Row 2: Two Side-by-Side Reconciliation Boards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: New Registrations Awaiting Verification */}
        <div className="card-elevated rounded-2xl overflow-hidden border-amber-200/90">
          <div className="p-4 bg-amber-50/90 border-b border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-700" />
              <div>
                <h3 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider font-outfit">
                  Pending Verification Submissions ({newRegs.length})
                </h3>
                <p className="text-[11px] text-amber-800 mt-0.2 font-medium">
                  Review transaction code & drive screenshot to confirm into verified collections
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-extrabold text-amber-950 bg-white/90 px-2.5 py-1 rounded-lg border border-amber-200">
              {formatCurrency(newRegs.reduce((a, c) => a + c.amount, 0))}
            </span>
          </div>

          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto divide-y divide-slate-100">
            {newRegs.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-bold text-slate-700">All submissions are currently verified!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No pending records awaiting action.</p>
              </div>
            ) : (
              newRegs.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 group">
                  <div className="space-y-1 min-w-0">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      <span className="truncate">{item.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">#{item.rowIndex}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 truncate font-medium">{item.college}</div>
                    
                    <div className="flex items-center flex-wrap gap-1.5 pt-0.5 text-[11px]">
                      {item.transactionId ? (
                        <span className="font-mono font-bold bg-amber-100/90 text-amber-950 px-2 py-0.5 rounded text-[10px] border border-amber-200">
                          Txn: {item.transactionId}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">No Txn ID</span>
                      )}

                      {item.paymentScreenshot && (
                        <a
                          href={item.paymentScreenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                        >
                          <ImageIcon className="h-3 w-3" />
                          <span>View Proof</span>
                          <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    <span className="font-extrabold text-slate-900 font-mono text-sm">
                      {formatCurrency(item.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleVerify(item)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Verify</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Verified Registrations Board */}
        <div className="card-elevated rounded-2xl overflow-hidden border-emerald-200/90">
          <div className="p-4 bg-emerald-50/90 border-b border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              <div>
                <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider font-outfit">
                  Verified Collections Roster ({verifiedRegs.length})
                </h3>
                <p className="text-[11px] text-emerald-800 mt-0.2 font-medium">
                  Confirmed participants counted in official financial report
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-extrabold text-emerald-950 bg-white/90 px-2.5 py-1 rounded-lg border border-emerald-200">
              {formatCurrency(verifiedRegs.reduce((a, c) => a + c.amount, 0))}
            </span>
          </div>

          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto divide-y divide-slate-100">
            {verifiedRegs.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Clock className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No verified registrations yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click "Verify" on any pending submission on the left.</p>
              </div>
            ) : (
              verifiedRegs.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 group">
                  <div className="space-y-1 min-w-0">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      <span className="truncate">{item.name}</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">Verified</span>
                    </div>
                    <div className="text-[11px] text-slate-600 truncate font-medium">{item.college}</div>
                    
                    <div className="flex items-center flex-wrap gap-1.5 pt-0.5 text-[11px]">
                      {item.transactionId && (
                        <span className="font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px]">
                          Txn: {item.transactionId}
                        </span>
                      )}

                      {item.paymentScreenshot && (
                        <a
                          href={item.paymentScreenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                        >
                          <ImageIcon className="h-3 w-3" />
                          <span>Proof</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    <span className="font-extrabold text-emerald-900 font-mono text-sm">
                      {formatCurrency(item.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleVerify(item)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-500 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Unverify
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
