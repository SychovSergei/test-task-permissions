import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { RenameComponent } from "./rename.component";
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { InputComponent } from "../../../../shared/components/input/input.component";

@NgModule({
	declarations: [RenameComponent],
	exports: [RenameComponent],
	imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
})
export class RenameModule {}
