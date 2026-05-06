import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const distClientDir = join(process.cwd(), "dist", "client");
const assetsDir = join(distClientDir, "assets");
const manifestExists = existsSync(join(distClientDir, "manifest.webmanifest"));

if (!existsSync(assetsDir)) {
  throw new Error(`Assets directory not found: ${assetsDir}`);
}

const assetFiles = readdirSync(assetsDir);
const indexCandidates = assetFiles.filter((file) => /^index-.*\.js$/.test(file));

if (indexCandidates.length === 0) {
  throw new Error("No client entry file matching index-*.js was found.");
}

const entryFile =
  indexCandidates.find((file) =>
    readFileSync(join(assetsDir, file), "utf8").includes("hydrateRoot(document"),
  ) ?? indexCandidates[0];

const cssFile = assetFiles.find((file) => /^styles-.*\.css$/.test(file));

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#16a34a" />
    ${manifestExists ? '<link rel="manifest" href="/manifest.webmanifest" />' : ""}
    <link rel="icon" href="/icon-192.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/icon-192.svg" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
    <title>PROSPER - Personal Finance Manager</title>
  </head>
  <body>
    <script>
      (function () {
        if (!("serviceWorker" in navigator)) return;
        navigator.serviceWorker.getRegistrations().then(function (regs) {
          return Promise.all(regs.map(function (reg) { return reg.unregister(); }));
        }).catch(function () {});
        if ("caches" in window) {
          caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (key) { return caches.delete(key); }));
          }).catch(function () {});
        }
      })();
    </script>
    <script type="module" src="/assets/${entryFile}"></script>
  </body>
</html>
`;

writeFileSync(join(distClientDir, "index.html"), html, "utf8");
console.log(`Generated dist/client/index.html using entry: ${entryFile}`);
