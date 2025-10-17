import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../frontend/lib/supabase';

const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Backend requires SUPABASE_URL and SUPABASE_SERVICE_KEY');
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: 'public',
  },
});

export async function getPumps() {
  const { data, error } = await supabaseAdmin
    .from('pumps')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pumps:', error);
    throw error;
  }

  return data;
}

export async function getPumpById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('pumps')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching pump:', error);
    throw error;
  }

  return data;
}

export async function createPump(pump: Database['public']['Tables']['pumps']['Insert']) {
  const { data, error } = await (supabaseAdmin as any)
    .from('pumps')
    .insert([pump])
    .select()
    .single();

  if (error) {
    console.error('Error creating pump:', error);
    throw error;
  }

  return data;
}

export async function updatePump(id: string, updates: Database['public']['Tables']['pumps']['Update']) {
  const result = await (supabaseAdmin as any)
    .from('pumps')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (result.error) {
    console.error('Error updating pump:', result.error);
    throw result.error;
  }

  return result.data;
}

export async function deletePump(id: string) {
  const { error } = await supabaseAdmin
    .from('pumps')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting pump:', error);
    throw error;
  }

  return { success: true };
}

export async function getPumpLogs(pumpId: string, limit = 100) {
  const { data, error } = await supabaseAdmin
    .from('pump_logs')
    .select('*')
    .eq('pump_id', pumpId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching pump logs:', error);
    throw error;
  }

  return data;
}

export async function createPumpLog(log: Database['public']['Tables']['pump_logs']['Insert']) {
  const { data, error } = await (supabaseAdmin as any)
    .from('pump_logs')
    .insert([log])
    .select()
    .single();

  if (error) {
    console.error('Error creating pump log:', error);
    throw error;
  }

  return data;
}
