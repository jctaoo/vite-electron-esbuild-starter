/**
 * Run main process using ESBuild
 */
import * as esbuild from "esbuild";
import * as path from "path";
import * as fs from "fs";
import {
  CompileError,
  formatDiagnosticsMessage,
  finishMessage,
  cannotFoundTSConfigMessage,
} from "./common";
import { endElectron, startElectron } from "./run-electron";
import { createServer } from "vite";

const mainPath = path.join(process.cwd(), "./src/main");
const outDir = path.join(process.cwd(), "./dist");
const entryPath = path.join(mainPath, "index.ts");
const viteArgName = "--vite";

async function startViteServer() {
  const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    root: __dirname,
    server: {
      port: 1337,
    },
  });
  await server.listen();
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

compile().then(() => {
  if (process.argv.includes(viteArgName)) {
    startViteServer().then();
  }
});
