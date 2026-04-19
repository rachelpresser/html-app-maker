// Generates dist/client/index.html so Capacitor can wrap the app for iOS.
// Reads the built assets and emits a minimal SPA shell that boots the client bundle.
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const CLIENT_DIR = "dist/client";
const ASSETS_DIR = join(CLIENT_DIR, "assets");

if (!existsSync(ASSETS_DIR)) {
  console.error(`[capacitor-html] ${ASSETS_DIR} not found — run \`npm run build\` first.`);
  process.exit(1);
}

const files = readdirSync(ASSETS_DIR);
const css = files.filter((f) => f.endsWith(".css"));
const js = files.filter((f) => f.endsWith(".js"));

if (js.length === 0) {
  console.error("[capacitor-html] No JS bundles found in dist/client/assets.");
  process.exit(1);
}

// Sort so the smaller (entry) bundle loads first, larger (route chunk) preloads.
js.sort((a, b) => a.length - b.length);

const cssTags = css.map((f) => `    <link rel="stylesheet" href="/assets/${f}">`).join("\n");
const preloadTags = js
  .slice(1)
  .map((f) => `    <link rel="modulepreload" href="/assets/${f}">`)
  .join("\n");
const entryTag = `    <script type="module" src="/assets/${js[0]}"></script>`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#070b14" />
    <title>AnaesthesiaPro</title>
    <meta name="description" content="Pocket clinical reference for anaesthetists." />
${cssTags}
${preloadTags}
  </head>
  <body>
    <div id="root"></div>
${entryTag}
  </body>
</html>
`;

writeFileSync(join(CLIENT_DIR, "index.html"), html);
console.log(`[capacitor-html] wrote ${CLIENT_DIR}/index.html (css: ${css.length}, js: ${js.length})`);
