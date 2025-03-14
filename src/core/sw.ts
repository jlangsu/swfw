import { Database, Page } from "@core";
import Index from "../templates/pages/index";
import config from '../config';
import router from '../routes';

export type {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {});

let DB: Database | undefined;

self.addEventListener("fetch", (event) => {
  const whiteList: string[] = [];

  if (whiteList.includes(event.request.url)) {
    return fetch(event.request);
  }

  return event.respondWith(
    (async () => {
      if (!DB) DB = new Database(config.databaseName, DB);
      console.log(DB);

      const request = event.request;
      const env = { [config.databaseName]: DB };
      const ctx = this as unknown as ExecutionContext;

      // TODO: make generic
      let dbCheck;
      try {
        dbCheck = JSON.parse(await env[config.databaseName].get("lists"));
      } catch (e) {
        console.log(e);
      }

      if (!dbCheck) {
        try {
          const lists = await fetch("/db/lists").then((res) => res.json());
          await env[config.databaseName].put("lists", JSON.stringify(lists));
        } catch (e) {
          console.log(e);
        }
      }

      if (event.request.url == self.registration.scope) {
        return Page({ template: Index() });
      }

      return router.handle({ request, env, ctx });
    })(),
  );
});
