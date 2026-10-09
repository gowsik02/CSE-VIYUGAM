import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FilterPanel from './components/FilterPanel';
import ParticipantDetailModal from './components/ParticipantDetailModal';

import Dashboard from './pages/Dashboard';
import Participants from './pages/Participants';
import Colleges from './pages/Colleges';
import Payments from './pages/Payments';
import Events from './pages/Events';
import SheetPreview from './pages/SheetPreview';
import Reports from './pages/Reports';

import { getRegistrations } from './services/api';
import { normalizeRegistrationData } from './utils/dataNormalizer';
import { getVerificationState, toggleVerificationStatus } from './utils/verificationStorage';
import { RefreshCw, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import Papa from 'papaparse';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [participantsTab, setParticipantsTab] = useState('new');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Verification State (verified & unverified key sets) in local storage
  const [verificationState, setVerificationState] = useState(() => getVerificationState());

  // Raw API Data
  const [rawHeaders, setRawHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Normalized Data
  const [normalizedData, setNormalizedData] = useState([]);

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Auto Refresh Interval (ms, 0 = Off)
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0);

  // Selected participant for detail modal
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // Navigation Handler with Tab Support
  const handleNavigate = (page, tab = null) => {
    setActivePage(page);
    if (tab) {
      setParticipantsTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump to Directory filtered by specific college
  const handleViewCollegeInDirectory = (collegeName) => {
    setSelectedCollege(collegeName);
    setActivePage('participants');
    setParticipantsTab('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch Data Function
  const fetchData = useCallback(async (showToast = true) => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await getRegistrations();
      if (res && res.data) {
        setRawHeaders(res.headers || []);
        setRawRows(res.data || []);
        setLastUpdated(res.lastUpdated || new Date().toISOString());

        const currentVerificationState = getVerificationState();
        const normalized = normalizeRegistrationData(res.data, res.headers, currentVerificationState);
        setNormalizedData(normalized.normalizedData);

        if (showToast) {
          showNotification('Registration records synced with Google Sheets');
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Unable to fetch spreadsheet data. Please check the Google Sheets connection.');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Persistent Toggle Verification Handler
  const handleToggleVerify = (participantOrId) => {
    let targetParticipant = typeof participantOrId === 'object' ? participantOrId : normalizedData.find(d => d.id === participantOrId);
    if (!targetParticipant) return;

    const updatedState = toggleVerificationStatus(targetParticipant);
    setVerificationState(updatedState);

    // Re-normalize dataset with updated local storage state
    const reNormalized = normalizeRegistrationData(rawRows, rawHeaders, updatedState);
    setNormalizedData(reNormalized.normalizedData);

    if (selectedParticipant && selectedParticipant.id === targetParticipant.id) {
      const updatedModalPart = reNormalized.normalizedData.find(d => d.id === targetParticipant.id);
      if (updatedModalPart) {
        setSelectedParticipant(updatedModalPart);
      }
    }

    const isNowVerified = reNormalized.normalizedData.find(d => d.id === targetParticipant.id)?.isVerified;
    showNotification(isNowVerified ? 'Registration marked as Verified' : 'Registration moved to New / Pending');
  };

  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      fetchData(true);
    }, autoRefreshInterval);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchData]);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const pendingCount = useMemo(() => normalizedData.filter(d => !d.isVerified).length, [normalizedData]);

  const collegesList = useMemo(() => {
    const set = new Set(normalizedData.map(d => d.college).filter(Boolean));
    return Array.from(set).sort();
  }, [normalizedData]);

  const eventsList = useMemo(() => {
    const set = new Set();
    normalizedData.forEach(d => {
      if (Array.isArray(d.events)) {
        d.events.forEach(e => set.add(e));
      }
    });
    return Array.from(set).sort();
  }, [normalizedData]);

  const deptsList = useMemo(() => {
    const set = new Set(normalizedData.map(d => d.department).filter(Boolean));
    return Array.from(set).sort();
  }, [normalizedData]);

  const yearsList = useMemo(() => {
    const set = new Set(normalizedData.map(d => d.year).filter(Boolean));
    return Array.from(set).sort();
  }, [normalizedData]);

  const filteredData = useMemo(() => {
    return normalizedData.filter(item => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(term);
        const matchesCollege = item.college.toLowerCase().includes(term);
        const matchesEmail = item.email.toLowerCase().includes(term);
        const matchesPhone = item.phone.toLowerCase().includes(term);
        const matchesTxn = item.transactionId.toLowerCase().includes(term);
        const matchesEvents = item.events.some(e => e.toLowerCase().includes(term));

        if (!matchesName && !matchesCollege && !matchesEmail && !matchesPhone && !matchesTxn && !matchesEvents) {
          return false;
        }
      }

      if (selectedCollege !== 'All' && item.college !== selectedCollege) return false;

      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Paid' || selectedStatus === 'Verified') {
          if (!item.isVerified) return false;
        } else if (selectedStatus === 'Pending' || selectedStatus === 'New') {
          if (item.isVerified) return false;
        }
      }

      if (selectedEvent !== 'All' && (!item.events || !item.events.includes(selectedEvent))) return false;
      if (selectedDept !== 'All' && item.department !== selectedDept) return false;
      if (selectedYear !== 'All' && item.year !== selectedYear) return false;

      return true;
    });
  }, [
    normalizedData,
    searchTerm,
    selectedCollege,
    selectedStatus,
    selectedEvent,
    selectedDept,
    selectedYear,
  ]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCollege('All');
    setSelectedStatus('All');
    setSelectedEvent('All');
    setSelectedDept('All');
    setSelectedYear('All');
  };

  const handleExportCSV = (exportArray, filename = 'cse_viyugam_export.csv') => {
    if (!exportArray || exportArray.length === 0) return;
    const csvStr = Papa.unparse(exportArray);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-mesh-pattern flex flex-col font-sans selection:bg-burgundy-100 selection:text-burgundy-900">
      
      <Header
        lastUpdated={lastUpdated}
        isFetching={isFetching}
        onRefresh={() => fetchData(true)}
        autoRefreshInterval={autoRefreshInterval}
        onSetAutoRefresh={setAutoRefreshInterval}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-modal flex items-center space-x-2.5 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 flex w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 gap-6">
        
        <Sidebar
          activePage={activePage}
          onSelectPage={(page) => handleNavigate(page)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          pendingCount={pendingCount}
          totalCount={normalizedData.length}
        />

        <main className="flex-1 min-w-0 pb-12">
          
          {activePage !== 'sheet' && (
            <FilterPanel
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCollege={selectedCollege}
              onCollegeChange={setSelectedCollege}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedEvent={selectedEvent}
              onEventChange={setSelectedEvent}
              selectedDept={selectedDept}
              onDeptChange={setSelectedDept}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              collegesList={collegesList}
              eventsList={eventsList}
              deptsList={deptsList}
              yearsList={yearsList}
              onResetFilters={handleResetFilters}
              totalFilteredCount={filteredData.length}
              totalRawCount={normalizedData.length}
              allParticipants={normalizedData}
              onSelectParticipant={setSelectedParticipant}
            />
          )}

          {isLoading && (
            <div className="card-elevated rounded-3xl p-16 text-center">
              <div className="h-14 w-14 rounded-2xl bg-burgundy-50 border border-burgundy-100 flex items-center justify-center mx-auto mb-4 text-burgundy-800 shadow-sm">
                <RefreshCw className="h-7 w-7 animate-spin" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 font-outfit">
                CSE VIYUGAM 2026 — Connecting to Google Sheets...
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
                Fetching latest attendee submissions, verifying receipts, and building live analytics dashboard...
              </p>
            </div>
          )}

          {!isLoading && error && (
            <div className="card-elevated rounded-3xl p-6 bg-rose-50/90 border-rose-200 text-rose-950 mb-6 flex items-start space-x-3.5">
              <AlertCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-extrabold font-outfit text-rose-950 uppercase tracking-wider">
                  Spreadsheet Connectivity Notice
                </h3>
                <p className="text-xs text-rose-800 mt-1 font-medium leading-relaxed">{error}</p>
                <button
                  onClick={() => fetchData(true)}
                  className="mt-3 px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  Retry Synchronization
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {activePage === 'dashboard' && (
                <Dashboard
                  data={filteredData}
                  onSelectParticipant={setSelectedParticipant}
                  onNavigate={handleNavigate}
                  onToggleVerify={handleToggleVerify}
                />
              )}

              {activePage === 'participants' && (
                <Participants
                  data={filteredData}
                  initialTab={participantsTab}
                  onSelectParticipant={setSelectedParticipant}
                  onToggleVerify={handleToggleVerify}
                  onExportCSV={handleExportCSV}
                />
              )}

              {activePage === 'colleges' && (
                <Colleges
                  data={filteredData}
                  onExportCSV={handleExportCSV}
                  onToggleVerify={handleToggleVerify}
                  onViewInDirectory={handleViewCollegeInDirectory}
                />
              )}

              {activePage === 'payments' && (
                <Payments
                  data={filteredData}
                  onExportCSV={handleExportCSV}
                  onToggleVerify={handleToggleVerify}
                />
              )}

              {activePage === 'events' && (
                <Events
                  data={filteredData}
                  onExportCSV={handleExportCSV}
                  onSelectParticipant={setSelectedParticipant}
                  onToggleVerify={handleToggleVerify}
                />
              )}

              {activePage === 'sheet' && (
                <SheetPreview
                  rawHeaders={rawHeaders}
                  rawRows={rawRows}
                  onExportCSV={handleExportCSV}
                />
              )}

              {activePage === 'reports' && (
                <Reports
                  data={filteredData}
                  lastUpdated={lastUpdated}
                  onExportCSV={handleExportCSV}
                />
              )}
            </>
          )}

        </main>
      </div>

      {selectedParticipant && (
        <ParticipantDetailModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          onToggleVerify={handleToggleVerify}
        />
      )}

    </div>
  );
}
