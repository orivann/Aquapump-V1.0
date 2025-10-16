import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      pumps: {
        Row: {
          id: string;
          name: string;
          model: string;
          status: 'online' | 'offline' | 'maintenance';
          pressure: number;
          flow_rate: number;
          power_consumption: number;
          location: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pumps']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['pumps']['Insert']>;
      };
      pump_logs: {
        Row: {
          id: string;
          pump_id: string;
          event_type: 'start' | 'stop' | 'maintenance' | 'error' | 'warning';
          message: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pump_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['pump_logs']['Insert']>;
      };
    };
  };
};
