import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";

import {
	IDetailsDataMain,
	IMainEntity,
	IMainEntityMainData,
	TMainEntityTypeList,
} from "src/app/shared/models/main-data.model";
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { TKeyObj } from "src/app/features/permissions/components/details/details.component";
import { DataHttpService } from "src/app/features/permissions/services/data-http.service";
import { ITabs } from "../../shared/models/tabs.interface";
import { ICreateDetailsData, IDetailsData } from "../../shared/models/details.interface";

@Component({
	selector: "app-permissions",
	templateUrl: "./permissions.component.html",
	styleUrls: ["./permissions.component.css"],
})
export class PermissionsComponent implements OnInit {
	title = "Permissions";

	currentTabIdSubject: Subject<TMainEntityTypeList> = new Subject();
	currentTabId: TMainEntityTypeList = "groups";

	currentItemIdSubject: Subject<string> = new Subject();
	currentItemId: string = "";

	tabsData: ITabs<TMainEntityTypeList>[] = [
		{
			id: "groups",
			tabName: "Groups",
			dataType: "groups",
		},
		{
			id: "roles",
			tabName: "Roles",
			dataType: "roles",
		},
	];

	currentTabData: IMainEntity<TMainEntityTypeList> | null = null;
	currentTabDataName: string = "";
	currentDetailsData: IDetailsData<TMainEntityTypeList> | null = null;

	/** tab list where actions will appear  */
	private showActionButtonsList: TMainEntityTypeList[] = ["groups", "roles"];
	/** this value get ability to show action buttons in active tab */
	isShowActionButtons: boolean = false;

	isLoading: boolean = false;

	createMode: boolean = false;

	constructor(
		private dataHttpService: DataHttpService,
		private localStorageService: LocalStorageService,
	) {}

	ngOnInit() {
		/** SUBSCRIBE TO GET GROUPS */
		this.dataHttpService.dataOriginSource.groups.dataSourceSubject.subscribe({
			next: (val) => {
				this.currentTabData = val;
				this.currentDetailsData = this.getCurrentDetailsById(this.currentItemId);
			},
		});
		/** SUBSCRIBE TO GET ROLES */
		this.dataHttpService.dataOriginSource.roles.dataSourceSubject.subscribe({
			next: (val) => {
				this.currentTabData = val;
				this.currentDetailsData = this.getCurrentDetailsById(this.currentItemId);
			},
		});

		/** subscribe to TAB changes */
		this.currentTabIdSubject.subscribe(async (actTabId: TMainEntityTypeList) => {
			/** GET DATA  */
			this.isLoading = true;
			this.currentTabDataName = this.tabsData.find((item) => item.id === actTabId)?.tabName || "";

			this.dataHttpService.fetchData<TMainEntityTypeList>(actTabId).subscribe((data) => {
				this.isLoading = false;
				this.currentTabId = actTabId;
				this.currentTabData = data;
				this.isShowActionButtons = this.showActionButtonsList.includes(actTabId);

				/** Assign initial itemId */
				if (data) {
					this.currentItemIdSubject.next(this.getOrCalcCurrentItemId(data));
				}
			});
		});

		/** subscribe to ITEM changes */
		this.currentItemIdSubject.subscribe((itemId) => {
			if (itemId === "add-new-item") {
				this.createMode = true;
				this.currentItemId = itemId;
				/** create new details list with falsy selected values */
				this.currentDetailsData = this.createNewDetailsList();
			} else {
				this.createMode = false;
				this.currentItemId = itemId;
				this.localStorageService.setData<TMainEntityTypeList, string>("currItems", { [this.currentTabId]: itemId });
				this.currentDetailsData = this.getCurrentDetailsById(this.currentItemId);
			}
		});

		/** set initial TAB - "groups" as initial value.
		 *  Further it will check localStorage before assign value*/
		this.setOrGetActiveTab("groups");
	}

	/** set active tab by clicking button */
	setActiveTab(activeTab: TMainEntityTypeList) {
		this.currentTabIdSubject.next(activeTab);
		this.localStorageService.setData<"curr-tab", string>("currTab", { "curr-tab": activeTab });
	}

	private getCurrentDetailsById(currentItemIdValue: string): IDetailsData<TMainEntityTypeList> | null {
		const data: IMainEntityMainData<TMainEntityTypeList> | null =
			this.currentTabData?.mainData.find((item) => item.id === currentItemIdValue) || null;

		if (data && this.currentTabData) {
			const { dataTypeName, dataNames } = this.currentTabData.details;
			return { ...data, dataTypeName, dataNames } as IDetailsData<TMainEntityTypeList>;
		} else {
			return null;
		}
	}

	/** create details data and assign 'false' values to all 'selected' items */
	private createNewDetailsList(): IDetailsData<TMainEntityTypeList> | null {
		const obj: IDetailsDataMain[] = [];
		/** fill all items with falsy values */
		for (const key in this.currentTabData?.details.dataNames) {
			obj.push({ id: key, selected: false } as IDetailsDataMain);
		}

		if (this.currentTabData) {
			const { type, dataNames, dataTypeName } = this.currentTabData.details;
			return {
				name: "New Name",
				detailsType: type,
				detailsData: obj,
				dataNames: dataNames,
				dataTypeName: dataTypeName,
			} as IDetailsData<typeof this.currentTabData.mainDataType>;
		}
		return null;
	}

	private setOrGetActiveTab(activeTab: TMainEntityTypeList) {
		const tabValue = this.localStorageService.getData<"curr-tab", TMainEntityTypeList>("currTab", "curr-tab"); //"curr-tab"
		if (tabValue === null) {
			this.localStorageService.setData<"curr-tab", string>("currTab", { "curr-tab": activeTab });
			this.currentTabIdSubject.next(activeTab);
		} else {
			this.currentTabIdSubject.next(tabValue as TMainEntityTypeList);
		}
	}

	setCurrentItem(currItemId: string) {
		this.currentItemIdSubject.next(currItemId);
	}

	/** Check value exists in local storage. If does not exist =>  */
	getOrCalcCurrentItemId(data: IMainEntity<TMainEntityTypeList>): string {
		/** check existing tab value in the local storage */
		const tabValue = this.localStorageService.getData<"curr-tab", TMainEntityTypeList>("currTab", "curr-tab");
		let itemIdValue: string | null = null;
		/** check existing itemId value of the tab in the local storage
		 *  If tab exists => check existing itemId value in the local storage */
		if (tabValue) {
			itemIdValue = this.localStorageService.getData<TMainEntityTypeList, string>("currItems", tabValue);
		}

		/** if itemId exists => return it */
		if (itemIdValue !== null) {
			/** check if itemId incorrect => get first item from the list*/
			const isExistsItemId = this.currentTabData?.mainData.find((item) => item.id === itemIdValue);
			return !isExistsItemId ? this.getFirstItemIdFromData(data) : itemIdValue;
		} else {
			/** if itemId does not exist => calculate it */
			/** at the first fetch data, if itemId does not exist => get first itemId from the item list */
			return this.getFirstItemIdFromData(data);
		}
	}
	private getFirstItemIdFromData(data: IMainEntity<TMainEntityTypeList>): string {
		return data.mainData.length ? data.mainData[0].id : "";
	}

	createDetails(newItemData: ICreateDetailsData<TMainEntityTypeList>) {
		if (this.currentTabId && this.currentTabData) {
			this.dataHttpService.createNewData(this.currentTabId, newItemData).subscribe((data) => {
				this.setCurrentItem(data.id);
			});
		}
	}

	updateDetails(detailsData: TKeyObj) {
		this.dataHttpService.updateDetailsData(this.currentTabId, this.currentItemId, detailsData).subscribe((res) => {
			// console.log(res);
		});
	}

	renameItem(event: { id: string; name: string }) {
		const { id, name } = event;
		if (this.currentTabData) {
			this.dataHttpService.renameDataById(this.currentTabData.mainDataType, id, name).subscribe((data) => {
				// console.log(data);
			});
		}
	}

	actionCreate(addNewItem: string) {
		this.createMode = true;
		this.currentItemId = addNewItem;
		this.localStorageService.setData<TMainEntityTypeList, string>("currItems", { [this.currentTabId]: addNewItem });
	}
}
