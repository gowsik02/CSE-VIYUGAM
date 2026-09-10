import express from 'express';
import { fetchSpreadsheetData } from '../services/googleSheets.js';

const router = express.Router();

// GET /api/registrations
router.get('/registrations', async (req, res) => {
  try {
    const result = await fetchSpreadsheetData();
    res.json(result);
  } catch (error) {
    console.error('Error fetching registrations:', error.message);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch spreadsheet data. Please check the Google Sheets connection.',
      details: error.message,
    });
  }
});

export default router;
