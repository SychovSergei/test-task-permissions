import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TMainEntityTypeList } from "src/app/shared/models/main-data.model";
import { ITabs } from "../../../../shared/models/tabs.interface";

@Component({
	selector: "app-tabs",
	templateUrl: "./tabs.component.html",
	styleUrls: ["./tabs.component.css"],
	standalone: true,
	imports: [CommonModule],
})
export class TabsComponent {
	@Input() title: string = "";
	@Input("tabsList") tabsList: ITabs<TMainEntityTypeList>[] = [];
	@Input("activeTabId") activeTabId: TMainEntityTypeList | null = null;

	@Output() activeTab: EventEmitter<TMainEntityTypeList> = new EventEmitter<TMainEntityTypeList>();

	constructor() {}

	selectTab(tabName: TMainEntityTypeList) {
		this.activeTab.emit(tabName);
	}
}
