import {
	ComponentRef,
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Inject,
	Input,
	Output,
	Renderer2,
	ViewContainerRef,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { RenameComponent } from "src/app/features/permissions/components/rename/rename.component";

@Directive({
	selector: "[appRename]",
	standalone: true,
})
export class RenameDirective {
	@Input("appRenameSourceData") sourceData?: string = "";
	@Output() appRenameActionRename: EventEmitter<string> = new EventEmitter<string>();

	private componentRef: ComponentRef<RenameComponent> | null = null;
	private renameBlock: HTMLElement | null = null;
	private parentEl: HTMLElement | null = null;
	private div: HTMLElement | null = null;
	constructor(
		private el: ElementRef,
		private render: Renderer2,
		private viewContRef: ViewContainerRef,
		@Inject(DOCUMENT) private document: Document,
	) {}

	removeComponent() {
		if (this.componentRef) {
			this.componentRef.destroy();
			this.componentRef = null;
			this.render.removeChild(this.parentEl, this.div);
			this.render.removeClass(this.el.nativeElement, "hidden");
		}
		this.document.removeEventListener("click", this.onDocumentClick.bind(this));
	}

	onDocumentClick(event: MouseEvent): void {
		if (this.componentRef && !this.componentRef.location.nativeElement.contains(event.target)) {
			this.removeComponent();
		}
	}

	@HostListener("click", ["$event"]) myClick(event: Event) {
		event.stopPropagation();

		this.parentEl = this.el.nativeElement.parentElement;
		if (this.parentEl) {
			this.render.addClass(this.el.nativeElement, "hidden");

			this.div = this.render.createElement("div");
			this.render.addClass(this.div, "rename-block");
			this.render.setStyle(this.div, "position", "absolute");
			this.render.setStyle(this.div, "z-index", "100");
			this.render.setStyle(this.div, "top", "0");
			this.render.setStyle(this.div, "bottom", "0");
			this.render.setStyle(this.div, "left", "0");
			this.render.setStyle(this.div, "right", "0");

			this.render.appendChild(this.parentEl, this.div);

			this.renameBlock = this.parentEl.querySelector(".rename-block");

			if (this.renameBlock) {
				this.componentRef = this.viewContRef.createComponent(RenameComponent);
				this.componentRef.instance.renameForm.controls["rename"]?.setValue(this.sourceData);
				this.render.appendChild(this.renameBlock, this.componentRef.location.nativeElement);

				this.componentRef.instance.cancelEvent.subscribe(() => {
					this.removeComponent();
				});

				this.componentRef.instance.renameEvent.subscribe((newString: string) => {
					this.appRenameActionRename.emit(newString);
					this.removeComponent();
				});

				this.document.addEventListener("click", this.onDocumentClick.bind(this));
			}
		}
	}
}
