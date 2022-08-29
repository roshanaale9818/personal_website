import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges
} from "@angular/core";
import { SessionStorageService } from "@app/shared/services/session-storage/session-storage.service";
import { StorageConst } from "@app/shared/constants/storage.constant";

@Component({
  selector: "simpliflysaas-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"]
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Input() currentPage: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  startCount: number;
  endCount: number;
  sessionStorageConst = StorageConst.SESSION_STORAGE;
  constructor(private sessionStorageService: SessionStorageService) {}

  ngOnInit() {
    this.getStartAndEndCounts();
  }

  ngOnChanges() {
    this.getStartAndEndCounts();
  }

  onPageChange(pageNumber) {
    this.pageChange.emit(pageNumber);
    this.currentPage = pageNumber;
    this.sessionStorageService.setSessionStorageItem(
      this.sessionStorageConst.UTILITIES_CURRENT_PAGE,
      pageNumber
    );
    this.getStartAndEndCounts();
  }

  getStartAndEndCounts() {
    this.startCount =
      (this.currentPage ? this.currentPage : 1) * this.itemsPerPage -
      (this.itemsPerPage - 1);
    this.endCount = Math.min(
      this.startCount + this.itemsPerPage - 1,
      this.totalItems
    );
  }
}
