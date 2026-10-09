import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  CalendarDays,
  Table,
  FileText,
  X,
  ChevronRight,
  ShieldCheck,
  Zap,
  ExternalLink,
} from 'lucide-react';

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1T5w7Jk5-M_1SFtyXAF4LwtQoaWjO3Y6XFVeWvOfGAyU/edit?resourcekey=&gid=1175403078#gid=1175403078';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Executive overview & KPIs' },
  { id: 'participants', label: 'Participants', icon: Users, desc: 'Registration directory & verify' },
  { id: 'colleges', label: 'Colleges', icon: Building2, desc: 'Institutional leaderboard' },
  { id: 'payments', label: 'Payments', icon: CreditCard, desc: 'Revenue & fee reconciliation' },
  { id: 'events', label: 'Events', icon: CalendarDays, desc: 'Event-wise registrations' },
  { id: 'sheet', label: 'Sheet Grid', icon: Table, desc: 'Live spreadsheet view' },
  { id: 'reports', label: 'Reports', icon: FileText, desc: 'Export & printable summary' },
];

export default function Sidebar({
  activePage,
  onSelectPage,
  isOpen,
  onClose,
  pendingCount = 0,
  totalCount = 0,
}) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-16 sm:top-[4.25rem] left-0 z-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.25rem)] w-64 glass-panel border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-1 overflow-y-auto">
          {/* Mobile Header in Drawer */}
          <div className="flex items-center justify-between p-2 md:hidden border-b border-slate-200 mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-burgundy-800 text-sm font-outfit tracking-tight">CSE VIYUGAM</span>
              <span className="text-xs text-slate-400 font-medium">Navigation</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase flex items-center justify-between select-none">
            <span>Main Navigation</span>
            <Zap className="h-3 w-3 text-burgundy-800/60" />
          </div>

          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectPage(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group relative cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-burgundy-800 to-burgundy-900 text-white shadow-md shadow-burgundy-950/20'
                      : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-burgundy-50 group-hover:text-burgundy-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-left truncate">
                      <div className="tracking-tight font-bold">{item.label}</div>
                      <div
                        className={`text-[10px] font-normal leading-none mt-0.5 truncate ${
                          isActive ? 'text-rose-200' : 'text-slate-400'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 shrink-0 ml-1">
                    {item.id === 'participants' && pendingCount > 0 && !isActive && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                        {pendingCount}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-white/80 animate-pulse shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Widget: Google Sheet Connected */}
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/90 shadow-2xs">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start space-x-2 text-[11px] text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">Google Sheet Source</span>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  Real-time synchronization
                </span>
              </div>
            </div>
            <a
              href={GOOGLE_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-white transition-colors"
              title="Open Google Sheet in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
