export type TMainEntityTypeList = "groups" | "roles";
export type TPermissionsType = "permissions";

export interface IPermissionsData {
  id: string;
  name: string;
}

export type DetailTypeMap = {
  groups: "roles";
  roles: "permissions";
};

export interface IMainEntity<T extends TMainEntityTypeList> {
  mainDataType: T;
  mainData: IMainEntityMainData<T>[];
  details: IMainEntityDetails<T>;
}

export interface IMainEntityMainData<T extends TMainEntityTypeList> {
  id: string;
  name: string;
  detailsType: DetailTypeMap[T];
  detailsData: IDetailsData[];
}

export type IMainEntityMainDataCreate<T extends TMainEntityTypeList> = Omit<
  IMainEntityMainData<T>,
  "id"
>;
export interface IMainEntityMainDataRename {
  newName: string;
}

export interface IMainEntityDetails<T extends TMainEntityTypeList> {
  type: DetailTypeMap[T];
  dataTypeName: string;
  dataNames: TDetailsDataNames;
}

export interface IDetailsData {
  id: string;
  selected: boolean;
}

export type TDetailsDataNames = Record<string, string>;
export type TDetailsDataValues = Record<string, boolean>;
