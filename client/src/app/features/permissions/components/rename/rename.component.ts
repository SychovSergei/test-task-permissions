import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: "app-rename",
	templateUrl: "./rename.component.html",
	styleUrls: ["./rename.component.css"],
})
export class RenameComponent implements OnChanges, OnInit {
	@Input("initialText") initialText: string = "";
	@Output() cancelEvent: EventEmitter<void> = new EventEmitter<void>();
	@Output() renameEvent: EventEmitter<string> = new EventEmitter<string>();

	renameForm: FormGroup;
	currentValue: string = "";
	isDisabled: boolean = true;

	constructor() {
		this.renameForm = new FormGroup({
			rename: new FormControl(this.initialText, [Validators.required, Validators.minLength(2)]),
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes["initialText"]) {
			// this.renameForm.controls[this.initialText]?.setValue("mmmmmm");
		}
	}
	ngOnInit() {
		this.initialText = this.renameForm.controls["rename"].value;
		this.renameForm.controls["rename"].valueChanges.subscribe((val) => {
			this.currentValue = val;
			this.isDisabled = this.currentValue === this.initialText;
		});
	}

	cancel() {
		this.cancelEvent.emit();
	}

	rename() {
		this.renameEvent.emit(this.currentValue);
	}
}
