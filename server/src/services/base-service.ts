import { v4 as uuidv4 } from "uuid";
import {
  TDetailsDataValues,
  IMainEntityMainData,
  IMainEntityMainDataCreate,
  TMainEntityTypeList,
} from "../models/data.model";
import axios from "axios";

import { jsonServerConfig } from "../config/config";

export abstract class BaseService<Key extends TMainEntityTypeList> {
  protected dataType: Key;

  protected constructor(dataType: Key) {
    this.dataType = dataType;
  }

  async add(newItem: IMainEntityMainDataCreate<Key>) {
    const newIt: IMainEntityMainData<Key> = {
      id: uuidv4(),
      name: newItem.name,
      detailsType: newItem.detailsType,
      detailsData: newItem.detailsData,
    };
    const newItemResponse = await axios.post(
      `/api-json/${this.dataType}`,
      newIt,
      jsonServerConfig,
    );
    return newItemResponse.data;
  }

  async rename(id: string, newName: string) {
    const res = await axios.patch<IMainEntityMainData<Key>>(
      `/api-json/${this.dataType}/${id}`,
      { name: newName },
      jsonServerConfig,
    );
    return res.data;
  }

  async updateDetails(id: string, details: TDetailsDataValues) {
    const response = await axios.get<IMainEntityMainData<Key>>(
      `/api-json/${this.dataType}/${id}`,
      jsonServerConfig,
    );
    const detailsSet = new Set<string>(Object.keys(details));
    const updatedDetailsData = response.data.detailsData.map((item) => {
      item.selected = details[item.id];
      if (detailsSet.has(item.id)) {
        detailsSet.delete(item.id);
      }
      return item;
    });
    if (detailsSet.size > 0) {
      detailsSet.forEach((itemId) => {
        updatedDetailsData.push({ id: itemId, selected: details[itemId] });
      });
    }
    const resp = await axios.patch<IMainEntityMainData<Key>>(
      `/api-json/${this.dataType}/${id}`,
      { detailsData: updatedDetailsData },
      jsonServerConfig,
    );
    return resp.data;
  }
}
