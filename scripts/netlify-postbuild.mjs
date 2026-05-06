import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const clientDir = join(process.cwd(), "dist", "client");
const shellPath = join(clientDir, "_shell.html");
const indexPath = join(clientDir, "index.html");

if (existsSync(shellPath)) {
  copyFileSync(shellPath, indexPath);
  console.log("Created dist/client/index.html from _shell.html");
} else {
  console.warn("Skipped postbuild: dist/client/_shell.html not found");
}
