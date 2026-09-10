import React from 'react';
import { X, Building2, Users, CheckCircle, Clock, ArrowRight, User } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function CollegeDetailsModal({ collegeName, participants = [], onClose, onToggleVerify, onViewInDirectory }) {
  if (!collegeName) return null;

  const verifiedCount = participants.filter(p => p.isVerified).length;
  const newCount = participants.length - verifiedCount;
  const totalAmount = participants.reduce((acc, p) => acc + (p.isVerified ? p.amount || 250 : 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl border border-neutral-200 space-y-5 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-neutral-200 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-burgundy-100 border border-burgundy-200 flex items-center justify-center text-burgundy-800 shrink-0 font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 font-outfit">
                {collegeName}
              </h3>
              <p className="text-xs text-neutral-500">
                Institutional Roster ({participants.length} Registered Participants)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
            <span className="text-[10px] font-bold text-neutral-400 uppercase block">Total Registered</span>
            <span className="text-lg font-bold text-neutral-900 font-outfit mt-0.5 block">{participants.length} Students</span>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Verified Collections</span>
            <span className="text-lg font-bold text-emerald-950 font-outfit mt-0.5 block">{formatCurrency(totalAmount)} ({verifiedCount} Verified)</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Pending Verification</span>
            <span className="text-lg font-bold text-amber-950 font-outfit mt-0.5 block">{newCount} Submissions</span>
          </div>
        </div>

        {/* Participants Table List */}
        <div className="flex-1 overflow-y-auto border border-neutral-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-600 font-semibold uppercase sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Participant Name</th>
                <th className="py-2.5 px-3">Contact Details</th>
                <th className="py-2.5 px-3">Dept / Year</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {participants.map((item, idx) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-neutral-400 text-[11px]">{idx + 1}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-neutral-900">{item.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{item.id}</div>
                  </td>
                  <td className="py-2.5 px-3 text-neutral-600 text-[11px]">
                    <div>{item.phone || item.email || 'N/A'}</div>
                    {item.transactionId && <div className="text-[10px] text-neutral-400 font-mono">Txn: {item.transactionId}</div>}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-600 text-[11px]">
                    {item.department} ({item.year})
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.isVerified ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {item.isVerified ? 'Verified' : 'New'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {!item.isVerified ? (
                      <button
                        type="button"
                        onClick={() => onToggleVerify(item)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                      >
                        Verify
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleVerify(item)}
                        className="px-2 py-1 rounded border border-neutral-300 text-neutral-500 hover:text-amber-800 text-[10px]"
                      >
                        Unverify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onClose();
              if (onViewInDirectory) onViewInDirectory(collegeName);
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-burgundy-800 hover:underline"
          >
            <span>Open in Filtered Directory</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
