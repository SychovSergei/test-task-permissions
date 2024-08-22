import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CommonModule } from "@angular/common";

type TInputType = "text" | "password" | "email" | "number";

@Component({
	selector: "app-input",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.css"],
	standalone: true,
	imports: [CommonModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputComponent),
			multi: true,
		},
	],
})
export class InputComponent implements ControlValueAccessor {
	@Input() placeholder: string = "";
	@Input() type: TInputType = "text";
	@Input() errorText: string | null = null;

	value: string = "";
	onChange: (value: string) => void = () => {};
	onTouched: () => void = () => {};

	writeValue(value: any) {
		this.value = value;
	}
	registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}
	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}
	setDisabledState(isDisabled: boolean): void {
		// disabled state
	}

	onInput(event: Event) {
		const input = event.target as HTMLInputElement;
		this.value = input.value;
		this.onChange(this.value);
	}
}
