import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { createPump } from '../../../../services/supabase';

export const createPumpProcedure = publicProcedure
  .input(
    z.object({
      name: z.string().min(1),
      model: z.string().min(1),
      status: z.enum(['online', 'offline', 'maintenance']),
      pressure: z.number().min(0),
      flow_rate: z.number().min(0),
      power_consumption: z.number().min(0),
      location: z.string().min(1),
    })
  )
  .mutation(async ({ input }) => {
    return await createPump(input);
  });
