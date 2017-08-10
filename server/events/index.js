import fs from "fs";
import path from "path";

const dir = "./server/events/";
fs
  .readdirSync(path.resolve(dir))
  .filter(p => p.indexOf(".js") > -1 && p !== "index.js")
  .forEach(p => require(`./${p}`));
