import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Ensure environment variables are set
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Missing Google Sheets API credentials');
    }

    // Authenticate with Google Sheets API using service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1ujlMsVrMTKDE4lZe3FZIKbETZ_r_2C13bQkOCYet8qc';
    const range = 'Sheet1!A1:S';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    // Map the rows to objects based on the header row
    const headers = rows[0];
    const data = rows.slice(1).map((row: string[]) => {
      const rowData: { [key: string]: any } = {};
      headers.forEach((header: string, index: number) => {
        rowData[header] = row[index] || '';
      });
      return {
        Ticker: rowData['Ticker'] || '',
        CompanyName: rowData['Company Name'] || '',
        LivePrice: parseFloat(rowData['Live Price']) || 0,
        Quantity: parseInt(rowData['Quantity']) || 0,
        LongShort: rowData['Long/Short'] || '',
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
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}