import {
  Directive,
  Input,
  HostListener,
  ElementRef,
  OnInit,
  OnDestroy
} from "@angular/core";
import { NgControl, ValidationErrors } from "@angular/forms";
import { Subscription } from "rxjs";
import { ValidationMsgService } from "../validation-message.service";

@Directive({
  selector: "[appFormControlValidationMsg]"
})
export class FormControlValidationMsgDirective implements OnInit, OnDestroy {
  constructor(
    private elRef: ElementRef,
    private control: NgControl,
    private validationMsgService: ValidationMsgService
  ) {}

  // @Input("validationMsgId") validationMsgId: string;
  errorSpanId: string = "";
  inputLabelName = this.elRef.nativeElement.previousSibling
    ? this.elRef.nativeElement.previousSibling.innerText.replace(/\*/g, "")
    : "This Field";
  statusChangeSubscription: Subscription;

  ngOnInit(): void {
    this.errorSpanId = this.control.name + new Date() + "-error-msg";
    this.statusChangeSubscription = this.control.statusChanges.subscribe(
      status => {
        if (status == "INVALID") {
          this.showError();
        } else {
          this.removeError();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.statusChangeSubscription.unsubscribe();
  }

  @HostListener("blur", ["$event"])
  handleBlurEvent(event) {
    //This is needed to handle the case of clicking a required field and moving out.
    //Rest all are handled by status change subscription
    if (this.control.value == null || this.control.value == "") {
      if (this.control.errors) this.showError();
      else this.removeError();
    }
  }

  private showError() {
    this.removeError();
    const valErrors: ValidationErrors = this.control.errors;

    const errorMsg = this.validationMsgService.getValidationMsg(
      valErrors,
      this.inputLabelName
    );

    const errSpan =
      '<span style="color:red;" id="' +
      this.errorSpanId +
      '">' +
      errorMsg +
      "</span>";
    this.elRef.nativeElement.parentElement.insertAdjacentHTML(
      "beforeend",
      errSpan
    );
  }

  private removeError(): void {
    const errorElement = document.getElementById(this.errorSpanId);
    if (errorElement) errorElement.remove();
  }
}
