import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function sendMessage(chatId: number, text: string) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.error('TELEGRAM_BOT_TOKEN is not set. Cannot send message.');
        return;
    }
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
            }),
        });
        console.log(`[${new Date().toLocaleString('id-ID')}] Message sent to chat ${chatId}: ${text}`);
    } catch (error) {
        console.error('Failed to send message to Telegram:', error);
    }
}

async function appendIncomeToSheet(date: string, amount: number, description: string): Promise<boolean> {
    if (!GOOGLE_SHEET_ID) {
        console.error('Error: GOOGLE_SHEET_ID is not configured in environment variables.');
        throw new Error('Google Sheet ID not configured. Please check your .env.local or Vercel settings.');
    }

    const sheetName = 'Rekap-pengeluaran'; // <--- PERUBAHAN DI SINI
    const range = `${sheetName}!A:C`;

    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[date, amount, description]],
            },
        });
        console.log(`[${new Date().toLocaleString('id-ID')}] Data successfully appended to Google Sheet:`, response.data);
        return true;
    } catch (error: unknown) {
        console.error(`[${new Date().toLocaleString('id-ID')}] Failed to append data to Google Sheet:`, error);

        let errorMessage = 'An unexpected error occurred while appending data.';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        if (typeof error === 'object' && error !== null && 'response' in error) {
            const axiosErrorResponse = (error as { response?: { data?: { error?: { message?: string } | string; message?: string } } }).response;

            if (axiosErrorResponse?.data) {
                console.error('Google API Error Response Data:', axiosErrorResponse.data);

                if (typeof axiosErrorResponse.data === 'object' && axiosErrorResponse.data !== null) {
                    if ('error' in axiosErrorResponse.data && typeof (axiosErrorResponse.data as any).error === 'object' && (axiosErrorResponse.data as any).error !== null && 'message' in (axiosErrorResponse.data as any).error) {
                        errorMessage = (axiosErrorResponse.data as any).error.message;
                    } else if ('message' in axiosErrorResponse.data && typeof (axiosErrorResponse.data as any).message === 'string') {
                        errorMessage = (axiosErrorResponse.data as any).message;
                    }
                }
            }
        }

        throw new Error(`Could not append data to Google Sheet. Error: ${errorMessage}. Please check permissions, Sheet ID, and network connection.`);
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const body = await req.json();
    const message = body.message;

    if (!message) {
        console.log(`[${new Date().toLocaleString('id-ID')}] Received non-message update from Telegram.`);
        return NextResponse.json({ status: 'No message received' }, { status: 200 });
    }

    const chatId = message.chat.id;
    const text = message.text;

    console.log(`[${new Date().toLocaleString('id-ID')}] Processing message from chat ${chatId}: "${text}"`);

    if (text && text.startsWith('/income')) {
        const parts = text.split(' ');
        if (parts.length >= 3) {
            const amount = parseFloat(parts[1]);
            const description = parts.slice(2).join(' ');
            const date = new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });

            if (isNaN(amount) || amount <= 0) {
                await sendMessage(chatId, '❌ Jumlah income tidak valid. Gunakan format: `/income <jumlah> <deskripsi>` (contoh: `/income 150000 Penjualan Hari Ini`)');
                return NextResponse.json({ status: 'Invalid amount' }, { status: 200 });
            }

            try {
                await appendIncomeToSheet(date, amount, description);
                await sendMessage(chatId, `🎉 Berhasil! Income Rp${amount.toLocaleString('id-ID')} (${description}) sudah dicatat.`);
            } catch (error) {
                console.error(`[${new Date().toLocaleString('id-ID')}] Error handling /income command for chat ${chatId}:`, error);
                await sendMessage(chatId, 'Maaf, terjadi kesalahan saat mencatat income. Silakan coba lagi nanti.');
            }
        } else {
            await sendMessage(chatId, '🤔 Format salah. Gunakan: `/income <jumlah> <deskripsi>`. Contoh: `/income 150000 Penjualan Hari Ini`');
        }
    } else if (text === '/start' || text === '/help') {
        await sendMessage(chatId, 'Halo! Saya bot pencatat income UMKM Anda.\nUntuk mencatat income, gunakan format:\n`/income <jumlah> <deskripsi>`\nContoh: `/income 150000 Penjualan Hari Ini`');
    } else {
        await sendMessage(chatId, 'Perintah tidak dikenal. Ketik /help untuk melihat panduan.');
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
}