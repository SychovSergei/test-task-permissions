import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TabListComponent } from "./tab-list.component";
import { RenameDirective } from "../../directives/rename.directive";

@NgModule({
	declarations: [TabListComponent],
	exports: [TabListComponent],
	imports: [CommonModule, RenameDirective],
})
export class TabListModule {}
