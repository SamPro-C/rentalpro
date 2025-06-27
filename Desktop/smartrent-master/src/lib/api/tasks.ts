import { supabase } from '@/lib/config';

export async function getTasksByWorker(workerId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('worker_id', workerId);

  if (error) {
    throw error;
  }
  return data;
}

export async function getTaskById(id: number) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function createTask(task: {
  worker_id: string;
  title: string;
  description?: string;
  apartment_id: number;
  unit_id: number;
  tenant_id?: string;
  status?: string;
  assigned_date?: string;
  due_date?: string;
  completed_date?: string;
}) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateTask(id: number, updates: Partial<{
  title?: string;
  description?: string;
  status?: string;
  assigned_date?: string;
  due_date?: string;
  completed_date?: string;
}>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function deleteTask(id: number) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return true;
}
