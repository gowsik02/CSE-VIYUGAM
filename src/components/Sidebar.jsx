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
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-neutral-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center justify-between p-4 md:hidden border-b border-neutral-200">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-burgundy-800 text-sm font-outfit">CSE VIYUGAM</span>
              <span className="text-xs text-neutral-400">Navigation</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1 mt-2">
            <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Main Menu
            </div>

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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-burgundy-800 text-white font-semibold shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-burgundy-800'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/70" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50">
          <div className="flex items-center space-x-2 text-[11px] text-neutral-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="leading-tight">
              Google Sheet Connected & Dynamic Engine Active
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
