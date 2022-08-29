import { Component, Input, OnInit, Output } from "@angular/core";
import { EventEmitter } from "events";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Subject } from "rxjs";

@Component({
  selector: "app-logout-confirmation",
  templateUrl: "./logout-confirmation.component.html",
  styleUrls: ["./logout-confirmation.component.scss"],
})
export class LogoutConfirmationComponent implements OnInit {
  public onClose: Subject<boolean>;

  constructor(public bsModalRef: BsModalRef) {}

  public ngOnInit(): void {
    this.onClose = new Subject();
  }

  public onConfirm(): void {
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
  // @Input() data?: any;
  // @Input() title?: any;
  // @Input() action?: any;

  // @Output() onConfirm = new EventEmitter();
  // @Output() onClose = new EventEmitter();

  // deleteAll: boolean;

  // constructor(private modalService: BsModalService) {}

  // ngOnInit() {
  //   if (this.action === "delete all") {
  //     this.deleteAll = true;
  //   }
  // }

  // bsModalRef: BsModalRef;
  // // modal config to unhide modal when clicked outside
  // config = {
  //   backdrop: true,
  //   ignoreBackdropClick: true,
  // };

  // openConfirmationDialogue() {
  //   this.bsModalRef = this.modalService.show(
  //     LogoutConfirmationIdleComponent,
  //     this.config
  //   );
  //   this.bsModalRef.content.data = this.title;
  //   this.bsModalRef.content.action = this.action;
  //   this.bsModalRef.content.onClose.subscribe((confirm) => {
  //     if (confirm) {
  //       this.onConfirm.emit(this.data);
  //     }
  //   });
  // }
}
