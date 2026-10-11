import React, { useState } from 'react';
import { RefreshCw, Radio, Settings, Menu, Clock, ExternalLink, Sparkles, Database } from 'lucide-react';
import AutoRefreshModal from './AutoRefreshModal';

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1T5w7Jk5-M_1SFtyXAF4LwtQoaWjO3Y6XFVeWvOfGAyU/edit?resourcekey=&gid=1175403078#gid=1175403078';

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
    if (!lastUpdated) return 'Never synced';
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
      <header className="sticky top-0 z-30 glass-header shadow-2xs transition-all">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-16 sm:h-[4.25rem]">
            
            {/* Left Section: Branding & Symposium Badge */}
            <div className="flex items-center space-x-3.5">
              <button
                type="button"
                onClick={onToggleSidebar}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 focus:outline-none transition-colors"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3 group cursor-pointer select-none">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-burgundy-700 via-burgundy-800 to-burgundy-950 flex items-center justify-center text-white font-bold font-outfit shadow-md shadow-burgundy-950/20 group-hover:scale-105 transition-transform duration-200 border border-burgundy-600/30">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-wider">V</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-base sm:text-lg font-extrabold font-outfit tracking-tight text-slate-900 leading-none">
                      CSE VIYUGAM 2026
                    </h1>
                    <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold badge-glow-emerald tracking-wide">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>LIVE PORTAL</span>
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                    <span className="font-semibold text-burgundy-800">National Technical Symposium</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">Executive Dashboard</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section: Sync Controls & Links */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Google Sheet Direct Link */}
              <a
                href={GOOGLE_SHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/90 text-xs font-semibold text-slate-700 transition-all shadow-2xs hover:border-slate-300"
                title="Open Google Sheet Source of Truth"
              >
                <Database className="h-3.5 w-3.5 text-emerald-600" />
                <span>Google Sheet</span>
                <ExternalLink className="h-3 w-3 text-slate-400 ml-0.5" />
              </a>

              {/* Live Status Badge */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-xs text-emerald-900 font-semibold shadow-2xs">
                <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                <span className="font-bold">Synced</span>
                <span className="text-emerald-300">|</span>
                <span className="text-slate-600 font-medium text-[11px] flex items-center gap-1">
                  <Clock className="h-3 w-3 inline text-emerald-700" /> {getTimeAgoString()}
                </span>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={onRefresh}
                disabled={isFetching}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 sm:py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 active:scale-[0.98] transition-all shadow-xs disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-burgundy-800 ${isFetching ? 'animate-spin' : ''}`} />
                <span>{isFetching ? 'Syncing...' : 'Sync Data'}</span>
              </button>

              {/* Auto-Refresh Settings */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus:outline-none transition-all relative shadow-xs cursor-pointer"
                title="Auto-Sync Settings"
                aria-label="Auto-Sync Settings"
              >
                <Settings className="h-4 w-4 text-slate-600" />
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
