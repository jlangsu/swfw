import { build } from "esbuild";
import { readFileSync, writeFileSync } from "fs";
import sass from "sass";

async function Build() {
  const scssLoader = {
    name: 'scss',
    setup(build: any) {
      build.onLoad({ filter: /\.scss$/ }, async (args: any) => {
        try {
          const result = sass.compile(args.path);
          return {
            contents: result.css,
            loader: 'text',
          };
        } catch (error: any) {
          console.log('error here');
          return { errors: [{ text: error.message }] };
        }
      });
    },
  };

  try {
    // build service worker file to integrate in bundle as servable text file
    await build({
      entryPoints: ["./src/core/sw.ts"],
      outfile: "./.assets/sw.js",
      format: "esm",
      minify: true,
      bundle: true,
      treeShaking: true,
      plugins: [scssLoader],
    });

    // add service worker to build
    const sw = readFileSync("./.assets/sw.js", { encoding: "utf8" });
    writeFileSync("./.assets/sw.json", JSON.stringify({ sw }), {
      encoding: "utf8",
    });

    // build with all imports
    await build({
      entryPoints: ["./src/core/worker.ts"],
      outfile: "./build/worker.js",
      minify: true,
      format: "esm",
      bundle: true,
      treeShaking: true,
      plugins: [scssLoader],
    });
  } catch (e) {
    console.error(e); // I prefer this to debug for something this simple.
    process.exit(1);
  }
}
Build().then(() => process.exit(0));
