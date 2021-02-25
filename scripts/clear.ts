import * as fs from "fs";
import { join, resolve } from "path";

// TODO refactor
/**
 * 删除目录和内部文件
 **/
function delDir(path: string): void {
  if (path.substr(0, 1) !== "/" && path.indexOf(":") === -1)
    path = resolve(path);
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

const path = join(process.cwd(), "./dist");
delDir(path);
