import React, { useState, useMemo } from 'react';
import { Table, Search, ArrowUpDown, Download, Filter, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1T5w7Jk5-M_1SFtyXAF4LwtQoaWjO3Y6XFVeWvOfGAyU/edit?resourcekey=&gid=1175403078#gid=1175403078';

export default function SheetPreview({ rawHeaders = [], rawRows = [], onExportCSV }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rawRows;
    const term = searchTerm.toLowerCase();
    return rawRows.filter((row) => {
      return Object.values(row).some((val) =>
        String(val || '').toLowerCase().includes(term)
      );
    });
  }, [rawRows, searchTerm]);

  const sortedRows = useMemo(() => {
    if (!sortCol) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      let valA = a[sortCol] || '';
      let valB = b[sortCol] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortCol, sortAsc]);

  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage]);

  const handleSort = (header) => {
    if (sortCol === header) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(header);
      setSortAsc(true);
    }
  };

  return (
    <div className="card-elevated rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] bg-white border border-slate-200">
      
      {/* Excel Sheet Control Bar */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-2xs">
            <Table className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
              Google Sheet Live Grid View
            </h2>
            <p className="text-[11px] text-slate-500 font-mono">
              Raw Sheet Records: {rawRows.length} | Active Columns: {rawHeaders.length}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Grid Search */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search raw cells..."
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <ExternalLink className="h-3 w-3 text-emerald-700" />
            <span>Open Sheet</span>
          </a>

          <button
            onClick={() => onExportCSV(rawRows, 'raw_google_sheet_export.csv')}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="h-3 w-3 text-emerald-700" />
            <span>Export Raw CSV</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Grid Container (Sticky Header + Scroll) */}
      <div className="flex-1 overflow-auto bg-slate-100 p-0 font-mono text-[11px]">
        <table className="w-full border-collapse bg-white">
          <thead className="sticky top-0 z-20 bg-slate-100 text-slate-700 shadow-2xs">
            <tr>
              <th className="border border-slate-200 py-2 px-2.5 w-12 text-center bg-slate-200 font-bold text-[10px] text-slate-600">
                #
              </th>
              {rawHeaders.map((header, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(header)}
                  className="border border-slate-200 py-2 px-3.5 font-semibold text-left whitespace-nowrap bg-slate-100 hover:bg-slate-200 cursor-pointer select-none"
                >
                  <div className="flex items-center justify-between space-x-2">
                    <span className="font-sans font-bold text-xs text-slate-900">{header}</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={rawHeaders.length + 1} className="py-12 text-center text-slate-500 font-sans font-medium">
                  No sheet cells match "{searchTerm}".
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rowIdx) => {
                const actualRowNumber = row._rowIndex || (currentPage - 1) * pageSize + rowIdx + 1;
                return (
                  <tr key={rowIdx} className="hover:bg-amber-50/60 transition-colors">
                    <td className="border border-slate-200 py-1.5 px-2.5 text-center bg-slate-50 font-bold text-[10px] text-slate-500 select-none">
                      {actualRowNumber}
                    </td>
                    {rawHeaders.map((header, colIdx) => (
                      <td
                        key={colIdx}
                        className="border border-slate-200 py-2 px-3 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis text-slate-800"
                        title={String(row[header] || '')}
                      >
                        {String(row[header] || '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Spreadsheet Footer Pagination */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0 font-sans">
        <div>
          Showing rows <strong className="text-slate-900 font-bold">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
          <strong className="text-slate-900 font-bold">{Math.min(currentPage * pageSize, sortedRows.length)}</strong> of{' '}
          <strong className="text-slate-900 font-bold">{sortedRows.length}</strong>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-slate-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
