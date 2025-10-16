import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { listPumpsProcedure } from "./routes/pumps/list/route";
import { getPumpProcedure } from "./routes/pumps/get/route";
import { createPumpProcedure } from "./routes/pumps/create/route";
import { updatePumpProcedure } from "./routes/pumps/update/route";
import { deletePumpProcedure } from "./routes/pumps/delete/route";
import { getPumpLogsProcedure, createPumpLogProcedure } from "./routes/pumps/logs/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  pumps: createTRPCRouter({
    list: listPumpsProcedure,
    get: getPumpProcedure,
    create: createPumpProcedure,
    update: updatePumpProcedure,
    delete: deletePumpProcedure,
    logs: createTRPCRouter({
      list: getPumpLogsProcedure,
      create: createPumpLogProcedure,
    }),
  }),
});

export type AppRouter = typeof appRouter;
