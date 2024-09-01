import { BehaviorSubject, Observable, tap, take } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { IMainEntity, IMainEntityMainData, TMainEntityTypeList } from "src/app/shared/models/main-data.model";
import { TKeyObj } from "src/app/features/permissions/components/details/details.component";
import { ICreateDetailsData, IDetailsData } from "../../../shared/models/details.interface";

type IDataConf<T extends TMainEntityTypeList> = {
	[key in T]: IDataConfItem<key>;
};
interface IDataConfItem<T extends TMainEntityTypeList> {
	dataUrl: string;
	renameDataUrl: string;
	createDataUrl: string;
	updateDetailsUrl: string;
	dataSourceSubject: BehaviorSubject<IMainEntity<T> | null>;
}

@Injectable({
	providedIn: "root",
})
export class DataHttpService {
	dataOriginSource: IDataConf<TMainEntityTypeList> = {
		groups: {
			dataUrl: "/api/groups/all",
			createDataUrl: "/api/groups/create",
			renameDataUrl: "/api/groups/rename",
			updateDetailsUrl: "/api/groups/update-details",
			dataSourceSubject: new BehaviorSubject<IMainEntity<"groups"> | null>(null),
		},
		roles: {
			dataUrl: "/api/roles/all",
			createDataUrl: "/api/roles/create",
			renameDataUrl: "/api/roles/rename",
			updateDetailsUrl: "/api/roles/update-details",
			dataSourceSubject: new BehaviorSubject<IMainEntity<"roles"> | null>(null),
		},
	};

	constructor(private http: HttpClient) {}

	fetchData<T extends TMainEntityTypeList>(dataType: T): Observable<IMainEntity<T> | null> {
		return this.http.get<IMainEntity<T>>(this.dataOriginSource[dataType].dataUrl).pipe(
			// delay(500),
			tap((data) => this.dataOriginSource[dataType].dataSourceSubject.next(data)),
		);
	}

	private refreshData<T extends TMainEntityTypeList>(dataType: T) {
		this.http
			.get<IMainEntity<T>>(this.dataOriginSource[dataType].dataUrl)
			.pipe(take(1))
			.subscribe({
				next: (data) => {
					this.dataOriginSource[dataType].dataSourceSubject.next(data);
				},
				error: (err) => {
					console.error("Error:", err);
				},
			});
	}

	renameDataById<T extends TMainEntityTypeList>(dataType: T, id: string, newName: string): Observable<any> {
		return this.http
			.patch<IMainEntityMainData<T>>(this.dataOriginSource[dataType].renameDataUrl + `/${id}`, { newName })
			.pipe(
				tap((res) => {
					this.refreshData(dataType);
				}),
			);
	}

	createNewData<T extends TMainEntityTypeList>(
		dataType: T,
		newData: ICreateDetailsData<T>,
	): Observable<IMainEntityMainData<T>> {
		return this.http.post<IMainEntityMainData<T>>(this.dataOriginSource[dataType].createDataUrl, newData).pipe(
			tap((res) => {
				this.refreshData(dataType);
			}),
		);
	}

	updateDetailsData<T extends TMainEntityTypeList>(
		dataType: T,
		id: string,
		data: TKeyObj,
	): Observable<IDetailsData<TMainEntityTypeList>> {
		return this.http
			.patch<IDetailsData<TMainEntityTypeList>>(this.dataOriginSource[dataType].updateDetailsUrl + `/${id}`, { data })
			.pipe(
				tap((res) => {
					this.refreshData(dataType);
				}),
			);
	}
}
