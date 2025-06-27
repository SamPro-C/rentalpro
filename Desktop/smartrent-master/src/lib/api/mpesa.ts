import axios from 'axios';

interface MpesaCredentials {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  environment?: 'sandbox' | 'production';
}

const MPESA_BASE_URLS = {
  sandbox: 'https://sandbox.safaricom.co.ke',
  production: 'https://api.safaricom.co.ke',
};

async function getAccessToken(credentials: MpesaCredentials) {
  const { consumerKey, consumerSecret, environment = 'sandbox' } = credentials;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const baseUrl = MPESA_BASE_URLS[environment];

  try {
    const response = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get M-Pesa access token', error);
    throw error;
  }
}

export async function initiateStkPush(
  phoneNumber: string,
  amount: number,
  accountReference: string,
  transactionDesc: string,
  credentials: MpesaCredentials
) {
  const { shortcode, passkey, environment = 'sandbox' } = credentials;
  const token = await getAccessToken(credentials);
  const baseUrl = MPESA_BASE_URLS[environment];

  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  };

  try {
    const response = await axios.post(`${baseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to initiate M-Pesa STK Push', error);
    throw error;
  }
}
