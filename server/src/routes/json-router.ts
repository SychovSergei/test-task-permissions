import path from "path";
import chokidar from "chokidar";
import * as jsonServer from "json-server";
import { JsonServerRouter } from "json-server";

import { TDataBase } from "../models/database.model";

const dataFilePath = path.join(__dirname, "..", "..", "data", "db.json");
let routerJson = createRouter();

function createRouter(): JsonServerRouter<TDataBase> {
  return jsonServer.router<TDataBase>(dataFilePath);
}

const watcher = chokidar.watch(dataFilePath);
watcher.on("change", () => {
  routerJson = createRouter(); // recreate router when database file is changed
});

export function getRouter(): JsonServerRouter<TDataBase> {
  return routerJson;
}
