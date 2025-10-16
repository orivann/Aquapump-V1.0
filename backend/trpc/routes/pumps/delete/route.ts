import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { deletePump } from '../../../../services/supabase';

export const deletePumpProcedure = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ input }) => {
    return await deletePump(input.id);
  });
