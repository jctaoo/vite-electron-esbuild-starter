import { startViteServer } from "./run-vite";
import * as tscDev from "./dev-tsc";
import * as esDev from "./dev-esbuild";
import chalk = require("chalk");
import {
  cannotFoundTSConfigMessage,
  CompileError,
  finishMessage,
  formatDiagnosticsMessage,
  startMessage,
} from "./common";
import { startElectron } from "./run-electron";

const VITE_OPTION = "--vite";
const DEV_MODE = ["--tsc", "--esbuild"];

// Detecting dev mode
let usingMode: string = "--tsc";
for (const mode of DEV_MODE) {
  if (process.argv.includes(mode)) {
    usingMode = mode;
  }
}

function reportError(errors: CompileError[]) {
  const reportingMessage = formatDiagnosticsMessage(errors);
  console.error(reportingMessage);
}

function buildStart() {
  console.log(startMessage);
}

function buildComplete(dir: string) {
  console.log(finishMessage);
  startElectron(dir);
}

function notFoundTSConfig() {
  console.error(chalk.red(cannotFoundTSConfigMessage));
  process.exit();
}

async function main() {
  // Start vite server
  if (process.argv.includes(VITE_OPTION)) {
    await startViteServer();
  }
  // Start dev for main process
  switch (usingMode) {
    case "--esbuild":
      esDev.watchMain(reportError, buildStart, buildComplete, notFoundTSConfig);
      break;
    case "--tsc":
      tscDev.watchMain(reportError, buildStart, buildComplete, notFoundTSConfig);
      break;
  }
}

main();
