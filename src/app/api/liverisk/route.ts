// src/app/api/sheet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 1) Validate env vars
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey  = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!clientEmail || !privateKey) {
      throw new Error('Missing Google Sheets API credentials');
    }

    // 2) Auth with service account
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // 3) Fetch the sheet
    const spreadsheetId = '1ujlMsVrMTKDE4lZe3FZIKbETZ_r_2C13bQkOCYet8qc';
    const range         = 'Sheet1!A1:S';
    const resp          = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows          = resp.data.values || [];

    if (rows.length < 2) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    // 4) Map into objects
    const headers = rows[0];
    const data = rows.slice(1).map((row: string[]) => {
      // build a string→string map so ESLint won't complain
      const rowData: Record<string, string> = {};
      headers.forEach((h, i) => {
        rowData[h] = row[i] ?? '';
      });

      return {
        Ticker:          rowData['Ticker'],
        CompanyName:     rowData['Company Name'],
        LivePrice:       parseFloat(rowData['Live Price']),
        Quantity:        parseInt(rowData['Quantity'], 10),
        LongShort:       rowData['Long/Short'],
        PositionSize:    parseFloat(rowData['Position Size ($)']),
        PnL:             parseFloat(rowData['PnL ($)']),
        PnLPercent:      parseFloat(rowData['PnL (%)']),
        EntryPrice:      parseFloat(rowData['Entry Price']),
        VolatilityDaily: parseFloat(rowData['Volatility (Daily)']),
        VaR:             parseFloat(rowData['VaR ($)']),
      };
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching Google Sheet:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
