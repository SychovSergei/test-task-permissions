import { TMainEntityTypeList } from "./main-data.model";

export interface ITabs<T extends TMainEntityTypeList> {
	id: T;
	tabName: string;
	dataType: T;
}
