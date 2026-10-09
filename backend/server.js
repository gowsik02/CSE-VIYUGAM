import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sheetsRouter from './routes/sheets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', sheetsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 CSE VIYUGAM Backend Server running on port ${PORT}`);
  console.log(` Spreadsheet ID: ${process.env.GOOGLE_SPREADSHEET_ID || '1T5w7Jk5-M_1SFtyXAF4LwtQoaWjO3Y6XFVeWvOfGAyU'}`);
});
