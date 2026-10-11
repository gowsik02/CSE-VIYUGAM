import React from 'react';
import { X, Building2, Users, CheckCircle, Clock, ArrowRight, User } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function CollegeDetailsModal({
  collegeName,
  participants = [],
  onClose,
  onToggleVerify,
  onViewInDirectory,
}) {
  if (!collegeName) return null;

  const verifiedCount = participants.filter(p => p.isVerified).length;
  const newCount = participants.length - verifiedCount;
  const totalAmount = participants.reduce((acc, p) => acc + (p.isVerified ? p.amount || 250 : 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-modal border border-slate-200 space-y-5 max-h-[90vh] flex flex-col animate-slide-up">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-11 w-11 rounded-2xl bg-burgundy-50 border border-burgundy-100 flex items-center justify-center text-burgundy-800 shrink-0 font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-outfit">
                {collegeName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Institutional Roster ({participants.length} Registered Student{participants.length === 1 ? '' : 's'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Registered</span>
            <span className="text-lg font-extrabold text-slate-900 font-outfit mt-0.5 block">{participants.length} Students</span>
          </div>

          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Verified Collections</span>
            <span className="text-lg font-extrabold text-emerald-950 font-outfit mt-0.5 block font-mono">{formatCurrency(totalAmount)} ({verifiedCount})</span>
          </div>

          <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">Pending Verification</span>
            <span className="text-lg font-extrabold text-amber-950 font-outfit mt-0.5 block">{newCount} Submissions</span>
          </div>
        </div>

        {/* Participants Table List */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3.5">#</th>
                <th className="py-2.5 px-3.5">Participant Name</th>
                <th className="py-2.5 px-3.5">Contact Details</th>
                <th className="py-2.5 px-3.5">Dept / Year</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {participants.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5 font-mono text-slate-400 text-[11px]">#{idx + 1}</td>
                  <td className="py-3 px-3.5">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.id}</div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-600 text-[11px]">
                    <div>{item.phone || item.email || 'N/A'}</div>
                    {item.transactionId && <div className="text-[10px] text-slate-400 font-mono">Txn: {item.transactionId}</div>}
                  </td>
                  <td className="py-3 px-3.5 text-slate-600 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold">
                      {item.department} ({item.year})
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.isVerified ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {item.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleVerify(item)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        item.isVerified
                          ? 'border border-slate-200 text-slate-500 hover:text-rose-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                      }`}
                    >
                      {item.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onClose();
              if (onViewInDirectory) onViewInDirectory(collegeName);
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-burgundy-800 hover:underline cursor-pointer"
          >
            <span>Open in Filtered Directory</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
