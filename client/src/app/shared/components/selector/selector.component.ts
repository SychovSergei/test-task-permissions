import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CommonModule } from "@angular/common";

export interface ISelector {
	label: string;
	value: string;
}

@Component({
	selector: "app-selector",
	templateUrl: "./selector.component.html",
	styleUrls: ["./selector.component.css"],
	standalone: true,
	imports: [CommonModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SelectorComponent),
			multi: true,
		},
	],
})
export class SelectorComponent implements ControlValueAccessor {
	@Input("options") options: ISelector[] = [];

	selectedValue: string = "";
	onChange: (value: string) => void = (value: string) => {};

	onTouched: () => void = () => {};

	writeValue(value: string): void {
		this.selectedValue = value;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	onChangeValue(event: Event) {
		const input = event.target as HTMLSelectElement;
		this.selectedValue = input.value;
		this.onChange(this.selectedValue);
	}
}
