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
    <div className="bg-white rounded-xl border border-neutral-300 shadow-sm flex flex-col h-[calc(100vh-140px)]">
      
      {/* Excel Sheet Control Bar */}
      <div className="p-3 bg-neutral-100 border-b border-neutral-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-emerald-700 text-white">
            <Table className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-neutral-900 font-outfit uppercase tracking-wider">
              Google Sheet Live Grid Preview
            </h2>
            <p className="text-[11px] text-neutral-500 font-mono">
              Raw Sheet Rows: {rawRows.length} | Columns: {rawHeaders.length}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Grid Search */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search raw cells..."
              className="pl-8 pr-3 py-1 text-xs border border-neutral-300 rounded bg-white text-neutral-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded border border-neutral-300 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-emerald-700 transition-colors"
          >
            <ExternalLink className="h-3 w-3 text-emerald-700" />
            <span>Open Sheet</span>
          </a>

          <button
            onClick={() => onExportCSV(rawRows, 'raw_google_sheet_export.csv')}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded border border-neutral-300 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <Download className="h-3 w-3 text-emerald-700" />
            <span>Export Raw CSV</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Grid Container (Sticky Header + Scroll) */}
      <div className="flex-1 overflow-auto bg-neutral-200 p-0 font-mono text-[11px]">
        <table className="w-full border-collapse bg-white">
          <thead className="sticky top-0 z-20 bg-neutral-200 text-neutral-700 shadow-xs">
            <tr>
              <th className="border border-neutral-300 py-1.5 px-2 w-12 text-center bg-neutral-300 font-bold text-[10px]">
                #
              </th>
              {rawHeaders.map((header, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(header)}
                  className="border border-neutral-300 py-1.5 px-3 font-semibold text-left whitespace-nowrap bg-neutral-100 hover:bg-neutral-200 cursor-pointer select-none"
                >
                  <div className="flex items-center justify-between space-x-2">
                    <span className="font-sans font-bold text-xs text-neutral-900">{header}</span>
                    <ArrowUpDown className="h-3 w-3 text-neutral-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={rawHeaders.length + 1} className="py-8 text-center text-neutral-500 font-sans">
                  No sheet cells match the search term "{searchTerm}".
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rowIdx) => {
                const actualRowNumber = row._rowIndex || (currentPage - 1) * pageSize + rowIdx + 1;
                return (
                  <tr key={rowIdx} className="hover:bg-amber-50/50 transition-colors">
                    <td className="border border-neutral-300 py-1 px-2 text-center bg-neutral-100 font-bold text-[10px] text-neutral-500 select-none">
                      {actualRowNumber}
                    </td>
                    {rawHeaders.map((header, colIdx) => (
                      <td
                        key={colIdx}
                        className="border border-neutral-200 py-1.5 px-3 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis text-neutral-800"
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
      <div className="p-2.5 bg-neutral-100 border-t border-neutral-300 flex items-center justify-between text-xs text-neutral-600 shrink-0 font-sans">
        <div>
          Showing rows <strong className="text-neutral-900">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
          <strong className="text-neutral-900">{Math.min(currentPage * pageSize, sortedRows.length)}</strong> of{' '}
          {sortedRows.length}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-neutral-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
