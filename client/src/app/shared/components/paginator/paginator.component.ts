import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
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

	currentPageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	pages: number[] = [];
	pagesAmount: number = 0;
	currentPagesSub: Subscription = new Subscription();

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["totalItems"]) {
			this.pagesAmount = this.getPagesAmount(this.totalItems);
			this.pages = this.getPageButtons(this.pagesAmount);
		}
	}
	ngOnInit(): void {
		this.currentPagesSub = this.currentPageSubject.subscribe((val) => {
			this.currentPage = val;
			this.onPageChange.emit(this.currentPage);
		});
	}

	ngOnDestroy() {
		this.currentPagesSub?.unsubscribe();
	}

	setCurrentPage(pageIndex: number) {
		this.currentPageSubject.next(pageIndex);
	}

	getPageButtons(amount: number): number[] {
		const pages: number[] = [];
		for (let i = 0; i < amount; i++) {
			pages.push(i);
		}
		return pages;
	}

	/** get the amount of pages */
	private getPagesAmount(length: number) {
		const rest: number = length % this.itemsPerPage;
		let amount = 0;
		amount = rest > 0 ? Math.ceil(length / this.itemsPerPage) : Math.floor(length / this.itemsPerPage);
		return amount;
	}

	pageIncrement() {
		if (this.currentPage < this.pagesAmount - 1) this.currentPageSubject.next(this.currentPage + 1);
	}

	pageDecrement() {
		if (this.currentPage > 0) this.currentPageSubject.next(this.currentPage - 1);
	}
}
