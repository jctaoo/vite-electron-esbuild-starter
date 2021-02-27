import { startViteServer } from "./run-vite";
import * as tscDev from "./dev-tsc";
import * as esDev from "./dev-esbuild";
import chalk = require("chalk");

const DEV_MODE = ["--tsc", "--esbuild"];

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
      esDev.watchMain();
      break;
    case "--tsc":
      tscDev.watchMain();
      break;
  }
}

main();
