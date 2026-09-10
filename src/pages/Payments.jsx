import React from 'react';
import { CreditCard, CheckCircle2, Clock, DollarSign, Download, Check } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { calculateSummaryMetrics, calculatePaymentSummary } from '../utils/analytics';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function Payments({ data, onExportCSV, onToggleVerify }) {
  const metrics = calculateSummaryMetrics(data);
  const paymentStats = calculatePaymentSummary(data);

  const newRegs = data.filter(d => !d.isVerified);
  const verifiedRegs = data.filter(d => d.isVerified);

  return (
    <div className="space-y-6">
      
      {/* 4 Revenue & Verification KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-xs bg-emerald-50/20">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Verified Collections
          </div>
          <div className="text-3xl font-extrabold font-outfit text-emerald-950 mt-2">
            {formatCurrency(paymentStats.verifiedRevenue)}
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            {paymentStats.verifiedCount} Verified Paid Registrations
          </p>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs bg-amber-50/20">
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-600" /> Pending Verification Value
          </div>
          <div className="text-3xl font-extrabold font-outfit text-amber-950 mt-2">
            {formatCurrency(paymentStats.newRevenue)}
          </div>
          <p className="text-xs text-amber-700 font-medium mt-1">
            {paymentStats.newCount} New Registrations Awaiting Verification
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Potential Collections</div>
          <div className="text-3xl font-extrabold font-outfit text-neutral-900 mt-2">
            {formatCurrency(paymentStats.totalRevenue)}
          </div>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Verified + New Registrations Sum
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Verification Rate</div>
          <div className="text-3xl font-extrabold font-outfit text-burgundy-800 mt-2">
            {metrics.verifiedRate}%
          </div>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Verified / Total Registrations
          </p>
        </div>

      </div>

      {/* Row 2: Two Separate Sections for New vs Verified Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: New Registrations Awaiting Verification */}
        <div className="bg-white rounded-xl border border-amber-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-700" />
              <div>
                <h3 className="text-sm font-bold text-amber-950 font-outfit uppercase tracking-wider">
                  New Registrations ({newRegs.length})
                </h3>
                <p className="text-[11px] text-amber-800">
                  Click "Verify" to approve and add to Verified Collections ({formatCurrency(paymentStats.newRevenue)})
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-neutral-200 max-h-96 overflow-y-auto">
            {newRegs.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                All incoming registrations are verified! No pending new registrations.
              </div>
            ) : (
              newRegs.map((item) => (
                <div key={item.id} className="p-3 hover:bg-amber-50/40 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-neutral-900">{item.name}</div>
                    <div className="text-[11px] text-neutral-500">
                      {item.college} | Txn: {item.transactionId || 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-neutral-900">{formatCurrency(item.amount)}</span>
                    <button
                      type="button"
                      onClick={() => onToggleVerify(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1"
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
        <div className="bg-white rounded-xl border border-emerald-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              <div>
                <h3 className="text-sm font-bold text-emerald-950 font-outfit uppercase tracking-wider">
                  Verified Registrations ({verifiedRegs.length})
                </h3>
                <p className="text-[11px] text-emerald-800">
                  Confirmed Collections Total: {formatCurrency(paymentStats.verifiedRevenue)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onExportCSV(verifiedRegs, 'verified_registrations.csv')}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded border border-emerald-300 bg-white text-xs text-emerald-900 font-medium hover:bg-emerald-100/50"
            >
              <Download className="h-3 w-3" />
              <span>Export</span>
            </button>
          </div>

          <div className="divide-y divide-neutral-200 max-h-96 overflow-y-auto">
            {verifiedRegs.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No verified registrations yet. Click "Verify" on new registrations above!
              </div>
            ) : (
              verifiedRegs.map((item) => (
                <div key={item.id} className="p-3 hover:bg-emerald-50/40 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-neutral-900">{item.name}</div>
                    <div className="text-[11px] text-neutral-500">
                      {item.college} | Txn: {item.transactionId || 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-emerald-900">{formatCurrency(item.amount)}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Verified
                    </span>
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
