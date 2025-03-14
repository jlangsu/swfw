import { html, HTMLResponse } from "@core";
import styles from '../assets/styles.scss';

type PageParams = {
  template?: string,
  styles?: string,
  data?: any, // better way of decomposing
};

function Page(params: PageParams) {
  const template = html`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title></title>
        <style>
          ${styles}
        </style>
        <script>
          const registerServiceWorker = async () => {
            if ("serviceWorker" in navigator) {
              try {
                const registration = await navigator.serviceWorker.register(
                  "/sw.js",
                  {
                    scope: "/",
                    type: "module",
                  },
                );
                if (registration.installing) {
                  console.log("Service worker installing");
                } else if (registration.waiting) {
                  console.log("Service worker installed");
                } else if (registration.active) {
                  console.log("Service worker active");
                }
              } catch (error) {
                console.error("Registration failed with" + error);
              }
            }
          };
          registerServiceWorker();
          
          const interval = setInterval(() => fetch("./ping"), 20000);
        </script>
      </head>
      <body>
        ${params.template}
      </body>
    </html>
  `;

  return HTMLResponse(template);
}

export default Page;
