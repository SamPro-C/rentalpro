import { supabase } from '@/lib/config';

export async function getAdminLogsByAdmin(adminId: string) {
  const { data, error } = await supabase
    .from('admin_logs')
    .select('*')
    .eq('admin_id', adminId);

  if (error) {
    throw error;
  }
  return data;
}

export async function getAdminLogById(id: number) {
  const { data, error } = await supabase
    .from('admin_logs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function createAdminLog(log: {
  admin_id: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  description?: string;
}) {
  const { data, error } = await supabase
    .from('admin_logs')
    .insert([log])
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function deleteAdminLog(id: number) {
  const { error } = await supabase
    .from('admin_logs')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return true;
}
