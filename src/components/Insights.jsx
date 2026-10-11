import React from 'react';
import { Sparkles } from 'lucide-react';
import { generateInsights } from '../utils/analytics';

export default function Insights({ data }) {
  const insights = generateInsights(data);

  return (
    <div className="card-elevated rounded-2xl p-5 mb-6">
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <h3 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
          Executive Observations & Insights
        </h3>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insightText, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs leading-relaxed text-slate-700 flex items-start space-x-2.5"
          >
            <span className="text-burgundy-800 font-extrabold font-mono text-xs shrink-0 mt-0.5">
              0{idx + 1}.
            </span>
            <div
              className="insight-html"
              dangerouslySetInnerHTML={{
                __html: insightText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950">$1</strong>'),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
