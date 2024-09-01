import {
  DetailTypeMap,
  IDetailCommonData,
  TDetailsDataNames,
  TMainEntityTypeList,
} from "./data.model";

export class DtoUtils {
  static getDependentDetailTypeOf<K extends TMainEntityTypeList>(key: K) {
    const detailTypeMap: DetailTypeMap = {
      groups: "roles",
      roles: "permissions",
    };
    return detailTypeMap[key];
  }

  static getDetailNames(data: IDetailCommonData[]): TDetailsDataNames {
    const names: TDetailsDataNames = {};
    data.forEach((item) => (names[item.id] = item.name));
    return names;
  }
}
