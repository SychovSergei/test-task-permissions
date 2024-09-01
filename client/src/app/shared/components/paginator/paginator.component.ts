import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-paginator",
	templateUrl: "./paginator.component.html",
	styleUrls: ["./paginator.component.css"],
	standalone: true,
	imports: [CommonModule],
})
export class PaginatorComponent implements OnChanges, OnInit, OnDestroy {
	@Input("currentPage") currentPage: number = 0;
	@Input("totalItems") totalItems: number = 3;
	@Input("itemsPerPage") itemsPerPage: number = 5;
	@Output() onPageChange: EventEmitter<number> = new EventEmitter<number>();

	pages: number[] = [];
	pagesAmount: number = 0;
	currentPagesSub: Subscription = new Subscription();

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["totalItems"] || changes["itemsPerPage"]) {
			this.pagesAmount = this.getPagesAmount(this.totalItems);
			this.pages = this.getPageButtons(this.pagesAmount);
			if (this.currentPage >= this.pagesAmount) {
				this.currentPage = this.pagesAmount - 1;
				this.onPageChange.emit(this.currentPage);
			}
		}
	}
	ngOnInit(): void {
		this.currentPagesSub = this.onPageChange.subscribe(() => {
			this.pagesAmount = this.getPagesAmount(this.totalItems);
			this.pages = this.getPageButtons(this.pagesAmount);
		});
	}

	ngOnDestroy() {
		this.currentPagesSub?.unsubscribe();
	}

	setCurrentPage(pageIndex: number) {
		if (pageIndex >= 0 && pageIndex < this.pagesAmount) {
			this.currentPage = pageIndex;
			this.onPageChange.emit(pageIndex);
		}
	}

	private getPageButtons(amount: number): number[] {
		return Array.from({ length: amount }, (_, index) => index);
	}

	private getPagesAmount(length: number) {
		return Math.ceil(length / this.itemsPerPage);
	}

	pageIncrement() {
		if (this.currentPage < this.pagesAmount - 1) this.setCurrentPage(this.currentPage + 1);
	}

	pageDecrement() {
		if (this.currentPage > 0) this.setCurrentPage(this.currentPage - 1);
	}
}
