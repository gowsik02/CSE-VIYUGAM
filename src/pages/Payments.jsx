import React, { useState, useMemo } from 'react';
import { CreditCard, CheckCircle2, Clock, DollarSign, Download, Check, Search, RotateCcw } from 'lucide-react';
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
        
        <div className="card-elevated rounded-2xl p-5 border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 to-white">
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

        <div className="card-elevated rounded-2xl p-5 border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-white">
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

        <div className="card-elevated rounded-2xl p-5 border-neutral-200/80">
          <div className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">Total Potential Revenue</div>
          <div className="text-3xl font-extrabold font-outfit text-neutral-900 mt-2 font-mono">
            {formatCurrency(paymentStats.totalRevenue)}
          </div>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Verified + Pending Registration Sum
          </p>
        </div>

        <div className="card-elevated rounded-2xl p-5 border-neutral-200/80">
          <div className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">Verification Rate</div>
          <div className="text-3xl font-extrabold font-outfit text-burgundy-800 mt-2">
            {metrics.verifiedRate}%
          </div>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Verified / Total Registrations
          </p>
        </div>

      </div>

      {/* Payment Search Bar */}
      <div className="relative group">
        <Search className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3 group-focus-within:text-burgundy-800 transition-colors" />
        <input
          type="text"
          value={paymentSearch}
          onChange={(e) => setPaymentSearch(e.target.value)}
          placeholder="Search payments by student name, college, transaction ID, email, or phone..."
          className="block w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-neutral-200/90 rounded-2xl bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 shadow-2xs transition-all"
        />
      </div>

      {/* Row 2: Two Separate Action Lists for New vs Verified Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: New Registrations Awaiting Verification */}
        <div className="card-elevated rounded-2xl overflow-hidden border-amber-200/80">
          <div className="p-4 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-700" />
              <div>
                <h3 className="text-sm font-extrabold text-amber-950 font-outfit uppercase tracking-wider">
                  New Submissions ({newRegs.length})
                </h3>
                <p className="text-[11px] text-amber-800 font-medium">
                  Click "Verify" to confirm payment into Verified Total ({formatCurrency(newRegs.reduce((a,c) => a + c.amount, 0))})
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto bg-white">
            {newRegs.length === 0 ? (
              <div className="p-12 text-center text-xs text-neutral-400 font-medium">
                No pending registrations matching your search.
              </div>
            ) : (
              newRegs.map((item) => (
                <div key={item.id} className="p-3.5 hover:bg-amber-50/30 flex items-center justify-between text-xs transition-colors">
                  <div>
                    <div className="font-extrabold text-neutral-900">{item.name}</div>
                    <div className="text-[11px] text-neutral-500 font-medium">
                      {item.college} | Txn ID: <strong className="font-mono text-neutral-800">{item.transactionId || 'N/A'}</strong>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-extrabold text-neutral-900 font-mono text-sm">{formatCurrency(item.amount)}</span>
                    <button
                      type="button"
                      onClick={() => onToggleVerify(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1"
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

        {/* Section 2: Verified Registrations */}
        <div className="card-elevated rounded-2xl overflow-hidden border-emerald-200/80">
          <div className="p-4 bg-emerald-50/80 border-b border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              <div>
                <h3 className="text-sm font-extrabold text-emerald-950 font-outfit uppercase tracking-wider">
                  Verified Collections ({verifiedRegs.length})
                </h3>
                <p className="text-[11px] text-emerald-800 font-medium">
                  Confirmed Revenue Total: {formatCurrency(verifiedRegs.reduce((a,c) => a + c.amount, 0))}
                </p>
              </div>
            </div>
            <button
              onClick={() => onExportCSV(verifiedRegs, 'verified_registrations.csv')}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl border border-emerald-200 bg-white text-xs text-emerald-900 font-bold hover:bg-emerald-100/50 shadow-2xs active:scale-95 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto bg-white">
            {verifiedRegs.length === 0 ? (
              <div className="p-12 text-center text-xs text-neutral-400 font-medium">
                No verified registrations matching search.
              </div>
            ) : (
              verifiedRegs.map((item) => (
                <div key={item.id} className="p-3.5 hover:bg-emerald-50/30 flex items-center justify-between text-xs transition-colors">
                  <div>
                    <div className="font-extrabold text-neutral-900">{item.name}</div>
                    <div className="text-[11px] text-neutral-500 font-medium">
                      {item.college} | Txn ID: <strong className="font-mono text-neutral-800">{item.transactionId || 'N/A'}</strong>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-extrabold text-emerald-900 font-mono text-sm">{formatCurrency(item.amount)}</span>
                    <button
                      type="button"
                      onClick={() => onToggleVerify(item)}
                      className="px-2.5 py-1 rounded-xl border border-neutral-200 text-neutral-600 hover:text-amber-800 hover:bg-amber-50 text-[10px] font-bold active:scale-95 transition-all flex items-center gap-1"
                      title="Move back to New Registrations"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Unverify</span>
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
