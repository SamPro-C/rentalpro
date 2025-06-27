import { supabase } from '@/lib/config';

export async function getPaymentsByTenant(tenantId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('tenant_id', tenantId);

  if (error) {
    throw error;
  }
  return data;
}

export async function getPaymentById(id: number) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function createPayment(payment: {
  tenant_id: string;
  apartment_id: number;
  unit_id: number;
  room_id: number;
  amount: number;
  payment_method?: string;
  transaction_id?: string;
  receipt_url?: string;
}) {
  const { data, error } = await supabase
    .from('payments')
    .insert([payment])
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updatePayment(id: number, updates: Partial<{
  amount: number;
  payment_method?: string;
  transaction_id?: string;
  receipt_url?: string;
}>) {
  const { data, error } = await supabase
    .from('payments')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function deletePayment(id: number) {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return true;
}
