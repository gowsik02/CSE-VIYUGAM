import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Copy, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

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
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-5 w-5 text-burgundy-800" />
          <h3 className="text-sm font-bold text-neutral-900 font-outfit uppercase tracking-wider">
            Data Quality & Audit Engine
          </h3>
        </div>
        <span className="text-xs text-neutral-500 font-medium">
          Automated Spreadsheet Validation
        </span>
      </div>

      {/* Quality Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Valid Records</span>
          </div>
          <div className="text-xl font-bold font-outfit text-emerald-950 mt-1">
            {validCount}
          </div>
          <div className="text-[11px] text-emerald-700">
            {totalRecords > 0 ? ((validCount / totalRecords) * 100).toFixed(1) : 0}% Complete
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleTab('name')}
          className={`p-3 rounded-lg border text-left transition-all ${
            missingName > 0
              ? 'bg-amber-50 border-amber-200 hover:bg-amber-100/70'
              : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Missing Name
            </span>
            {missingName > 0 && (activeTab === 'name' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
          </div>
          <div className="text-xl font-bold font-outfit text-amber-950 mt-1">{missingName}</div>
          <div className="text-[11px] text-amber-700">Click to view records</div>
        </button>

        <button
          type="button"
          onClick={() => toggleTab('college')}
          className={`p-3 rounded-lg border text-left transition-all ${
            missingCollege > 0
              ? 'bg-amber-50 border-amber-200 hover:bg-amber-100/70'
              : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Missing College
            </span>
            {missingCollege > 0 && (activeTab === 'college' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
          </div>
          <div className="text-xl font-bold font-outfit text-amber-950 mt-1">{missingCollege}</div>
          <div className="text-[11px] text-amber-700">Click to view records</div>
        </button>

        <button
          type="button"
          onClick={() => toggleTab('duplicates')}
          className={`p-3 rounded-lg border text-left transition-all ${
            duplicateCount > 0
              ? 'bg-red-50 border-red-200 hover:bg-red-100/70'
              : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-red-800">
            <span className="flex items-center gap-1">
              <Copy className="h-3.5 w-3.5 text-red-600" /> Duplicates Flagged
            </span>
            {duplicateCount > 0 && (activeTab === 'duplicates' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
          </div>
          <div className="text-xl font-bold font-outfit text-red-950 mt-1">{duplicateCount}</div>
          <div className="text-[11px] text-red-700">Flagged potential duplicates</div>
        </button>

      </div>

      {activeTab && (
        <div className="mt-4 pt-4 border-t border-neutral-200 bg-neutral-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-neutral-800 uppercase">
              Affected Records: {activeTab}
            </h4>
            <button
              onClick={() => setActiveTab(null)}
              className="text-xs text-neutral-500 hover:text-neutral-800 underline"
            >
              Close Details
            </button>
          </div>

          {activeTab === 'duplicates' ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {duplicates.length === 0 ? (
                <div className="text-xs text-neutral-500">No duplicate records detected.</div>
              ) : (
                duplicates.map((dup, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectParticipant && onSelectParticipant(dup.record)}
                    className="p-2.5 bg-white border border-red-200 rounded-md text-xs hover:border-red-400 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between font-semibold text-neutral-900">
                      <span>{dup.record.name} ({dup.record.id})</span>
                      <span className="text-red-700 font-normal">{dup.reason}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
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
                  className="p-2 bg-white border border-neutral-200 rounded text-xs hover:border-burgundy-800 cursor-pointer flex justify-between items-center"
                >
                  <span className="font-semibold text-neutral-800">{item.name} ({item.id})</span>
                  <span className="text-[11px] text-neutral-500">{item.college}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
