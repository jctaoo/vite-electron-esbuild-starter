/**
 * Run main process using ESBuild
 */
import * as esbuild from "esbuild";
import * as path from "path";
import * as fs from "fs";
import {
  CompileError,
  consoleViteMessagePrefix,
  formatDiagnosticsMessage,
  finishMessage,
  cannotFoundTSConfigMessage,
} from "./common";
import { endElectron, startElectron } from "./run-electron";
import * as childProcess from "child_process";
import { Transform, TransformOptions } from "stream";
import { clearTimeout } from "timers";

const viteArgName = "--vite";
const mainPath = path.join(process.cwd(), "./src/main");
const outDir = path.join(process.cwd(), "./dist");
const entryPath = path.join(mainPath, "index.ts");

async function startViteServer() {
  const viteScriptPath = path.join(__dirname, "./run-vite.ts");
  const cp = childProcess.fork(viteScriptPath, [], { silent: true });
  // TODO handle cp stdout and stderr
  return new Promise<void>((resolve, reject) => {
    const clear = setTimeout(() => {
      reject(new Error('Timeout when starting the vite server.'));
    }, 30000);
    cp.on('message', (msg) => {
      if (msg === 'done') {
        clearTimeout(clear);
        resolve();
      }
    })
  });
}

async function compile() {
  const tsconfigPath = path.join(mainPath, "tsconfig.json");
  if (!fs.existsSync(tsconfigPath)) {
    throw new Error(cannotFoundTSConfigMessage);
  }

  try {
    await esbuild.build({
      outdir: outDir,
      entryPoints: [entryPath],
      tsconfig: tsconfigPath,
      format: "cjs",
      logLevel: "silent",
      errorLimit: 0,
      incremental: true,
      watch: {
        onRebuild: (error) => {
          if (!!error) {
            handleBuildFailure(error);
          } else {
            handleSuccess();
          }
        },
      },
    });
    handleSuccess();
  } catch (e) {
    if (!!e.errors && !!e.errors.length && e.errors.length > 0) {
      const error = e as esbuild.BuildFailure;
      handleBuildFailure(error);
    }
  }
}

function handleBuildFailure(error: esbuild.BuildFailure) {
  const errors = error.errors.map(
    (e): CompileError => {
      return {
        location: e.location,
        message: e.text,
      };
    }
  );
  const reportingMessage = formatDiagnosticsMessage(errors);
  console.error(reportingMessage);
}

function handleSuccess() {
  console.log(finishMessage);
  endElectron();
  startElectron(outDir);
}

async function start() {
  if (process.argv.includes(viteArgName)) {
    await startViteServer();
  }
  await compile();
}

start();
