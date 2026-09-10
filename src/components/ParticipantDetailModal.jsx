import React from 'react';
import { X, User, Building, Mail, Phone, Award, FileText, CheckCircle, RotateCcw } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function ParticipantDetailModal({ participant, onClose, onToggleVerify }) {
  if (!participant) return null;

  const initials = participant.name ? participant.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'P';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200/90 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center space-x-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-burgundy-700 to-burgundy-900 border border-burgundy-600/40 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-burgundy-950/20">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-neutral-900 font-outfit leading-tight">
                {participant.name}
              </h3>
              <p className="text-xs text-neutral-500 font-mono font-medium">
                ID: {participant.id} | Row #{participant.rowIndex}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Participant Details Body */}
        <div className="py-5 space-y-4">
          
          {/* Verification Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            participant.isVerified
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${participant.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{participant.isVerified ? 'Verified Registration' : 'New / Pending Verification'}</span>
              </div>
              <p className="text-[11px] opacity-80 mt-0.5 font-medium">
                {participant.isVerified
                  ? 'Confirmed participant — Counted in Verified Total Revenue.'
                  : 'New submission awaiting organizer verification.'}
              </p>
            </div>

            {onToggleVerify && (
              <button
                type="button"
                onClick={() => onToggleVerify(participant)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95 shrink-0 ${
                  participant.isVerified
                    ? 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white'
                }`}
              >
                {participant.isVerified ? 'Unverify' : 'Verify Now'}
              </button>
            )}
          </div>

          {/* Key Attributes */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-200/80">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">College / Institution</span>
              <span className="font-bold text-neutral-900 flex items-center gap-1.5 mt-1">
                <Building className="h-3.5 w-3.5 text-burgundy-800 shrink-0" />
                {participant.college}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-200/80">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">Fee Amount</span>
              <span className="font-extrabold text-neutral-900 mt-1 block text-base font-mono">
                {formatCurrency(participant.amount)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-200/80 col-span-2">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">Department & Academic Year</span>
              <span className="font-bold text-neutral-900 mt-1 block">
                {participant.department} ({participant.year})
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5 text-xs pt-2 border-t border-neutral-100">
            <h4 className="font-extrabold text-neutral-800 text-[11px] uppercase tracking-wider">Contact Information</h4>
            <div className="flex items-center space-x-2.5 text-neutral-700 font-medium">
              <Mail className="h-4 w-4 text-neutral-400" />
              <span>{participant.email || 'No email provided'}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-neutral-700 font-medium">
              <Phone className="h-4 w-4 text-neutral-400" />
              <span>{participant.phone || 'No phone provided'}</span>
            </div>
            {participant.transactionId && (
              <div className="flex items-center space-x-2.5 text-neutral-700 font-medium">
                <FileText className="h-4 w-4 text-neutral-400" />
                <span>Txn ID: <strong className="font-mono text-neutral-900">{participant.transactionId}</strong></span>
              </div>
            )}
          </div>

          {/* Events Registered */}
          <div className="space-y-2.5 text-xs pt-2 border-t border-neutral-100">
            <h4 className="font-extrabold text-neutral-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-burgundy-800" /> Registered Events
            </h4>
            {participant.events && participant.events.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {participant.events.map((evt, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-burgundy-50 border border-burgundy-200/80 text-burgundy-950 text-xs font-bold shadow-2xs"
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

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 active:scale-95 rounded-xl transition-all"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
