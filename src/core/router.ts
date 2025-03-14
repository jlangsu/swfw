type Method = "GET" | "PUT" | "POST" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";
type Handler = (args: any) => any; // make sure args can be destructured for better typing

type Route = {
  path: URLPattern;
  method: Method;
  handler: Handler;
};

type HandlerParams = {
  request: Request;
  env: any;
  ctx: ExecutionContext
}

class Router {
  routes: Route[] = [];

  constructor(routes: [string, Handler, Method?][] = []) {
    // @ts-ignore
    if (!globalThis.URLPattern) {
      import("urlpattern-polyfill")
        .then(() => this.setup(routes)); 
    } else this.setup(routes);
  }

  setup(routes: [string, Handler, Method?][]) {
    for (const route of routes) {
      this.register(...route);
    }
  }

  register(path: string, handler: Handler, method: Method = "GET") {
    this.routes.push({
      path: new URLPattern({ pathname: path }),
      method,
      handler,
    });
  }

  handle(params: HandlerParams) {
    const { request } = params;

    for (const route of this.routes) {
      if (route.method !== request.method) continue;
      const match = route.path.exec({
        pathname: new URL(request.url).pathname,
      });
      if (match) return route.handler({ ...params, route: match });
    }
    return new Response("Not found", { status: 404 });
  }
}

export { Method, Handler, type Route, Router };
