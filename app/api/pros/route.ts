import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface PositionRow {
  Ticker?: string;
  CompanyName?: string;
  LivePrice?: number;
  Quantity?: number;
  LongShort?: string;
  PositionSize?: number;
  PnL?: number;
  PnLPercent?: number;
  EntryPrice?: number;
  VolatilityDaily?: number;
  VaR?: number;
  // Add other fields as needed based on your sheets
}

const validSheets = {
  pros: 'PROS 0.0',
  snapshot: 'Snapshot',
  portfolio: 'Portfolio',
  watchlist: 'Watchlist',
  beta: 'Beta',
  tradehistory: 'TradeHistory',
  longdata: 'LongData',
  shortdata: 'ShortData',
  watchlistdata: 'WatchlistData',
};

const defaultSheet = 'portfolio'; // Lowercase to match key

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sheetParam = url.searchParams.get('sheet')?.toLowerCase() || defaultSheet;
  const sheetName = validSheets[sheetParam as keyof typeof validSheets] || validSheets.portfolio;

  try {
    const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_KEY_BASE64 || '', 'base64').toString());
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID || '1neHsYuOVGDUjY6M2UWehoHAM1qaI0h1x0kNWnKi2rvM';
    const range = `${sheetName}!A1:Z`; // Dynamic range based on sheet name

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = response.data.values;

    if (!rows || rows.length < 2) {
      return NextResponse.json({ error: 'No data found in sheet' }, { status: 404 });
    }

    const headers = rows[0];
    const data: PositionRow[] = rows.slice(1).map((row: string[]) => {
      const rowMap: Record<string, string> = {};
      headers.forEach((h, i) => {
        rowMap[h] = row[i] ?? '';
      });

      return {
        Ticker: rowMap['Ticker'] || rowMap['Status'] || '',
        CompanyName: rowMap['Company'] || rowMap['Company Name'] || '',
        LivePrice: parseFloat(rowMap['Live Price']) || parseFloat(rowMap['Latest Price']) || 0,
        Quantity: parseInt(rowMap['Quantity'], 10) || 0,
        LongShort: rowMap['Long or Short'] || rowMap['Long/Short'] || '',
        PositionSize: parseFloat(rowMap['Position Size']) || parseFloat(rowMap['Position Size ($)']) || 0,
        PnL: parseFloat(rowMap['PnL ($)']) || parseFloat(rowMap['Daily PnL ($)']) || 0,
        PnLPercent: parseFloat(rowMap['PnL (%)']) || parseFloat(rowMap['Daily PnL (%)']) || 0,
        EntryPrice: parseFloat(rowMap['Average Cost']) || parseFloat(rowMap['Entry Price']) || 0,
        VolatilityDaily: parseFloat(rowMap['Volatility (Daily)']) || 0,
        VaR: parseFloat(rowMap['VaR ($)']) || parseFloat(rowMap['Relative VaR']) || 0,
      };
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch or parse sheet data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, portfolioType, trade } = body;

    const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_KEY_BASE64 || '', 'base64').toString());
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID || '1neHsYuOVGDUjY6M2UWehoHAM1qaI0h1x0kNWnKi2rvM';

    // Helper function to get sheetId by name
    const getSheetId = async (sheetName: string): Promise<number | null> => {
      const res = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'sheets(properties(sheetId,title))',
      });
      const sheet = res.data.sheets?.find(s => s.properties?.title === sheetName);
      return sheet?.properties?.sheetId ?? null;
    };

    if (action === 'addTrade') {
      const dataSheetName = portfolioType === 'Long' ? 'LongData' : portfolioType === 'Short' ? 'ShortData' : portfolioType === 'Watchlist' ? 'WatchlistData' : 'TradeHistory';
      const sheetName = validSheets[dataSheetName.toLowerCase() as keyof typeof validSheets] || dataSheetName;

      const priceQuantity = trade.quantity * trade.price;
      const dateQuantity = (new Date().getTime() / (1000 * 60 * 60 * 24) * trade.quantity);
      const longShortTag = portfolioType === 'Watchlist' ? trade.longShort : portfolioType;
      const tradeType = portfolioType === 'Long' ? (trade.quantity > 0 ? 'Buy' : 'Sell') : portfolioType === 'Short' ? (trade.quantity > 0 ? 'Buy-to-Cover' : 'Sell') : '';

      const rowData = portfolioType === 'Watchlist' ? [
        trade.ticker,
        longShortTag,
        trade.upsidePrice,
        trade.downsidePrice,
        trade.subsector,
        trade.thesis,
        trade.notes,
        trade.pm,
        trade.strategy,
      ] : [
        trade.ticker,
        longShortTag,
        trade.quantity,
        trade.price,
        trade.entryDate,
        trade.strategy,
        trade.thesis,
        trade.notes,
        trade.pm,
        trade.subsector,
        priceQuantity,
        dateQuantity,
        trade.upsidePrice,
        trade.downsidePrice,
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowData],
        },
      });

      if (portfolioType === 'Long' || portfolioType === 'Short') {
        const historyRow = [
          trade.ticker,
          longShortTag,
          tradeType,
          trade.quantity,
          trade.price,
          trade.entryDate,
          trade.pm,
          priceQuantity,
          0, // Realized PnL placeholder
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'TradeHistory!A1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [historyRow],
          },
        });

        // Remove from Watchlist
        const watchlistResponse = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'WatchlistData!A:A',
        });
        const watchlistRows = watchlistResponse.data.values || [];
        const watchlistIndex = watchlistRows.findIndex(row => row[0] === trade.ticker);
        if (watchlistIndex !== -1) {
          const watchlistSheetId = await getSheetId('WatchlistData');
          if (watchlistSheetId === null) {
            throw new Error('WatchlistData sheet not found');
          }
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [{
                deleteRange: {
                  range: {
                    sheetId: watchlistSheetId,
                    startRowIndex: watchlistIndex,
                    endRowIndex: watchlistIndex + 1,
                  },
                  shiftDimension: 'ROWS',
                },
              }],
            },
          });
        }
      }

      return NextResponse.json({ success: true });
    } else if (action === 'removeTrade') {
      const dataSheetName = portfolioType === 'Long' ? 'LongData' : portfolioType === 'Short' ? 'ShortData' : 'WatchlistData';
      const sheetName = validSheets[dataSheetName.toLowerCase() as keyof typeof validSheets] || dataSheetName;

      const dataResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1:C`,
      });
      const dataRows = dataResponse.data.values || [];
      let totalQuantity = 0;
      dataRows.forEach(row => {
        if (row[0] === trade.ticker) {
          totalQuantity += parseFloat(row[2]);
        }
      });

      if (Math.abs(trade.quantity) > Math.abs(totalQuantity)) {
        return NextResponse.json({ error: 'Cannot remove more shares than held' }, { status: 400 });
      }

      const priceQuantity = trade.quantity * trade.price;
      const dateQuantity = (new Date().getTime() / (1000 * 60 * 60 * 24) * trade.quantity);

      const rowData = [
        trade.ticker,
        portfolioType,
        trade.quantity,
        trade.price,
        trade.exitDate,
        trade.strategy,
        trade.thesis,
        trade.notes,
        trade.pm,
        trade.subsector,
        priceQuantity,
        dateQuantity,
        trade.upsidePrice,
        trade.downsidePrice,
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowData],
        },
      });

      const tradeType = portfolioType === 'Long' ? (trade.quantity > 0 ? 'Buy' : 'Sell') : portfolioType === 'Short' ? (trade.quantity > 0 ? 'Buy-to-Cover' : 'Sell') : '';

      const historyRow = [
        trade.ticker,
        portfolioType,
        tradeType,
        trade.quantity,
        trade.price,
        trade.exitDate,
        trade.pm,
        priceQuantity,
        0,
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'TradeHistory!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [historyRow],
        },
      });

      return NextResponse.json({ success: true });
    } else if (action === 'updateDetails') {
      const dataSheetName = portfolioType === 'Long' ? 'LongData' : portfolioType === 'Short' ? 'ShortData' : 'WatchlistData';
      const sheetName = validSheets[dataSheetName.toLowerCase() as keyof typeof validSheets] || dataSheetName;

      const dataResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1:N`,
      });
      const dataRows = dataResponse.data.values || [];
      const rowIndex = dataRows.findIndex(row => row[0] === trade.ticker) + 1;

      if (rowIndex === 0) {
        return NextResponse.json({ error: 'Ticker not found' }, { status: 404 });
      }

      const values = portfolioType === 'Watchlist' ? [
        [trade.longShort, trade.upsidePrice, trade.downsidePrice, trade.subsector, trade.thesis, trade.notes, trade.pm, trade.strategy]
      ] : [
        [trade.strategy, trade.thesis, trade.notes, trade.pm, trade.subsector, trade.upsidePrice, trade.downsidePrice]
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!F${rowIndex}:${portfolioType === 'Watchlist' ? 'I' : 'N'}${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      return NextResponse.json({ success: true });
    } else if (action === 'removeFromWatchlist') {
      const watchlistResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'WatchlistData!A:A',
      });
      const watchlistRows = watchlistResponse.data.values || [];
      const rowIndex = watchlistRows.findIndex(row => row[0] === trade.ticker) + 1;

      if (rowIndex === 0) {
        return NextResponse.json({ error: 'Ticker not found in Watchlist' }, { status: 404 });
      }

      const watchlistSheetId = await getSheetId('WatchlistData');
      if (watchlistSheetId === null) {
        throw new Error('WatchlistData sheet not found');
      }

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            deleteRange: {
              range: {
                sheetId: watchlistSheetId,
                startRowIndex: rowIndex - 1,
                endRowIndex: rowIndex,
              },
              shiftDimension: 'ROWS',
            },
          }],
        },
      });

      return NextResponse.json({ success: true });
    } else if (action === 'calculatePnL') {
      const historyResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'TradeHistory!A2:I',
      });
      const rows = historyResponse.data.values || [];

      const realizedPnL: { [ticker: string]: { Long: number; Short: number } } = {};
      const positionCost: { [ticker: string]: { Long: { quantity: number; price: number }[]; Short: { quantity: number; price: number }[] } } = {};

      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        const [ticker, portfolioType, tradeType, quantityStr, priceStr] = row;
        const q = parseFloat(quantityStr);
        const p = parseFloat(priceStr);

        if (!ticker || isNaN(q) || isNaN(p)) continue;

        if (!realizedPnL[ticker]) {
          realizedPnL[ticker] = { Long: 0, Short: 0 };
          positionCost[ticker] = { Long: [], Short: [] };
        }

        if (portfolioType === 'Long') {
          if (tradeType === 'Buy') {
            positionCost[ticker].Long.push({ quantity: q, price: p });
          } else if (tradeType === 'Sell') {
            let sellQuantity = Math.abs(q);
            while (sellQuantity > 0 && positionCost[ticker].Long.length > 0) {
              const buy = positionCost[ticker].Long[0];
              const quantityToClose = Math.min(sellQuantity, buy.quantity);
              const profit = quantityToClose * (p - buy.price);
              realizedPnL[ticker].Long += profit;
              sellQuantity -= quantityToClose;
              buy.quantity -= quantityToClose;
              if (buy.quantity === 0) {
                positionCost[ticker].Long.shift();
              }
            }
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: `TradeHistory!I${index + 2}`,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [[realizedPnL[ticker].Long]],
              },
            });
          }
        } else if (portfolioType === 'Short') {
          if (tradeType === 'Sell') {
            positionCost[ticker].Short.push({ quantity: Math.abs(q), price: p });
          } else if (tradeType === 'Buy-to-Cover') {
            let buyQuantity = q;
            while (buyQuantity > 0 && positionCost[ticker].Short.length > 0) {
              const sell = positionCost[ticker].Short[0];
              const quantityToClose = Math.min(buyQuantity, sell.quantity);
              const profit = quantityToClose * (sell.price - p);
              realizedPnL[ticker].Short += profit;
              buyQuantity -= quantityToClose;
              sell.quantity -= quantityToClose;
              if (sell.quantity === 0) {
                positionCost[ticker].Short.shift();
              }
            }
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: `TradeHistory!I${index + 2}`,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [[realizedPnL[ticker].Short]],
              },
            });
          }
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}