import { supabase } from '@/lib/config';

export async function getServiceRequestsByTenant(tenantId: string) {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('tenant_id', tenantId);

  if (error) {
    throw error;
  }
  return data;
}

export async function getServiceRequestById(id: number) {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function createServiceRequest(request: {
  tenant_id: string;
  apartment_id: number;
  unit_id: number;
  room_id: number;
  description: string;
  status?: string;
  priority?: string;
  assigned_worker_id?: string;
}) {
  const { data, error } = await supabase
    .from('service_requests')
    .insert([request])
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateServiceRequest(id: number, updates: Partial<{
  description?: string;
  status?: string;
  priority?: string;
  assigned_worker_id?: string;
}>) {
  const { data, error } = await supabase
    .from('service_requests')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function deleteServiceRequest(id: number) {
  const { error } = await supabase
    .from('service_requests')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return true;
}
