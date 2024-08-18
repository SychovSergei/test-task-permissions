import { v4 as uuidv4 } from "uuid";
import DbService from "./db-service";
import {
  DetailTypeMap,
  TDetailsDataValues,
  IMainEntityMainData,
  IMainEntityMainDataCreate,
  TMainEntityTypeList,
  TDetailsDataNames,
} from "../models/data.model";

export abstract class BaseService<Key extends TMainEntityTypeList> {
  protected items: IMainEntityMainData<Key>[] = [];
  protected dbService: DbService;
  protected dataType: Key;

  protected constructor(dataType: Key) {
    this.dataType = dataType;
    this.dbService = new DbService(this.dataType);
    this.items = this.dbService.getDataByType<Key>(
      this.dataType,
    ) as unknown as IMainEntityMainData<Key>[];
  }

  async addEntity(newItem: IMainEntityMainDataCreate<Key>) {
    const newIt: IMainEntityMainData<Key> = {
      id: uuidv4(),
      name: newItem.name,
      detailsType: newItem.detailsType,
      detailsData: newItem.detailsData,
    };
    this.items.push(newIt);
    this.dbService.saveToDB(this.dataType, this.items);
    return newItem;
  }
  async renameEntity(id: string, newName: string) {
    const item = this.items.find((item) => item["id"] === id);
    if (item) {
      item["name"] = newName;
      this.dbService.saveToDB(this.dataType, this.items);
    }
    return item;
  }

  async updateDetails(id: string, details: TDetailsDataValues) {
    const item = this.items.find((item) => item["id"] === id);

    if (item) {
      const idsSet: Set<string> = new Set(Object.keys(details));
      item.detailsData = item.detailsData.map((currItem) => {
        currItem.selected = details[currItem.id];
        if (idsSet.has(currItem.id)) idsSet.delete(currItem.id);
        return currItem;
      });
      if (idsSet.size > 0) {
        idsSet.forEach((setItem) => {
          item.detailsData.push({ id: setItem, selected: details[setItem] });
        });
      }
    }
    this.dbService.saveToDB(this.dataType, this.items);
    return item;
  }
}

export function getDetailTypeOf<K extends TMainEntityTypeList>(key: K) {
  const detailTypeMap: DetailTypeMap = {
    groups: "roles",
    roles: "permissions",
  };
  return detailTypeMap[key];
}
export function getDetailNames<Key extends TMainEntityTypeList>(
  data: IMainEntityMainData<Key>[],
): TDetailsDataNames {
  const names: TDetailsDataNames = {};
  data.forEach((item) => (names[item.id] = item.name));
  return names;
}
