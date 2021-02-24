import * as ts from "typescript";
import * as path from "path";
import * as os from "os";
import {
  CompileError,
  formatDiagnosticsMessage,
  startMessage,
  finishMessage,
  cannotFoundTSConfigMessage,
} from "./common";
import { endElectron, startElectron } from "./run-electron";

const outDir = path.join(process.cwd(), "./dist");
let diagnosticErrors: Array<CompileError> = [];

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (path) => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
};

function watchMain() {
  const configPath = path.join(__dirname, "../src/main/tsconfig.json");
  if (!configPath) {
    throw new Error(cannotFoundTSConfigMessage);
  }

  const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatusChanged
  );

  ts.createWatchProgram(host);
}

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  if (!diagnostic.file || !diagnostic.start || !diagnostic.length) {
    return;
  }

  const diagnosticMessage = ts.flattenDiagnosticMessageText(
    diagnostic.messageText,
    formatHost.getNewLine()
  );
  const path = diagnostic.file.fileName.replace(process.cwd(), "");
  const start = diagnostic.start;
  const len = diagnostic.length;

  const linesOfCode = diagnostic.file.text.split(os.EOL);
  const line = diagnostic.file.text.substr(0, start + 1).split(os.EOL).length;
  const lineStart =
    diagnostic.file.text.substring(0, start + 1).lastIndexOf(os.EOL) + 1;
  const col = start - lineStart;

  const compileError: CompileError = {
    location: {
      column: col,
      file: path,
      length: len,
      line: line,
      lineText: linesOfCode[line - 1],
    },
    message: diagnosticMessage,
  };
  diagnosticErrors.push(compileError);
}

function reportWatchStatusChanged(
  diagnostic: ts.Diagnostic,
  _: any,
  options: ts.CompilerOptions,
  errorCount?: number
) {
  if (!!errorCount && errorCount > 0) {
    const reportingMessage = formatDiagnosticsMessage(diagnosticErrors);
    diagnosticErrors = [];
    console.error(reportingMessage);
  } else if (diagnostic.code === 6194) {
    console.log(finishMessage);
    endElectron();
    startElectron(outDir);
  } else if (diagnostic.code === 6032 || diagnostic.code === 6031) {
    console.log(startMessage);
  }
}

watchMain();
