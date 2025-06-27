import { supabase } from '@/lib/config';

export async function getTenantsByLandlord(landlordId: string) {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('landlord_id', landlordId);

  if (error) {
    throw error;
  }
  return data;
}

export async function getTenantById(id: string) {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function createTenant(tenant: {
  landlord_id: string;
  apartment_id: number;
  unit_id: number;
  room_id: number;
  full_name: string;
  email: string;
  phone?: string;
  national_id?: string;
  date_of_birth?: string;
  gender?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  move_in_date?: string;
  monthly_rent?: number;
  security_deposit?: number;
  lease_start_date?: string;
  lease_end_date?: string;
}) {
  const { data, error } = await supabase
    .from('tenants')
    .insert([tenant])
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateTenant(id: string, updates: Partial<{
  full_name: string;
  email: string;
  phone?: string;
  national_id?: string;
  date_of_birth?: string;
  gender?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  move_in_date?: string;
  monthly_rent?: number;
  security_deposit?: number;
  lease_start_date?: string;
  lease_end_date?: string;
}>) {
  const { data, error } = await supabase
    .from('tenants')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function deleteTenant(id: string) {
  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return true;
}
