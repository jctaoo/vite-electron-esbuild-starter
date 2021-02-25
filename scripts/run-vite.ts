import { createServer } from "vite";
import config from "../vite.config";
import * as path from "path";

async function startViteServer() {
  const server = await createServer({
    ...config,
    configFile: false,
  });
  await server.listen();
  process.send("done");
}

startViteServer();
