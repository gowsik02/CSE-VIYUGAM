import React from 'react';
import { X, Clock, Check } from 'lucide-react';

const INTERVAL_OPTIONS = [
  { value: 0, label: 'Off', desc: 'Manual sync button only' },
  { value: 300000, label: 'Every 5 minutes', desc: 'Auto-fetches Google Sheet every 5 mins' },
  { value: 900000, label: 'Every 15 minutes', desc: 'Auto-fetches Google Sheet every 15 mins' },
  { value: 1800000, label: 'Every 30 minutes', desc: 'Auto-fetches Google Sheet every 30 mins' },
];

export default function AutoRefreshModal({ isOpen, onClose, currentInterval, onSetInterval }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-modal border border-slate-200 animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-burgundy-50 border border-burgundy-100 flex items-center justify-center text-burgundy-800">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 font-outfit">
              Auto-Sync Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-slate-500 font-medium">
            Choose an interval to automatically refresh registration records from your Google Form sheet in the background.
          </p>

          <div className="space-y-2">
            {INTERVAL_OPTIONS.map((opt) => {
              const isSelected = currentInterval === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onSetInterval(opt.value);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-burgundy-800 bg-burgundy-50/80 text-burgundy-950 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">{opt.desc}</div>
                  </div>
                  {isSelected && (
                    <div className="h-6 w-6 rounded-full bg-burgundy-800 text-white flex items-center justify-center">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
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
