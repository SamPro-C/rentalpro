import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest, { params }: { params: { landlordId: string } }) {
  const { landlordId } = params;
  try {
    const { data, error } = await supabase
      .from('mpesa_accounts')
      .select('shortcode, passkey, consumer_key, consumer_secret, environment')
      .eq('landlord_id', landlordId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({}, { status: 404 });
      }
      throw error;
    }

    if (!data) {
      return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json({
      shortcode: data.shortcode,
      passkey: data.passkey,
      consumerKey: data.consumer_key,
      consumerSecret: data.consumer_secret,
      environment: data.environment,
    });
  } catch (error) {
    console.error('Error fetching M-Pesa credentials:', error);
    return NextResponse.json({ error: 'Failed to fetch credentials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { landlordId: string } }) {
  const { landlordId } = params;
  try {
    const body = await request.json();
    const { shortcode, passkey, consumerKey, consumerSecret, environment } = body;

    if (!shortcode || !passkey || !consumerKey || !consumerSecret || !environment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert the credentials for the landlord
    const { error } = await supabase
      .from('mpesa_accounts')
      .upsert({
        landlord_id: landlordId,
        shortcode,
        passkey,
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        environment,
      }, { onConflict: 'landlord_id' });

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Credentials saved' });
  } catch (error) {
    console.error('Error saving M-Pesa credentials:', error);
    return NextResponse.json({ error: 'Failed to save credentials' }, { status: 500 });
  }
}
