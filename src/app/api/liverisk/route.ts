// src/app/api/livesdr/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    // Ensure environment variables are set
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!clientEmail || !privateKey) {
      throw new Error('Missing Google Sheets API credentials');
    }

    // Authenticate with Google Sheets API using service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        // replace literal “\n” with real newlines in the private key
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1ujlMsVrMTKDE4lZe3FZIKbETZ_r_2C13bQkOCYet8qc';
    const range = 'Sheet1!A1:S';

    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    // Turn each row into a typed object
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const rowData: Record<string, string> = {};
      headers.forEach((h, i) => {
        rowData[h] = row[i] ?? '';
      });
      return {
        Ticker: rowData['Ticker'],
        CompanyName: rowData['Company Name'],
        LivePrice: parseFloat(rowData['Live Price']) || 0,
        Quantity: parseInt(rowData['Quantity']) || 0,
        LongShort: rowData['Long/Short'],
        PositionSize: parseFloat(rowData['Position Size ($)']) || 0,
        PnL: parseFloat(rowData['PnL ($)']) || 0,
        PnLPercent: parseFloat(rowData['PnL (%)']) || 0,
        EntryPrice: parseFloat(rowData['Entry Price']) || 0,
        VolatilityDaily: parseFloat(rowData['Volatility (Daily)']) || 0,
        VaR: parseFloat(rowData['VaR ($)']) || 0,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Google Sheet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
