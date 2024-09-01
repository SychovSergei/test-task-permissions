import { Injectable } from "@angular/core";

type ILocalData<Key extends string, Data> = Partial<Record<Key, Data>>;

@Injectable({
	providedIn: "root",
})
export class LocalStorageService {
	setData<T extends string, Data>(key: string, data: ILocalData<T, Data>) {
		const oldData = localStorage.getItem(key);
		let parsedData: ILocalData<T, Data> | null = null;
		if (oldData) {
			parsedData = { ...(JSON.parse(oldData) as ILocalData<T, Data>) };
		}
		localStorage.setItem(key, JSON.stringify({ ...parsedData, ...data }));
	}

	getData<T extends string, Data>(key: string, keySource: T): Data | null {
		const currItems = localStorage.getItem(key);
		if (currItems !== null) {
			const parsedData = JSON.parse(currItems) as ILocalData<T, Data>;
			if (!parsedData[keySource]) {
				return null;
			}
			return parsedData[keySource] as Data;
		}
		return null;
	}
}
