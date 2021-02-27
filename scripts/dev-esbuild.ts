/**
 * Run main process using ESBuild
 */
import * as esbuild from "esbuild";
import * as path from "path";
import * as fs from "fs";
import {
  CompileError,
  mainPath,
  outDir,
  entryPath,
  WatchMain,
} from "./common";

function transformErrors(error: esbuild.BuildFailure): CompileError[] {
  const errors = error.errors.map(
    (e): CompileError => {
      return {
        location: e.location,
        message: e.text,
      };
    }
  );
  return errors;
}

export const watchMain: WatchMain = async (
  reportError,
  buildStart,
  buildComplete,
  notFoundTSConfig
) => {
  const tsconfigPath = path.join(mainPath, "tsconfig.json");
  if (!fs.existsSync(tsconfigPath)) {
    notFoundTSConfig();
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
      platform: "node",
      sourcemap: true,
      watch: {
        onRebuild: (error) => {
          if (!!error) {
            reportError(transformErrors(error));
          } else {
            buildComplete(outDir);
          }
        },
      },
    });
    buildComplete(outDir);
  } catch (e) {
    if (!!e.errors && !!e.errors.length && e.errors.length > 0) {
      const error = e as esbuild.BuildFailure;
      reportError(transformErrors(error));
    }
  }
};
