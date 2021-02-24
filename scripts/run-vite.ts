import { createServer } from "vite";
import * as path from "path";

const viteConfigPath = path.join(process.cwd(), "./vite.config.ts");

async function startViteServer() {
  const server = await createServer({
    configFile: viteConfigPath,
    root: process.cwd(),
    server: {
      port: 1337,
    },
  });
  await server.listen();
  process.send('done');
}

startViteServer();
