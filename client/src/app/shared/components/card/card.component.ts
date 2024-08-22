import { AfterContentInit, Component, ContentChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-card",
	templateUrl: "./card.component.html",
	styleUrls: ["./card.component.css"],
	standalone: true,
	imports: [CommonModule],
})
export class CardComponent implements AfterContentInit {
	@ContentChild("cardHeader") headerContent: ElementRef | undefined;
	@ContentChild("cardFooter") footerContent: ElementRef | undefined;
	hasHeader: boolean = false;
	hasFooter: boolean = false;

	ngAfterContentInit() {
		this.hasHeader = !!this.headerContent;
		this.hasFooter = !!this.footerContent;
	}
}
