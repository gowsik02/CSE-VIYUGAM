import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Copy, ChevronDown, ChevronUp, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function DataQuality({ qualityMetrics, onSelectParticipant }) {
  const [activeTab, setActiveTab] = useState(null);

  if (!qualityMetrics) return null;

  const {
    totalRecords,
    validCount,
    missingName,
    missingCollege,
    duplicateCount,
    duplicates,
    affectedRecords,
  } = qualityMetrics;

  const toggleTab = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <div className="card-elevated rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-4 w-4 text-burgundy-800" />
          <h3 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
            Data Quality & Integrity Audit
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          Automated Sheet Validation
        </span>
      </div>

      {/* Quality Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Valid Records</span>
          </div>
          <div className="text-xl font-extrabold font-outfit text-emerald-950 mt-1">
            {validCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            {totalRecords > 0 ? ((validCount / totalRecords) * 100).toFixed(1) : 0}% Complete
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleTab('name')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            missingName > 0
              ? 'bg-amber-50/80 border-amber-200/80 hover:bg-amber-100/70'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Missing Name
            </span>
            {missingName > 0 && (activeTab === 'name' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
          </div>
          <div className="text-xl font-extrabold font-outfit text-amber-950 mt-1">{missingName}</div>
          <div className="text-[11px] text-amber-700 font-medium">Click to inspect</div>
        </button>

        <button
          type="button"
          onClick={() => toggleTab('college')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            missingCollege > 0
              ? 'bg-amber-50/80 border-amber-200/80 hover:bg-amber-100/70'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Missing College
            </span>
            {missingCollege > 0 && (activeTab === 'college' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
          </div>
          <div className="text-xl font-extrabold font-outfit text-amber-950 mt-1">{missingCollege}</div>
          <div className="text-[11px] text-amber-700 font-medium">Click to inspect</div>
        </button>

        <button
          type="button"
          onClick={() => toggleTab('duplicates')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            duplicateCount > 0
              ? 'bg-rose-50 border-rose-200 hover:bg-rose-100/70'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-800">
            <span className="flex items-center gap-1">
              <Copy className="h-3.5 w-3.5 text-rose-600" /> Duplicates
            </span>
            {duplicateCount > 0 && (activeTab === 'duplicates' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
          </div>
          <div className="text-xl font-extrabold font-outfit text-rose-950 mt-1">{duplicateCount}</div>
          <div className="text-[11px] text-rose-700 font-medium">Potential dupes</div>
        </button>

      </div>

      {activeTab && (
        <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/90 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Affected Records: {activeTab}
            </h4>
            <button
              onClick={() => setActiveTab(null)}
              className="text-xs text-slate-500 hover:text-slate-900 underline font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>

          {activeTab === 'duplicates' ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {duplicates.length === 0 ? (
                <div className="text-xs text-slate-500 font-medium">No duplicate records detected.</div>
              ) : (
                duplicates.map((dup, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectParticipant && onSelectParticipant(dup.record)}
                    className="p-3 bg-white border border-rose-200 rounded-xl text-xs hover:border-rose-400 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{dup.record.name} ({dup.record.id})</span>
                      <span className="text-rose-700 font-semibold text-[11px]">{dup.reason}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      College: {dup.record.college} | Email: {dup.record.email || 'N/A'}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {(affectedRecords[activeTab === 'name' ? 'missingName' : 'missingCollege'] || []).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectParticipant && onSelectParticipant(item)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs hover:border-burgundy-800 cursor-pointer flex justify-between items-center"
                >
                  <span className="font-bold text-slate-800">{item.name} ({item.id})</span>
                  <span className="text-[11px] text-slate-500 font-medium">{item.college}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
