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
