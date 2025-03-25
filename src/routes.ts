import { HTMLResponse, Page, Router } from '@core';
import Index from './templates/pages/index';
import config from './config';

const router = new Router([
  ["/", async () => Page({ template: Index() })],
  [
    "/db/:key",
    async ({ env, route }) => {
      console.log('env', env);
      const key = route.pathname.groups.key;
      const data = await fetch(`/db/${key}`).then((res) => res.json());
      await env[config.databaseName].put(key, JSON.stringify(data));
    },
  ],
  [
    "/db/:key",
    async ({ env, route }) => {
      const key = route.pathname.groups.key;
      const data = await env[config.databaseName].get(key);
      await fetch(`/db/${key}`, {
        headers: { "content-type": "application/json" },
        body: data,
        method: "POST",
      });
      return HTMLResponse("");
    },
    "POST",
  ],
  [
    "/ping",
    async () => {
      return new Response("pong", {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    },
  ],
]);

export default router;
