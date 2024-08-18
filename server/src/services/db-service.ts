import * as jsonServer from "json-server";
import path from "path";
const dataFilePath = path.join(__dirname, "..", "..", "data", "db.json");
const router = jsonServer.router(dataFilePath);

export type TCommonDbType = TMainEntityTypeList | TPermissionsType;

import {
  IMainEntityMainData,
  IPermissionsData,
  TMainEntityTypeList,
  TPermissionsType,
} from "../models/data.model";

export type TDataBase = {
  groups: IMainEntityMainData<"groups">;
  roles: IMainEntityMainData<"roles">;
  permissions: IPermissionsData;
};

export type TGroups<Key> = Key extends "groups"
  ? IMainEntityMainData<"groups">
  : never;
export type TRoles<Key> = Key extends "roles"
  ? IMainEntityMainData<"roles">
  : never;
export type TPermissions<Key> = Key extends "permissions"
  ? IPermissionsData
  : never;

class DbService {
  dataType: TCommonDbType;

  constructor(dataType: TCommonDbType) {
    this.dataType = dataType;
  }
  async getAllDB(): Promise<TDataBase> {
    return router.db.value() as TDataBase;
  }

  getDataByType<Key extends TCommonDbType>(
    dataType: Key,
  ): TPermissions<Key>[] | TGroups<Key>[] | TRoles<Key>[] {
    switch (dataType) {
      case "groups":
        return router.db.get(dataType).value() as TGroups<Key>[];
      case "roles":
        return router.db.get(dataType).value() as TRoles<Key>[];
      case "permissions":
        return router.db.get(dataType).value() as TPermissions<Key>[];
      default:
        throw new Error("Unknown data type");
    }
  }

  saveToDB<Key extends TMainEntityTypeList>(
    dataType: Key,
    data: IMainEntityMainData<Key>[],
  ): void {
    router.db.set(dataType, data).write();
  }
}

export default DbService;
