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
        console.log(`Message sent to chat ${chatId}: ${text}`);
    } catch (error) {
        console.error('Failed to send message to Telegram:', error);
    }
}

interface GoogleApiErrorResponseData {
    error?: {
        code?: number;
        message?: string;
        errors?: Array<{ domain: string; reason: string; message: string }>;
        status?: string;
    };
    message?: string;
}

interface AxiosLikeError extends Error {
    response?: {
        data?: GoogleApiErrorResponseData;
        status?: number;
        headers?: Record<string, string>;
    };
}

async function appendIncomeToSheet(date: string, amount: string, description: string): Promise<boolean> {
    if (!GOOGLE_SHEET_ID) {
        console.error('Error: GOOGLE_SHEET_ID is not configured in environment variables.');
        throw new Error('Google Sheet ID not configured. Please check your .env.local or Vercel settings.');
    }

    const sheetName = 'Rekap-pengeluaran';
    const headers = ['Tanggal', 'Jumlah', 'Deskripsi'];
    const headersRange = `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`;

    try {
        const getHeadersResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: headersRange,
        });

        const existingHeaders = getHeadersResponse.data.values ? getHeadersResponse.data.values[0] : null;

        let headersExist = false;
        if (existingHeaders && existingHeaders.length === headers.length) {
            headersExist = headers.every((header, index) => existingHeaders[index] === header);
        }

        if (!headersExist) {
            console.log(`Headers not found, writing headers to sheet.`);
            await sheets.spreadsheets.values.update({
                spreadsheetId: GOOGLE_SHEET_ID,
                range: headersRange,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [headers],
                },
            });
            console.log(`Headers written successfully.`);
        }

        const appendResponse = await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: `${sheetName}!A:C`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[date, amount, description]],
            },
        });
        console.log('Data successfully appended to Google Sheet:', appendResponse.data);
        return true;
    } catch (error: unknown) {
        console.error('Failed to append data to Google Sheet:', error);

        let errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
        if (typeof error === 'object' && error !== null && 'response' in error && (error as Partial<AxiosLikeError>).response?.data?.error?.message) {
            errorMessage = (error as Partial<AxiosLikeError>).response?.data?.error?.message || errorMessage;
        } else if (typeof error === 'object' && error !== null && 'response' in error && (error as Partial<AxiosLikeError>).response?.data?.message) {
            errorMessage = (error as Partial<AxiosLikeError>).response?.data?.message || errorMessage;
        }

        throw new Error(`Could not append data to Google Sheet. Error: ${errorMessage}. Please check permissions, Sheet ID, and network connection.`);
    }
}

async function createNewSheet(sheetTitle: string): Promise<boolean> {
    if (!GOOGLE_SHEET_ID) {
        console.error('Error: GOOGLE_SHEET_ID is not configured.');
        throw new Error('Google Sheet ID not configured.');
    }

    try {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: GOOGLE_SHEET_ID,
            requestBody: {
                requests: [{
                    addSheet: {
                        properties: {
                            title: sheetTitle
                        }
                    }
                }]
            }
        });
        console.log(`Sheet "${sheetTitle}" created successfully.`);
        return true;
    } catch (error: unknown) {
        console.error(`Failed to create sheet "${sheetTitle}":`, error);

        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
        if (typeof error === 'object' && error !== null && 'response' in error && (error as Partial<AxiosLikeError>).response?.data?.error?.message) {
            errorMessage = (error as Partial<AxiosLikeError>).response?.data?.error?.message || errorMessage;
        } else if (typeof error === 'object' && error !== null && 'response' in error && (error as Partial<AxiosLikeError>).response?.data?.message) {
            errorMessage = (error as Partial<AxiosLikeError>).response?.data?.message || errorMessage;
        }
        throw new Error(`Could not create sheet. Error: ${errorMessage}. Sheet name might already exist.`);
    }
}


export async function POST(req: NextRequest): Promise<NextResponse> {
    const body = await req.json();
    const message = body.message;

    if (!message) {
        console.log('Received non-message update from Telegram.');
        return NextResponse.json({ status: 'No message received' }, { status: 200 });
    }

    const chatId = message.chat.id;
    const text = message.text;

    console.log(`[${new Date().toLocaleString('id-ID')}] Received message from ${chatId}: "${text}"`);

    if (text && text.startsWith('/income')) {
        const parts = text.split(' ');
        if (parts.length >= 3) {
            let amountInput = parts[1].toLowerCase();
            let rawAmount: number;

            if (amountInput.endsWith('k')) {
                amountInput = amountInput.slice(0, -1);
                rawAmount = parseFloat(amountInput) * 1000;
            } else {
                rawAmount = parseFloat(amountInput);
            }

            const description = parts.slice(2).join(' ');

            const now = new Date();
            const monthNamesShort = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            const month = monthNamesShort[now.getMonth()];
            const day = now.getDate().toString().padStart(2, '0');
            const year = now.getFullYear();
            const date = `${month}-${day}-${year}`;

            if (isNaN(rawAmount) || rawAmount <= 0) {
                await sendMessage(chatId, '❌ Jumlah income tidak valid. Gunakan format: `/income <jumlah> <deskripsi>` (contoh: `/income 150000 Penjualan Hari Ini` atau `/income 150k Penjualan Hari Ini`)');
                return NextResponse.json({ status: 'Invalid amount' }, { status: 200 });
            }

            const formattedAmountIDR = rawAmount.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            });

            try {
                await appendIncomeToSheet(date, formattedAmountIDR, description);
                await sendMessage(chatId, `🎉 Berhasil! Income ${formattedAmountIDR} (${description}) sudah dicatat.`);
            } catch (error: unknown) {
                console.error(`[${new Date().toLocaleString('id-ID')}] Error handling /income command for chat ${chatId}:`, error);

                const errorMessageForUser = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
                if (typeof error === 'object' && error !== null && 'response' in error && (error as Partial<AxiosLikeError>).response?.data?.error?.message) {
                    errorMessageForUser = (error as Partial<AxiosLikeError>).response?.data?.error?.message || errorMessageForUser;
                } else if (typeof error === 'object' && error !== null && 'response' in error && (error as Partial<AxiosLikeError>).response?.data?.message) {
                    errorMessageForUser = (error as Partial<AxiosLikeError>).response?.data?.message || errorMessageForUser;
                }

                await sendMessage(chatId, `❌ Maaf, terjadi kesalahan saat mencatat income. Pesan error: ${errorMessageForUser}. Silakan coba lagi nanti.`);
            }
        } else {
            await sendMessage(chatId, '🤔 Format salah. Gunakan: `/income <jumlah> <deskripsi>`. Contoh: `/income 150000 Penjualan Hari Ini` atau `/income 150k Penjualan Hari Ini`');
        }
    } else if (text && text.startsWith('/add_new_sheet')) {
        const parts = text.split(' ');
        if (parts.length >= 2) {
            const newSheetName = parts.slice(1).join(' ').trim();
            if (newSheetName) {
                try {
                    await createNewSheet(newSheetName);
                    await sendMessage(chatId, `✅ Sheet baru "${newSheetName}" berhasil dibuat!`);
                } catch (error: unknown) {
                    console.error(`[${new Date().toLocaleString('id-ID')}] Error creating new sheet:`, error);

                    const errorMessageForUser = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
                    if (typeof error === 'object' && error !== null && 'response' in error && (error as Partial<AxiosLikeError>).response?.data?.error?.message) {
                        errorMessageForUser = (error as Partial<AxiosLikeError>).response?.data?.error?.message || errorMessageForUser;
                    } else if (typeof error === 'object' && error !== null && 'response' in error && (error as Partial<AxiosLikeError>).response?.data?.message) {
                        errorMessageForUser = (error as Partial<AxiosLikeError>).response?.data?.message || errorMessageForUser;
                    }

                    await sendMessage(chatId, `❌ Gagal membuat sheet baru. Pesan error: ${errorMessageForUser}.`);
                }
            } else {
                await sendMessage(chatId, '⚠️ Format salah. Gunakan: `/add_new_sheet <nama_sheet_baru>`. Contoh: `/add_new_sheet Laporan Juni`');
            }
        } else {
            await sendMessage(chatId, '⚠️ Format salah. Gunakan: `/add_new_sheet <nama_sheet_baru>`. Contoh: `/add_new_sheet Laporan Juni`');
        }
    }
    else if (text === '/start' || text === '/help') {
        await sendMessage(chatId, 'Halo! Saya bot pencatat income UMKM Anda.\nUntuk mencatat income, gunakan format:\n`/income <jumlah> <deskripsi>`\nContoh: `/income 150000 Penjualan Hari Ini` atau `/income 150k Penjualan Hari Ini`\n\nUntuk membuat sheet baru:\n`/add_new_sheet <nama_sheet_baru>`\nContoh: `/add_new_sheet Laporan Juni`');
    } else {
        await sendMessage(chatId, 'Perintah tidak dikenal. Ketik /help untuk melihat panduan.');
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
}