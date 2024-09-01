import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PermissionsComponent } from "./permissions.component";
import { TabListModule } from "src/app/features/permissions/components/tab-list/tab-list.module";
import { TabsComponent } from "./components/tabs/tabs.component";
import { CardComponent } from "../../shared/components/card/card.component";
import { RenameModule } from "./components/rename/rename.module";
import { DetailsComponent } from "./components/details/details.component";
import { ButtonComponent } from "../../shared/components/button/button.component";

@NgModule({
	declarations: [PermissionsComponent],
	imports: [CommonModule, TabsComponent, TabListModule, CardComponent, RenameModule, DetailsComponent, ButtonComponent],
	exports: [PermissionsComponent, CardComponent],
})
export class PermissionsModule {}
