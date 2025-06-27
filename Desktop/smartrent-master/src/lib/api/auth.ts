import { supabase } from '@/lib/config';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  return true;
}

export async function sendPasswordResetEmail(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    throw error;
  }
  return data;
}

export async function updateUser(attributes: { [key: string]: any }) {
  const { data, error } = await supabase.auth.updateUser(attributes);
  if (error) {
    throw error;
  }
  return data;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
}
