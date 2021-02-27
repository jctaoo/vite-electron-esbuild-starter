import * as fs from "fs";
import { join, resolve } from "path";

async function exists(path: fs.PathLike): Promise<boolean> {
  try {
    await fs.promises.stat(path);
    return true;
  } catch {
    return false;
  }
}

async function rmRecursively(path: string) {
  if (!(await exists(path))) {
    return;
  }
  if (path.substr(0, 1) !== "/" && path.indexOf(":") === -1) {
    path = resolve(path);
  }
  let files: Array<string> = [path];
  while (files.length > 0) {
    const last = files.pop();
    const stat = await fs.promises.stat(last);
    if (!stat.isDirectory()) {
      await fs.promises.rm(last);
    } else {
      const children = await (await fs.promises.readdir(last)).map((p) => {
        return join(last, p);
      });
      if (children.length === 0) {
        await fs.promises.rmdir(last);
      } else {
        files.push(last);
        files = files.concat(children);
      }
    }
  }
}

rmRecursively("./dist");
