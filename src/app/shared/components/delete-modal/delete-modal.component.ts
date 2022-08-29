import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "dms-delete-modal",
  templateUrl: "./delete-modal.component.html",
  styleUrls: ["./delete-modal.component.scss"],
})
export class DeleteModalComponent implements OnInit {
  @Input() data?: any;
  @Input() title?: string;
  @Input() action: string;

  @Output() onConfirm = new EventEmitter();

  deleteAll: boolean;
  modalRef: BsModalRef;

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  constructor(private modalService: BsModalService) {}

  ngOnInit() {}

  openConfirmationDialogue() {
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = this.title;
    this.modalRef.content.action = this.action;
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.onConfirm.emit(this.data);
      }
    });
  }
}
