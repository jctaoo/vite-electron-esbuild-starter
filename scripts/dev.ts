import { startViteServer } from "./run-vite";
import * as tscDev from "./dev-tsc";

const DEV_MODE = ["--esbuild", "--tsc"];

// Detecting dev mode
let usingMode: string = "--tsc";
for (const mode of DEV_MODE) {
  if (process.argv.includes(mode)) {
    usingMode = mode;
  }
}

async function main() {
  // Start vite server
  await startViteServer();
  // Start dev for main process
  switch (usingMode) {
    case "--esbuild":
      break;
    case "--tsc":
      tscDev.watchMain();
      break;
    default:
      // TODO error reporting
      break;
  }
}

main();
