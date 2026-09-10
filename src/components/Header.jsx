import React, { useState } from 'react';
import { RefreshCw, Radio, Settings, Menu, Clock, Sparkles } from 'lucide-react';
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
      <header className="sticky top-0 z-30 glass-header shadow-xs">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Branding */}
            <div className="flex items-center space-x-3.5">
              <button
                type="button"
                onClick={onToggleSidebar}
                className="md:hidden p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 focus:outline-none transition-colors"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-burgundy-700 via-burgundy-800 to-burgundy-950 flex items-center justify-center text-white font-bold font-outfit shadow-md shadow-burgundy-900/20 group-hover:scale-105 transition-transform duration-200 border border-burgundy-600/30">
                  <span className="text-xl tracking-wider">V</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h1 className="text-base font-extrabold font-outfit tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-800 bg-clip-text text-transparent leading-none">
                      CSE VIYUGAM 2026
                    </h1>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold badge-glow-emerald">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>LIVE PORTAL</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5 flex items-center gap-1.5">
                    <span>National Level Technical Symposium</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-neutral-600">Analytics Hub</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2.5">
              
              {/* Live Status Badge */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 font-semibold shadow-2xs">
                <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                <span>Synced with Google Sheet</span>
                <span className="text-emerald-300">|</span>
                <span className="text-neutral-500 font-medium text-[11px] flex items-center gap-1">
                  <Clock className="h-3 w-3 inline text-emerald-600" /> {getTimeAgoString()}
                </span>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={onRefresh}
                disabled={isFetching}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 border border-neutral-200/90 rounded-xl text-xs font-bold text-neutral-800 bg-white/90 hover:bg-neutral-50 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 active:scale-[0.98] transition-all shadow-xs disabled:opacity-60"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-burgundy-800 ${isFetching ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">{isFetching ? 'Syncing...' : 'Sync Data'}</span>
              </button>

              {/* Auto-Refresh Settings */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-xl border border-neutral-200/90 text-neutral-700 bg-white/90 hover:bg-neutral-50 hover:border-neutral-300 focus:outline-none transition-all relative shadow-xs"
                title="Auto-Sync Settings"
              >
                <Settings className="h-4 w-4 text-neutral-600" />
                {autoRefreshInterval > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-burgundy-800 ring-2 ring-white animate-pulse" />
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
