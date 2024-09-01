import {
	IDetailsDataMain,
	IMainEntity,
	IMainEntityDetails,
	IMainEntityMainData,
	TMainEntityTypeList,
} from "./main-data.model";

export interface IDetailsData<T extends TMainEntityTypeList> extends IMainEntityMainData<TMainEntityTypeList> {
	dataTypeName: IMainEntity<T>["details"]["dataTypeName"];
	dataNames: IMainEntityDetails<TMainEntityTypeList>["dataNames"];
}

export interface IDetailsMappedData extends IDetailsDataMain {
	isNew: boolean;
	label: string;
}

export type ICreateDetailsData<T extends TMainEntityTypeList> = Omit<IDetailsData<T>, "id">;
