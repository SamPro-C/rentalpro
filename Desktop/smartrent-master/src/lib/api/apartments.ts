import { supabase } from '@/lib/config';

export async function getApartmentsByLandlord(landlordId: string) {
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('landlord_id', landlordId);

  if (error) {
    throw error;
  }
  return data;
}

export async function getApartmentById(id: number) {
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function createApartment(apartment: {
  landlord_id: string;
  name: string;
  location?: string;
  description?: string;
  amenities?: string[];
}) {
  const { data, error } = await supabase
    .from('apartments')
    .insert([apartment])
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateApartment(id: number, updates: Partial<{
  name: string;
  location?: string;
  description?: string;
  amenities?: string[];
}>) {
  const { data, error } = await supabase
    .from('apartments')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function deleteApartment(id: number) {
  const { error } = await supabase
    .from('apartments')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return true;
}
