import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { getPumpLogs, createPumpLog } from '../../../../services/supabase';

export const getPumpLogsProcedure = publicProcedure
  .input(
    z.object({
      pumpId: z.string().uuid(),
      limit: z.number().min(1).max(500).default(100),
    })
  )
  .query(async ({ input }) => {
    return await getPumpLogs(input.pumpId, input.limit);
  });

export const createPumpLogProcedure = publicProcedure
  .input(
    z.object({
      pump_id: z.string().uuid(),
      event_type: z.enum(['start', 'stop', 'maintenance', 'error', 'warning']),
      message: z.string().min(1),
      metadata: z.record(z.unknown()).optional().default({}),
    })
  )
  .mutation(async ({ input }) => {
    return await createPumpLog(input);
  });
