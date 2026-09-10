import React from 'react';
import { Sparkles } from 'lucide-react';
import { generateInsights } from '../utils/analytics';

export default function Insights({ data }) {
  const insights = generateInsights(data);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs mb-6">
      <div className="flex items-center space-x-2 pb-3 border-b border-neutral-100">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h3 className="text-sm font-bold text-neutral-900 font-outfit uppercase tracking-wider">
          Registration Insights & Key Observations
        </h3>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insightText, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs leading-relaxed text-neutral-800 flex items-start space-x-2"
          >
            <span className="text-burgundy-800 font-bold font-mono text-sm shrink-0">
              #{idx + 1}
            </span>
            <div
              className="insight-html"
              dangerouslySetInnerHTML={{
                __html: insightText.replace(/\*\*(.*?)\*\*/g, '<strong className="font-semibold text-neutral-950">$1</strong>'),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
