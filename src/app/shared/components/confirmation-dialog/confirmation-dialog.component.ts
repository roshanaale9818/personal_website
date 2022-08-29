import { Component, OnInit } from "@angular/core";
import { GlobalService } from "@app/shared/services/global/global.service";
import { BsModalRef } from "ngx-bootstrap";
import { Subject } from "rxjs";

@Component({
  selector: "dms-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
  styleUrls: ["./confirmation-dialog.component.scss"],
})
export class ConfirmationDialogComponent implements OnInit {
  public onClose: Subject<boolean>;

  constructor(public bsModalRef: BsModalRef,
    private globalService:GlobalService) {}
  public showConfirmationInput = false;
  public showConfirmationLabel:string = null
  public confirmationText:string = null
  public disable:boolean = false;

  ngOnInit() {
    this.onClose = new Subject();
    this.globalService.showConfirmBox.subscribe((res)=>{
      this.showConfirmationInput = res;
    })
    this.globalService.showConfirmationLabel.subscribe((res)=>{
      this.showConfirmationLabel = res;
    })
    this.globalService.confirmationSubmitDisableStatus.subscribe((res)=>{
      this.disable = res;
    })
  }

  onChange(){
    this.globalService.confirmInputText.next(this.confirmationText)
  }

  public onConfirm(): void {
    if(this.disable)return;
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
