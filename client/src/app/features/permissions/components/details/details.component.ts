import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { delay, Subscription } from "rxjs";

import {
	DetailTypeMap,
	IDetailsDataMain,
	IMainEntityDetails,
	IMainEntity,
	TMainEntityTypeList,
} from "../../../../shared/models/main-data.model";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { CheckboxComponent } from "../../../../shared/components/checkbox/checkbox.component";
import { InputComponent } from "../../../../shared/components/input/input.component";
import { SelectorComponent } from "../../../../shared/components/selector/selector.component";
import { PaginatorComponent } from "../../../../shared/components/paginator/paginator.component";
import { ICreateDetailsData, IDetailsData, IDetailsMappedData } from "../../../../shared/models/details.interface";

enum EFilterType {
	ALL = "all",
	MARKED = "marked",
	LABEL = "label",
}
export type TKeyObj = Record<string, boolean>;

class CreateDataDTO implements ICreateDetailsData<TMainEntityTypeList> {
	name: string;
	dataNames: IMainEntityDetails<TMainEntityTypeList>["dataNames"];
	dataTypeName: IMainEntity<TMainEntityTypeList>["details"]["dataTypeName"];
	detailsType: DetailTypeMap[TMainEntityTypeList];
	detailsData: IDetailsDataMain[];

	constructor(initialData: IDetailsData<TMainEntityTypeList>, formData: { name: string; items: TKeyObj }) {
		this.name = formData.name;
		this.dataTypeName = initialData.dataTypeName;
		this.dataNames = initialData.dataNames;
		this.detailsType = initialData.detailsType;
		this.detailsData = initialData.detailsData.map((item) => {
			return { id: item.id, selected: formData.items[item.id] };
		});
	}
}

@Component({
	selector: "app-details",
	templateUrl: "./details.component.html",
	styleUrls: ["./details.component.css"],
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InputComponent,
		SelectorComponent,
		CheckboxComponent,
		ButtonComponent,
		PaginatorComponent,
	],
})
export class DetailsComponent implements OnChanges, OnInit {
	@Input("data") data: IDetailsData<TMainEntityTypeList> | null = null;
	@Input("createMode") createMode: boolean = false;
	@Output() createItem: EventEmitter<ICreateDetailsData<TMainEntityTypeList>> = new EventEmitter();
	@Output() updateItem: EventEmitter<TKeyObj> = new EventEmitter();

	detailsForm: FormGroup = new FormGroup<any>({});
	/** initial mapped date - converted to array */
	currentDetailsMappedData: IDetailsMappedData[] = [];
	/** data for view in template */
	filteredData: IDetailsMappedData[] | null = null;
	/** this is started data for compare with further changes */
	startData: Record<string, boolean> = {};
	isChangedValue: boolean = false;
	isDisabled: boolean = false;

	/** pagination variables */
	currentPageNumber: number = 0;
	itemsPerPage: number = 3;
	currentLengthData: number = 0;

	/** filter selector options */
	filterOptions: { label: string; value: string }[] = [
		{ label: "Show All", value: EFilterType.ALL },
		{ label: "Marked Roles", value: EFilterType.MARKED },
		{ label: "Label", value: EFilterType.LABEL },
	];

	private itemSubscriptions: Array<Subscription | undefined> = [];

	constructor(private server: HttpClient) {
		this.detailsForm = new FormGroup({
			filters: new FormGroup({
				label: new FormControl(""),
				type: new FormControl(EFilterType.ALL),
			}),
			items: new FormGroup({}),
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes["createMode"]) {
			this.createMode
				? this.detailsForm.addControl("name", new FormControl("", [Validators.required, Validators.minLength(2)]))
				: this.detailsForm.removeControl("name");
		}
		this.currentPageNumber = 0;
		this.isChangedValue = false;
		this.isDisabled = false;

		this.currentDetailsMappedData = this.getMappedData(this.data, this.createMode);

		if (this.currentDetailsMappedData.length) {
			this.initFormValues(this.currentDetailsMappedData);
			this.initItemsStartValues(this.currentDetailsMappedData);
		}

		this.unsubscribeToItemsChange();
		this.subscribeToItemsChange();

		this.applyFilters();
	}

	ngOnInit() {
		this.currentPageNumber = 0;
		this.detailsForm
			.get("filters.label")
			?.valueChanges.pipe(delay(500))
			.subscribe((val) => {
				this.applyFilters();
			});
		this.detailsForm.get("filters.type")?.valueChanges.subscribe((val) => {
			this.currentPageNumber = 0;
			this.applyFilters();
		});
		this.subscribeToItemsChange();

		this.applyFilters();
	}

	ngOnDestroy() {
		this.itemSubscriptions?.forEach((item) => item?.unsubscribe());
	}

	applyFilters() {
		const data = this.applyFilterByCriteria(this.currentDetailsMappedData);
		this.currentLengthData = data.length;
		this.filteredData = this.applyFilterByPages(data, this.currentPageNumber);
	}

	private applyFilterByPages(data: IDetailsMappedData[], currentPageNumber: number): IDetailsMappedData[] {
		const offset: number = currentPageNumber * this.itemsPerPage;
		const res: IDetailsMappedData[] = [];
		data.forEach((item, index) => {
			if (index >= offset && index < offset + this.itemsPerPage) res.push(item);
		});
		return res;
	}

	private applyFilterByCriteria(data: IDetailsMappedData[]): IDetailsMappedData[] {
		const nameFilter = (this.detailsForm.get("filters.label")?.value as string).toLowerCase();
		const typeFilter = this.detailsForm.get("filters.type")?.value as EFilterType;

		return data.filter((item) => {
			if (typeFilter === EFilterType.LABEL) {
				return item.label.toLowerCase().includes(nameFilter);
			} else if (typeFilter === EFilterType.MARKED) {
				return item.selected;
			} else {
				return item;
			}
		});
	}

	private initFormValues(data: IDetailsMappedData[]) {
		const itemsControls = this.detailsForm.get("items") as FormGroup;
		/** clear all items from control */
		Object.keys(itemsControls.controls).forEach((key) => {
			itemsControls.removeControl(key);
		});
		/** add new items to control */
		data.forEach((item) => {
			itemsControls.addControl(item.id, new FormControl(item.selected));
		});
		if (this.createMode) {
			const nameControl = this.detailsForm.get("name") as FormControl;
			nameControl.setValue("");
		}
	}

	submitForm() {
		this.isDisabled = true;
		if (this.createMode) {
			// const createDto: ICreateDetailsData<TMainEntityTypeList> = new CreateDataDTO(this.data!, this.detailsForm.getRawValue());
			this.createItem.emit(new CreateDataDTO(this.data!, this.detailsForm.getRawValue()));
		} else {
			const updateData: TKeyObj = this.detailsForm.get("items")?.value as TKeyObj;
			this.updateItem.emit(updateData);
		}
	}

	private getMappedData(data: IDetailsData<TMainEntityTypeList> | null, createMode: boolean): IDetailsMappedData[] {
		let mappedInitialData: IDetailsMappedData[] = [];

		if (data && data.dataNames) {
			const indexSet: Set<string> = new Set();
			const indexNamesSet: Set<string> = new Set<string>(Object.keys(data.dataNames));

			if (data.detailsData) {
				if (indexNamesSet.size >= data.detailsData.length) {
					mappedInitialData = data.detailsData.map((item) => {
						indexSet.add(item.id);
						return {
							id: item.id,
							selected: createMode ? false : item.selected,
							isNew: false,
							label: data.dataNames[item.id] || "empty",
						} as IDetailsMappedData;
					});
					const diffSet = this.getSetsDifference(indexNamesSet, indexSet);
					if (diffSet.size > 0) {
						diffSet.forEach((itemId) => {
							mappedInitialData?.push({
								id: itemId,
								selected: false,
								isNew: true,
								label: data.dataNames[itemId],
							});
						});
					}
				}
			}
		}
		return mappedInitialData;
	}

	private getSetsDifference(setSource: Set<string>, set2: Set<string>): Set<string> {
		if (setSource.size >= set2.size) {
			set2.forEach((item) => {
				if (setSource.has(item)) {
					setSource.delete(item);
				}
			});
		}
		return setSource;
	}

	/** called from paginator after page number change */
	onPageChange(currPageNumber: number) {
		this.currentPageNumber = currPageNumber;
		this.filteredData = this.applyFilterByPages(
			this.applyFilterByCriteria(this.currentDetailsMappedData),
			this.currentPageNumber,
		);
	}
	private unsubscribeToItemsChange() {
		this.itemSubscriptions.forEach((item) => item?.unsubscribe());
	}

	private subscribeToItemsChange() {
		this.currentDetailsMappedData?.forEach((item) => {
			this.itemSubscriptions.push(
				(() => {
					const controlName = `items.${item.id}`;
					const control = this.detailsForm.get(controlName);

					return control?.valueChanges.subscribe((val) => {
						const id = controlName.split(".")[1];
						const itemsValue = this.detailsForm.get("items")?.getRawValue();

						if (this.isRecordStringBoolean(itemsValue)) {
							this.updateMappedData(id, val);
							this.isChangedValue = this.isItemsChanged(this.startData, itemsValue);
						}
						this.filteredData = this.applyFilterByPages(
							this.applyFilterByCriteria(this.currentDetailsMappedData),
							this.currentPageNumber,
						);
					});
				})(),
			);
		});
	}

	private updateMappedData(id: string, val: boolean) {
		this.currentDetailsMappedData?.map((item) => {
			return item.id === id ? (item.selected = val) : item;
		});
	}
	private isRecordStringBoolean(val: any): val is TKeyObj {
		if (typeof val !== "object" || val === null) return false;
		return Object.values(val).every((item) => typeof item === "boolean");
	}
	private initItemsStartValues(data: IDetailsMappedData[]) {
		data.forEach((item) => (this.startData[item.id] = item.selected));
	}
	private isItemsChanged(a: TKeyObj, b: TKeyObj): boolean {
		let isChanged: boolean = false;
		for (const valKey in a) {
			if (b[valKey] !== a[valKey]) {
				isChanged = true;
			}
		}
		return isChanged;
	}
}
