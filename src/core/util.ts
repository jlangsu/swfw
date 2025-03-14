function html(strings: TemplateStringsArray, ...values: any[]): string {
  return String.raw({ raw: strings }, ...values);
}

function tryJSON<T>(str: string): T | null {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.log("Failed to parse JSON", e);
    return null;
  }
}

function hash(_hashes: { [key: string]: string }): string {
  let h: string = "";
  do {
    h = Math.random().toString(16).substring(2, 15);
  } while (_hashes[h]);
  return h;
}

async function HTMLResponse(response: string): Promise<Response> {
  return new Response(response, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });
}

async function JSONResponse(response: string | any): Promise<Response> {
  if (typeof response !== "string") response = JSON.stringify(response);

  return new Response(tryJSON(response), {
    headers: {
      "content-type": "application/json",
    },
  });
}

// TODO: fix env config
async function JSONHandler(args: any): Promise<string> {
  const { route, env } = args;
  const key = (route.pathname as any).groups.key;
  const data = await env.IsItOpen.get(key);
  return data!;
}

export { hash, html, HTMLResponse, JSONResponse, JSONHandler };
