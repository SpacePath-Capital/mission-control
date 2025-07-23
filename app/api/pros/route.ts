import { google } from 'googleapis';
import { NextResponse } from 'next/server';

interface PositionRow {
  Ticker: string;
  CompanyName: string;
  LivePrice: number;
  Quantity: number;
  LongShort: string;
  PositionSize: number;
  PnL: number;
  PnLPercent: number;
  EntryPrice: number;
  VolatilityDaily: number;
  VaR: number;
}

export async function GET() {
  try {
    const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_KEY_BASE64 || '', 'base64').toString());
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID || '1ujlMsVrMTKDE4lZe3FZIKbETZ_r_2C13bQkOCYet8qc'; // Use env or fallback
    const range = 'Sheet1!A1:S';
    console.log('Credentials parsed:', credentials);
    console.log('Fetching from:', spreadsheetId);
    console.log('Range:', range);
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = response.data.values;

    if (!rows || rows.length < 2) {
      return NextResponse.json({ error: 'No data found in sheet' }, { status: 404 });
    }

    const headers = rows[0];
    const data: PositionRow[] = rows.slice(1).map((row) => {
      const rowMap: Record<string, string> = {};
      headers.forEach((h, i) => {
        rowMap[h] = row[i] ?? '';
      });

      return {
        Ticker: rowMap['Ticker'] || '',
        CompanyName: rowMap['Company Name'] || '',
        LivePrice: parseFloat(rowMap['Live Price']) || 0,
        Quantity: parseInt(rowMap['Quantity'], 10) || 0,
        LongShort: rowMap['Long/Short'] || '',
        PositionSize: parseFloat(rowMap['Position Size ($)']) || 0,
        PnL: parseFloat(rowMap['PnL ($)']) || 0,
        PnLPercent: parseFloat(rowMap['PnL (%)']) || 0,
        EntryPrice: parseFloat(rowMap['Entry Price']) || 0,
        VolatilityDaily: parseFloat(rowMap['Volatility (Daily)']) || 0,
        VaR: parseFloat(rowMap['VaR ($)']) || 0,
      };
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error('Sheets API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch or parse sheet data' }, { status: 500 });
  }
}