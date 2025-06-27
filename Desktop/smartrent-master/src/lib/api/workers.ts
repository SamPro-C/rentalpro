import { supabase } from '@/lib/config';

export async function getWorkersByLandlord(landlordId: string) {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('landlord_id', landlordId);

  if (error) {
    throw error;
  }
  return data;
}

export async function getWorkerById(id: string) {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function createWorker(worker: {
  landlord_id: string;
  full_name: string;
  email: string;
  phone?: string;
  national_id?: string;
  role?: string;
  assigned_apartments?: number[];
  working_hours?: any;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}) {
  const { data, error } = await supabase
    .from('workers')
    .insert([worker])
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateWorker(id: string, updates: Partial<{
  full_name: string;
  email: string;
  phone?: string;
  national_id?: string;
  role?: string;
  assigned_apartments?: number[];
  working_hours?: any;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}>) {
  const { data, error } = await supabase
    .from('workers')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function deleteWorker(id: string) {
  const { error } = await supabase
    .from('workers')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return true;
}
