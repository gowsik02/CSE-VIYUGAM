import React from 'react';
import { X, User, Building, Mail, Phone, CreditCard, Award, FileText } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function ParticipantDetailModal({ participant, onClose, onToggleVerify }) {
  if (!participant) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-burgundy-100 border border-burgundy-200 flex items-center justify-center text-burgundy-800 font-bold">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 font-outfit">
                {participant.name}
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                ID: {participant.id} | Row #{participant.rowIndex}
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

        {/* Participant Details Body */}
        <div className="py-4 space-y-4">
          
          {/* Verification Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            participant.isVerified
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                Status: {participant.isVerified ? 'Verified Registration' : 'New / Pending Verification'}
              </div>
              <p className="text-[11px] opacity-80 mt-0.5">
                {participant.isVerified
                  ? 'Confirmed participant — Counted in Verified Total Revenue.'
                  : 'New submission awaiting organizer verification.'}
              </p>
            </div>

            {onToggleVerify && (
              <button
                type="button"
                onClick={() => onToggleVerify(participant.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0 ${
                  participant.isVerified
                    ? 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {participant.isVerified ? 'Unverify' : 'Verify Now'}
              </button>
            )}
          </div>

          {/* Key Attributes */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">College / Institution</span>
              <span className="font-semibold text-neutral-900 flex items-center gap-1.5 mt-0.5">
                <Building className="h-3.5 w-3.5 text-burgundy-800 shrink-0" />
                {participant.college}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Fee Amount</span>
              <span className="font-bold text-neutral-900 mt-0.5 block text-sm">
                {formatCurrency(participant.amount)}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 col-span-2">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Department / Year</span>
              <span className="font-semibold text-neutral-900 mt-0.5 block">
                {participant.department} ({participant.year})
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-xs pt-2 border-t border-neutral-100">
            <h4 className="font-bold text-neutral-800 text-[11px] uppercase tracking-wider">Contact Information</h4>
            <div className="flex items-center space-x-2 text-neutral-700">
              <Mail className="h-3.5 w-3.5 text-neutral-400" />
              <span>{participant.email || 'No email provided'}</span>
            </div>
            <div className="flex items-center space-x-2 text-neutral-700">
              <Phone className="h-3.5 w-3.5 text-neutral-400" />
              <span>{participant.phone || 'No phone provided'}</span>
            </div>
            {participant.transactionId && (
              <div className="flex items-center space-x-2 text-neutral-700">
                <FileText className="h-3.5 w-3.5 text-neutral-400" />
                <span>Txn ID: <strong className="font-mono text-neutral-900">{participant.transactionId}</strong></span>
              </div>
            )}
          </div>

          {/* Events Registered */}
          <div className="space-y-2 text-xs pt-2 border-t border-neutral-100">
            <h4 className="font-bold text-neutral-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-burgundy-800" /> Registered Events
            </h4>
            {participant.events && participant.events.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {participant.events.map((evt, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-burgundy-50 border border-burgundy-200 text-burgundy-900 text-xs font-medium"
                  >
                    {evt}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 italic">No specific events selected in sheet.</p>
            )}
          </div>

        </div>

        <div className="pt-3 border-t border-neutral-200 flex justify-end">
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
