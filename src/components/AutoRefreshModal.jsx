import React from 'react';
import { X, Clock, Check } from 'lucide-react';

const INTERVAL_OPTIONS = [
  { value: 0, label: 'Off', desc: 'Manual refresh only' },
  { value: 300000, label: 'Every 5 minutes', desc: 'Auto-syncs spreadsheet every 5 mins' },
  { value: 900000, label: 'Every 15 minutes', desc: 'Auto-syncs spreadsheet every 15 mins' },
  { value: 1800000, label: 'Every 30 minutes', desc: 'Auto-syncs spreadsheet every 30 mins' },
];

export default function AutoRefreshModal({ isOpen, onClose, currentInterval, onSetInterval }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-burgundy-800" />
            <h3 className="text-base font-bold text-neutral-900 font-outfit">
              Auto Refresh Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-neutral-500">
            Select an interval to automatically fetch updated registration data from Google Sheets in the background.
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
                  className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-burgundy-800 bg-burgundy-50 text-burgundy-950 font-semibold'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-neutral-900">{opt.label}</div>
                    <div className="text-[11px] text-neutral-500">{opt.desc}</div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-burgundy-800" />}
                </button>
              );
            })}
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
