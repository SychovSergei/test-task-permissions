import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
// import { animate, state, style, transition, trigger } from "@angular/animations";

import { IMainEntity, IMainEntityMainData, TMainEntityTypeList } from "../../../../shared/models/main-data.model";

@Component({
	selector: "app-tab-list",
	templateUrl: "./tab-list.component.html",
	styleUrls: ["./tab-list.component.css"],
	// animations: [
	// 	trigger("toggleHeight", [
	// 		state(
	// 			"collapsed",
	// 			style({
	// 				maxHeight: "0",
	// 				// overflow: "hidden",
	// 			}),
	// 		),
	// 		state(
	// 			"expanded",
	// 			style({
	// 				maxHeight: "500px",
	// 			}),
	// 		),
	// 		transition("collapsed <=> expanded", [animate("1s")]),
	// 	]),
	// ],
})
export class TabListComponent implements OnInit {
	@Input("data") mainData: IMainEntity<TMainEntityTypeList> | null = null;
	@Input("activeItemId") activeItemId: string = "";
	@Output() onSelectItemId: EventEmitter<string> = new EventEmitter<string>();
	@Output() onRenameItemId: EventEmitter<{ id: string; name: string }> = new EventEmitter<{
		id: string;
		name: string;
	}>();

	isSmallScreen: boolean = false;

	@HostListener("window:resize", ["$event"])
	onResize(event: Event) {
		this.isSmallScreen = window.innerWidth < 768; // Example breakpoint
	}

	ngOnInit(): void {
		this.isSmallScreen = window.innerWidth < 768;
	}

	trackByFn(index: number, item: IMainEntityMainData<TMainEntityTypeList>): string {
		return item.id;
	}

	showDetails(id: string) {
		if (this.activeItemId !== id) {
			this.activeItemId = id;
			this.onSelectItemId.emit(id);
		}
	}

	renameItem(newName: string) {
		this.onRenameItemId.emit({ id: this.activeItemId, name: newName });
	}
}
