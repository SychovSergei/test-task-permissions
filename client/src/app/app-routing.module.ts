import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PermissionsComponent } from "./features/permissions/permissions.component";

const routes: Routes = [
	{
		path: "",
		redirectTo: "/permissions",
		pathMatch: "full",
	},
	{
		path: "permissions",
		component: PermissionsComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
