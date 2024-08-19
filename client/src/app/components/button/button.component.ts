import { Component, EventEmitter, Input, Output } from "@angular/core";

type TButtonType = "button" | "submit" | "reset";

@Component({
	selector: "app-button",
	templateUrl: "./button.component.html",
	styleUrls: ["./button.component.css"],
})
export class ButtonComponent {
	@Input() label: string = "";
	@Input() type: TButtonType = "button";
	@Input() disabled: boolean = false;

	@Input() buttonType: "primary" | "secondary" | "custom" = "secondary";
	@Input() customColor: string = "";
	@Input() customBgColor: string = "";

	@Output() buttonClick: EventEmitter<any> = new EventEmitter<any>();
}
