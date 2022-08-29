import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { ValidationMessageService } from "@app/shared/services/validation-message/validation-message.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
  selector: "flexyear-add-modal",
  templateUrl: "./add-modal.component.html",
  styleUrls: ["./add-modal.component.scss"],
})
export class AddModalComponent implements OnInit {
  @Input() type: string = "add";
  @Input() buttonName: string;
  @Input() modalTitle: string;
  @Input() formValid: boolean; //close the modalRef if the form is valid
  @Input() formName: any;

  @Output() onSubmit = new EventEmitter();

  constructor(
    private bsModalService: BsModalService,
    private validationMessageService: ValidationMessageService
  ) {}

  ngOnInit() {}

  bsModalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.bsModalService.show(template, this.config);
  }

  onSave(): void {
    this.onSubmit.emit(true);

    if (this.formValid) {
      // to hide the red border on form field
      this.validationMessageService.formSubmitted = false;
      this.bsModalRef.hide();
    }
  }

  onCancel() {
    // to hide the red border on form field
    this.validationMessageService.formSubmitted = false;
    this.bsModalRef.hide();
  }
}
