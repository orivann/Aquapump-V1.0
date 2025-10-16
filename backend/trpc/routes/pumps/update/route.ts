import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { updatePump } from '../../../../services/supabase';

export const updatePumpProcedure = publicProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      model: z.string().min(1).optional(),
      status: z.enum(['online', 'offline', 'maintenance']).optional(),
      pressure: z.number().min(0).optional(),
      flow_rate: z.number().min(0).optional(),
      power_consumption: z.number().min(0).optional(),
      location: z.string().min(1).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { id, ...updates } = input;
    return await updatePump(id, updates);
  });
