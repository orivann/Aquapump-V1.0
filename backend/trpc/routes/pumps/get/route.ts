import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { getPumpById } from '../../../../services/supabase';

export const getPumpProcedure = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ input }) => {
    return await getPumpById(input.id);
  });
