import React, { useState } from 'react';
import { RefreshCw, Radio, Settings, Menu, Clock, CheckCircle2, FileText } from 'lucide-react';
import AutoRefreshModal from './AutoRefreshModal';

export default function Header({
  lastUpdated,
  isFetching,
  onRefresh,
  autoRefreshInterval,
  onSetAutoRefresh,
  onToggleSidebar,
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getTimeAgoString = () => {
    if (!lastUpdated) return 'Never updated';
    const seconds = Math.floor((new Date() - new Date(lastUpdated)) / 1000);
    if (seconds < 30) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Branding */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onToggleSidebar}
                className="md:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-burgundy-800 flex items-center justify-center text-white font-bold font-outfit shadow-sm">
                  <span className="text-xl">V</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-base font-bold font-outfit tracking-tight text-neutral-900 leading-none">
                      CSE VIYUGAM 2026
                    </h1>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Live Portal
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                    National Level Technical Symposium ● Event Registration & Analytics
                  </p>
                </div>
              </div>
            </div>

            {/* Right Data Status & Controls */}
            <div className="flex items-center space-x-2.5">
              
              {/* Live Status Badge */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                <span className="font-semibold">Synced with Google Sheet</span>
                <span className="text-neutral-300">|</span>
                <span className="text-neutral-600 flex items-center gap-1">
                  <Clock className="h-3 w-3 inline" /> {getTimeAgoString()}
                </span>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={onRefresh}
                disabled={isFetching}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-50 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-burgundy-800 transition-all shadow-xs disabled:opacity-60"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-burgundy-800 ${isFetching ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">{isFetching ? 'Syncing...' : 'Sync Sheet'}</span>
              </button>

              {/* Settings / Auto-Refresh Button */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none transition-all relative shadow-xs"
                title="Auto-Sync Settings"
              >
                <Settings className="h-4 w-4" />
                {autoRefreshInterval > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-burgundy-800" />
                )}
              </button>

            </div>

          </div>
        </div>
      </header>

      {isSettingsOpen && (
        <AutoRefreshModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentInterval={autoRefreshInterval}
          onSetInterval={onSetAutoRefresh}
        />
      )}
    </>
  );
}
