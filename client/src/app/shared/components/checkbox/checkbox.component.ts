import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-checkbox",
	templateUrl: "./checkbox.component.html",
	styleUrls: ["./checkbox.component.css"],
	standalone: true,
	imports: [CommonModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CheckboxComponent),
			multi: true,
		},
	],
})
export class CheckboxComponent implements ControlValueAccessor {
	@Input() checked: boolean = false;
	@Input() id: string = "";
	onChange: (value: boolean) => void = () => {};
	onTouched: () => void = () => {};

	writeValue(value: any) {
		this.checked = value;
	}
	registerOnChange(fn: (value: boolean) => void): void {
		this.onChange = fn;
	}
	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}
	setDisabledState(isDisabled: boolean): void {
		// disabled state
	}

	onCheckboxChange(event: Event) {
		const input = event.target as HTMLInputElement;
		this.checked = input.checked;
		this.onChange(this.checked);
	}

	onSpanClick() {
		this.checked = !this.checked;
		this.onChange(this.checked);
	}
}
