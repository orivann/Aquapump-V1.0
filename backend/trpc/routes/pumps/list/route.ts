import { publicProcedure } from '../../../create-context';
import { getPumps } from '../../../../services/supabase';

export const listPumpsProcedure = publicProcedure.query(async () => {
  return await getPumps();
});
