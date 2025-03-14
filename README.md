# Installation

Run the `wrangler login` command to authenticate Wrangler with your Cloudflare 
account. This will open a browser window where you need to accept the 
authorization step.

`npm install`

Update the `wrangler.toml` file with preferred DB ids.


# Execution

`npm start` begins miniflare and starts an instance of the worker locally.

`npm run deploy` deploys the worker to your cloudflare account.


# Development

The Cloudflare worker entry point is located at `src/core/worker.ts`. The 
application entry point is located at `src/core/service-worker.ts`.

Development starts at the `src/routes.ts` file. Determine the app's
functionality, set up the routes, then create the pages, components, or 
behaviors necessary to deliver it to the browser.

Two "handler" functions exist in the `util.ts` file to provide wrappers for
different api response types `HTMLResponse`, and `JSONResponse`. These two 
wrappers provide the necessary headers for route-based api calls consistent with
hypermedia libraries such as fixi.js and HTMX.

# Adapters

Moving from cloudflare to AWS requires wrapping the worker.ts file code with
AWS's event, and response types.

Replacing the `env[config.databaseName]` calls with (for example) asynchronous
calls to a dynamoDB endpoint is also necessary to work with another kv store
such as dynamoDB rather than Cloudflare KV.
