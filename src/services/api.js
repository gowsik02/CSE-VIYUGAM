import axios from 'axios';
import Papa from 'papaparse';

const BACKEND_URL = '/api/registrations';
const DEFAULT_SPREADSHEET_ID = '1doXrCIk2H2UscjpXf6xEa3PDU6uco9KjzMWiF_vG-xc';

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
  const csvUrl = `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/export?format=csv`;
  try {
    const csvResponse = await axios.get(csvUrl, { timeout: 10000 });
    const parseResult = Papa.parse(csvResponse.data, {
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
    throw new Error(`Unable to fetch spreadsheet data. Please check the Google Sheets connection. (${directError.message})`);
  }
}
