import axios from 'axios';
import Papa from 'papaparse';

const BACKEND_URL = '/api/registrations';
const DEFAULT_SPREADSHEET_ID = '1T5w7Jk5-M_1SFtyXAF4LwtQoaWjO3Y6XFVeWvOfGAyU';
const DEFAULT_SHEET_GID = '1175403078';

/**
 * Fetch registrations from Express backend, with automatic direct fetch fallback
 */
export async function getRegistrations() {
  try {
    // 1. Primary: Call Express backend API
    const response = await axios.get(BACKEND_URL, { timeout: 8000 });
    if (response.data && response.data.success) {
      return response.data;
    }
  } catch (backendError) {
    console.warn('Backend API request failed or timed out, trying direct public Google Sheet fetch:', backendError.message);
  }

  // 2. Direct fallback: Fetch public Google Sheet CSV directly from browser
  const csvUrl = DEFAULT_SHEET_GID
    ? `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/export?format=csv&gid=${DEFAULT_SHEET_GID}`
    : `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/export?format=csv`;

  try {
    let csvData;
    try {
      const csvResponse = await axios.get(csvUrl, { timeout: 10000 });
      csvData = csvResponse.data;
    } catch (exportErr) {
      const gvizUrl = DEFAULT_SHEET_GID
        ? `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${DEFAULT_SHEET_GID}`
        : `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;
      const gvizRes = await axios.get(gvizUrl, { timeout: 10000 });
      csvData = gvizRes.data;
    }

    if (typeof csvData === 'string' && csvData.includes('<!DOCTYPE html>')) {
      throw new Error('Google Sheet is restricted. Please enable "Anyone with the link can view" in Google Sheets Share settings.');
    }

    const parseResult = Papa.parse(csvData, {
      header: false,
      skipEmptyLines: true,
    });

    const allRows = parseResult.data || [];
    if (allRows.length === 0) {
      throw new Error('Spreadsheet returned empty dataset');
    }

    const headers = allRows[0].map(h => String(h || '').trim());
    const rawRows = allRows.slice(1);

    const data = [];
    rawRows.forEach((row, index) => {
      const hasValue = row.some(val => String(val || '').trim().length > 0);
      if (!hasValue) return;

      const rowObj = { _rowIndex: index + 1 };
      headers.forEach((header, colIdx) => {
        const fieldKey = header || `Column_${colIdx + 1}`;
        rowObj[fieldKey] = row[colIdx] !== undefined ? String(row[colIdx]).trim() : '';
      });

      data.push(rowObj);
    });

    return {
      success: true,
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      source: 'direct_browser_fallback',
      lastUpdated: new Date().toISOString(),
      totalRows: data.length,
      headers,
      data,
    };
  } catch (directError) {
    throw new Error(`Unable to fetch spreadsheet data. Please check the Google Sheets connection or verify sharing permissions. (${directError.message})`);
  }
}
