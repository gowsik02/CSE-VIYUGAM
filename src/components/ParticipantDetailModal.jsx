import React from 'react';
import {
  X,
  User,
  Building,
  Mail,
  Phone,
  Award,
  FileText,
  CheckCircle,
  RotateCcw,
  Clock,
  Calendar,
  ExternalLink,
  Users,
  Image as ImageIcon,
  Check,
  DollarSign,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function ParticipantDetailModal({ participant, onClose, onToggleVerify }) {
  if (!participant) return null;

  const initials = participant.name
    ? participant.name
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'P';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-modal border border-slate-200 relative overflow-hidden animate-slide-up">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-burgundy-700 to-burgundy-900 border border-burgundy-600/40 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-burgundy-950/20">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-outfit leading-tight">
                {participant.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono font-medium mt-0.5">
                ID: <strong className="text-slate-800">{participant.id}</strong> | Row #{participant.rowIndex}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-5 space-y-4 max-h-[72vh] overflow-y-auto pr-1">
          
          {/* Verification Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            participant.isVerified
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/90 border-amber-200 text-amber-950'
          }`}>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${participant.isVerified ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{participant.isVerified ? 'Verified Registration' : 'New / Pending Verification'}</span>
              </div>
              <p className="text-[11px] opacity-80 mt-0.5 font-medium">
                {participant.isVerified
                  ? 'Confirmed participant — Counted in Verified Total Collections.'
                  : 'Submission awaiting organizer audit.'}
              </p>
            </div>

            {onToggleVerify && (
              <button
                type="button"
                onClick={() => onToggleVerify(participant)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-2xs transition-all active:scale-95 shrink-0 cursor-pointer ${
                  participant.isVerified
                    ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white'
                }`}
              >
                {participant.isVerified ? 'Unverify' : 'Verify Now'}
              </button>
            )}
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">College / Institution</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-1">
                <Building className="h-3.5 w-3.5 text-burgundy-800 shrink-0" />
                <span className="truncate" title={participant.college}>{participant.college}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Registration Fee</span>
              <span className="font-extrabold text-slate-900 mt-1 block text-base font-mono">
                {formatCurrency(participant.amount)}
              </span>
            </div>

            {/* Date & Time Registered */}
            <div className="p-3.5 rounded-2xl bg-burgundy-50/50 border border-burgundy-100 col-span-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-burgundy-800/80 uppercase tracking-wider block">
                  Date & Time Registered
                </span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-1 text-xs">
                  <Clock className="h-3.5 w-3.5 text-burgundy-800 shrink-0" />
                  {formatDate(participant.timestamp)}
                </span>
              </div>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-md border border-burgundy-200 text-burgundy-900 font-bold">
                {participant.timestamp ? 'Live Sync' : 'Form Submission'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 col-span-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Department & Academic Year</span>
              <span className="font-bold text-slate-900 mt-1 block">
                {participant.department} ({participant.year})
              </span>
            </div>
          </div>

          {/* Contact & Verification Proof */}
          <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">Contact & Verification Proof</h4>
            <div className="flex items-center space-x-2.5 text-slate-700 font-medium">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">{participant.email || 'No email provided'}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-700 font-medium">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{participant.phone || 'No phone provided'}</span>
            </div>
            {participant.transactionId && (
              <div className="flex items-center space-x-2.5 text-slate-700 font-medium">
                <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Transaction ID: <strong className="font-mono text-slate-900 font-bold">{participant.transactionId}</strong></span>
              </div>
            )}
            {participant.paymentScreenshot && (
              <div className="pt-1.5">
                <a
                  href={participant.paymentScreenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 text-xs font-bold transition-colors"
                >
                  <ImageIcon className="h-4 w-4 text-emerald-700" />
                  <span>View Uploaded Payment Screenshot</span>
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-600 ml-1" />
                </a>
              </div>
            )}
          </div>

          {/* Team Details (if applicable) */}
          {(participant.teamName || (participant.teamMembers && participant.teamMembers.length > 0)) && (
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-4 w-4 text-burgundy-800" /> Team Information
              </h4>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                {participant.teamName && (
                  <div>
                    <span className="text-slate-500 font-medium">Team Name: </span>
                    <strong className="text-slate-900 font-bold">{participant.teamName}</strong>
                    {participant.teamSize && (
                      <span className="ml-2 text-[11px] text-slate-500 font-mono">({participant.teamSize} members)</span>
                    )}
                  </div>
                )}
                {participant.teamMembers && participant.teamMembers.length > 0 && (
                  <div>
                    <span className="text-slate-500 font-medium block mb-1">Team Members:</span>
                    <div className="flex flex-wrap gap-1">
                      {participant.teamMembers.map((tm, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px] font-bold">
                          {tm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Events Registered */}
          <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-burgundy-800" /> Registered Events
            </h4>
            {participant.events && participant.events.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {participant.events.map((evt, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-burgundy-50 border border-burgundy-200 text-burgundy-950 text-xs font-bold shadow-2xs"
                  >
                    {evt}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">No specific events selected.</p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
