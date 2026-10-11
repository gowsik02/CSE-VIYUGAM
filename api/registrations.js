import axios from 'axios';
import Papa from 'papaparse';

const DEFAULT_SPREADSHEET_ID = '1T5w7Jk5-M_1SFtyXAF4LwtQoaWjO3Y6XFVeWvOfGAyU';
const DEFAULT_SHEET_GID = '1175403078';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
  const sheetGid = process.env.GOOGLE_SHEET_GID || DEFAULT_SHEET_GID;

  const csvUrl = sheetGid
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetGid}`
    : `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;

  try {
    let csvData;
    try {
      const response = await axios.get(csvUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 10000,
      });
      csvData = response.data;
    } catch (exportErr) {
      const gvizUrl = sheetGid
        ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${sheetGid}`
        : `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv`;
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
      return res.status(200).json({
        success: true,
        spreadsheetId,
        source: 'vercel_serverless',
        lastUpdated: new Date().toISOString(),
        totalRows: 0,
        headers: [],
        data: [],
      });
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

    return res.status(200).json({
      success: true,
      spreadsheetId,
      source: 'vercel_serverless',
      lastUpdated: new Date().toISOString(),
      totalRows: data.length,
      headers,
      data,
    });
  } catch (err) {
    console.error('Error fetching Google Sheets data:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch spreadsheet data.',
      details: err.message,
    });
  }
}
