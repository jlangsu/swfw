import { HTMLResponse, JSONResponse, JSONHandler, NoSW, Router, ServiceWorker } from "@core";
import { Environment, HandlerArgs } from "../types";
import config from '../config';

const router = new Router([
  ["/", async () => HTMLResponse(NoSW)],
  ["/sw.js", ServiceWorker],
  [
    "/db/:key",
    async (args) => {
      console.log('args', args);
      return JSONResponse(await JSONHandler(args as HandlerArgs));
    },
  ],
  [
    "/db/:key",
    async (args) => {
      const body = await args.request.json();
      args.env[config.databaseName].put(
        args.route.pathname.groups.key,
        JSON.stringify(body),
      );
      return JSONResponse(await JSONHandler(args as HandlerArgs));
    },
    "POST",
  ],
]);

export default {
  async fetch(request: Request, env: Environment, ctx: ExecutionContext) {
    return router.handle({ request, env, ctx });
  },
  /* 
    async scheduled(event: any, env: Environment, ctx: ExecutionContext) {
      return resetData({ event, env, ctx });
    },
  */
};
