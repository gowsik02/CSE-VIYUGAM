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
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & key statistics' },
  { id: 'participants', label: 'Participants', icon: Users, desc: 'Complete registration list' },
  { id: 'colleges', label: 'Colleges', icon: Building2, desc: 'Institutional participation' },
  { id: 'payments', label: 'Payments', icon: CreditCard, desc: 'Fee collections & status' },
  { id: 'events', label: 'Events', icon: CalendarDays, desc: 'Event-wise registration' },
  { id: 'sheet', label: 'Sheet Preview', icon: Table, desc: 'Interactive spreadsheet table' },
  { id: 'reports', label: 'Reports', icon: FileText, desc: 'Export & print summary' },
];

export default function Sidebar({ activePage, onSelectPage, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-950/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-16 left-0 z-20 h-[calc(100vh-4rem)] w-64 glass-panel border-r border-neutral-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-1">
          <div className="flex items-center justify-between p-2 md:hidden border-b border-neutral-200/80 mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-burgundy-800 text-sm font-outfit tracking-tight">CSE VIYUGAM</span>
              <span className="text-xs text-neutral-400 font-medium">Navigation</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-neutral-400 uppercase flex items-center justify-between">
            <span>Navigation Menu</span>
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-burgundy-800 to-burgundy-900 text-white shadow-md shadow-burgundy-950/20'
                      : 'text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'bg-neutral-100 text-neutral-500 group-hover:bg-burgundy-50 group-hover:text-burgundy-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="tracking-tight">{item.label}</span>
                  </div>
                  
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 text-white/80 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3.5 m-3 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100/80 border border-neutral-200/80">
          <div className="flex items-start space-x-2.5 text-[11px] text-neutral-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-neutral-800 block">Google Sheet Connected</span>
              <span className="text-[10px] text-neutral-500 block leading-tight">
                Real-time data sync active
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
