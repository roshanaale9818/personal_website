import { Component, Input, OnInit, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "flexyear-delete-confirmation-modal",
  templateUrl: "./delete-confirmation-modal.component.html",
  styleUrls: ["./delete-confirmation-modal.component.scss"],
})
export class DeleteConfirmationModalComponent implements OnInit {
  @Input() data?: any;
  @Input() title?: any;
  @Input() action?: any;
  @Input() showButton:boolean = false;

  @Output() onConfirm = new EventEmitter();
  deleteAll: boolean;
  @Input() showConfirmationInput:boolean = false;
  // @Input() confirmationInputLabel:string;

  constructor(private modalService: BsModalService) {}

  ngOnInit() {
    if (this.action === "delete all") {
      this.deleteAll = true;
    }
  }


  bsModalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  @Output() onShowConfirmation:EventEmitter<any> = new EventEmitter();
  openConfirmationDialogue() {
    // emit and call the parent methods here
    if(this.showConfirmationInput){
      // console.log("emitting",this.data)
      this.onShowConfirmation.emit(this.data);
    }

    this.bsModalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.bsModalRef.content.data = this.title;
    this.bsModalRef.content.action = this.action;
    this.bsModalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.onConfirm.emit(this.data);
      }
    });
  }




}
