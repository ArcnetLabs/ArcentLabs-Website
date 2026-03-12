import { Handler } from '@netlify/functions';
import { GoogleAuth } from 'google-auth-library';

interface WaitlistFormData {
  name: string;
  email: string;
  interest?: string;
  product: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SPREADSHEET_ID = '1JW9IzqnDTDKp07RrbTHLtMb4ajLgiLHCVz9QM3d51r8';
const SHEET_NAME = 'Sheet1';

function getCredentials() {
  // In production (Netlify), read from environment variable
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  }
  // In development, read from local file
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../../arcnetlabs-web-485714-eafbae7873b7.json');
}

async function getAccessToken(): Promise<string> {
  const credentials = getCredentials();
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token || '';
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const formData: WaitlistFormData = JSON.parse(event.body || '{}');

    if (!formData.name || !formData.email || !formData.product) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields: name, email, product' }),
      };
    }

    const accessToken = await getAccessToken();

    const range = `${SHEET_NAME}!A:D`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`;

    const row = [
      formData.name,
      formData.email,
      formData.interest || '',
      formData.product,
    ];

    const sheetsResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [row] }),
    });

    if (!sheetsResponse.ok) {
      const error = await sheetsResponse.text();
      throw new Error(`Google Sheets API error: ${error}`);
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Waitlist signup submitted successfully',
      }),
    };
  } catch (error: any) {
    console.error('Error processing waitlist signup:', error);

    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
    };
  }
};
