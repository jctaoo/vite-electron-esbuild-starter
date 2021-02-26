import { createServer, InlineConfig, Plugin } from "vite";
import config from "../vite.config";
import { consoleViteMessagePrefix, srcPath } from "./common";
import * as chalk from "chalk";
import { resolve } from "path";

function LoggerPlugin(): Plugin {
  return {
    name: "electron-scripts-logger",
    handleHotUpdate: (ctx) => {
      for (const file of ctx.modules) {
        const path = file.file.replace(srcPath, "");
        console.log(
          chalk.yellow(consoleViteMessagePrefix),
          chalk.yellow("hmr update"),
          chalk.grey(path)
        );
      }
      return ctx.modules;
    },
  };
}

export async function startViteServer() {
  const cfg = config as InlineConfig;
  const server = await createServer({
    ...cfg,
    configFile: false,
    logLevel: "silent",
    plugins: [...(cfg.plugins ?? []), LoggerPlugin()],
  });
  await server.listen();
  const address = server.httpServer.address();
  if (typeof address === "object") {
    const port = address.port;
    console.log(
      chalk.green(consoleViteMessagePrefix),
      chalk.green(`Dev server running at: localhost:${port}`)
    );
  }
}
