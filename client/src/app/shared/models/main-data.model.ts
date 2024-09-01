export type TMainEntityTypeList = "groups" | "roles";

export type DetailTypeMap = {
	groups: "roles";
	roles: "permissions";
};

export interface IMainEntity<MainType extends TMainEntityTypeList> {
	mainDataType: MainType;
	mainData: IMainEntityMainData<MainType>[];
	details: IMainEntityDetails<MainType>;
}

export interface IMainEntityMainData<T extends TMainEntityTypeList> {
	id: string;
	name: string;
	detailsType: DetailTypeMap[T];
	detailsData: IDetailsDataMain[];
}

export interface IDetailsDataMain {
	id: string;
	selected: boolean;
}

export type IDetailsDataNames = Record<string, string>;

export interface IMainEntityDetails<T extends TMainEntityTypeList> {
	type: DetailTypeMap[T];
	dataTypeName: string;
	dataNames: IDetailsDataNames;
}
