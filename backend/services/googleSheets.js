import { google } from 'googleapis';
import axios from 'axios';
import Papa from 'papaparse';

const DEFAULT_SPREADSHEET_ID = '1doXrCIk2H2UscjpXf6xEa3PDU6uco9KjzMWiF_vG-xc';

/**
 * Fetch data from Google Sheet using official API v4 or Public CSV Fallback
 */
export async function fetchSpreadsheetData() {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
  const apiKey = process.env.GOOGLE_API_KEY;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : null;

  let headers = [];
  let rawRows = [];
  let source = 'public_export';

  // 1. Try Google Sheets API v4 with Service Account or API Key if configured
  if ((serviceAccountEmail && privateKey) || apiKey) {
    try {
      let auth;
      if (serviceAccountEmail && privateKey) {
        auth = new google.auth.JWT({
          email: serviceAccountEmail,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
      } else {
        auth = apiKey;
      }

      const sheets = google.sheets({ version: 'v4', auth });
      const range = process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A1:Z500';

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const values = response.data.values || [];
      if (values.length > 0) {
        headers = values[0].map(h => String(h || '').trim());
        rawRows = values.slice(1);
        source = 'sheets_api_v4';
      }
    } catch (apiError) {
      console.warn('Google Sheets API v4 failed, falling back to public CSV export:', apiError.message);
    }
  }

  // 2. Fallback to public sheet CSV export endpoint
  if (rawRows.length === 0) {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
    try {
      const response = await axios.get(csvUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 10000,
      });

      const csvData = response.data;
      const parseResult = Papa.parse(csvData, {
        header: false,
        skipEmptyLines: true,
      });

      const allRows = parseResult.data || [];
      if (allRows.length > 0) {
        headers = allRows[0].map(h => String(h || '').trim());
        rawRows = allRows.slice(1);
        source = 'public_csv';
      }
    } catch (csvError) {
      throw new Error(`Failed to fetch Google Sheet data: ${csvError.message}`);
    }
  }

  // 3. Filter out completely empty rows and map headers to row objects
  const data = [];
  rawRows.forEach((row, index) => {
    // Check if row has at least one non-empty value
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
    spreadsheetId,
    source,
    lastUpdated: new Date().toISOString(),
    totalRows: data.length,
    headers,
    data,
  };
}
