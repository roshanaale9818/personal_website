import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[formControlName][time24]",
})
export class Time24Directive {
  constructor(public ngControl: NgControl) {}
  @HostListener("ngModelChange", ["$event"])
  onModelChange(event) {
    this.onInputChange(event);
  }

  @HostListener("keydown.backspace", ["$event"])
  keydownBackspace(event) {
    this.onInputChange(event.target.value);
  }

  onInputChange(value) {
    var x = value
      .replace(/\D/g, "")
      .match(/(([0-9]|0[0-9]|1[0-9]|2[0-3]){0,2})([0-5][0-9]{0,2})^[ A-z]/);
    // .match(/(\d{0,2})(\d{0,2})/);
    //    var x = value.replace(/\D/g, "").match(/(\d{0,2})(\d{0,2})/);
    //  value = !x[2] ? x[1] : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    console.log(x);
    value = x[1] + ":" + x[3];
    // value = "00:00:00";
    // this.ngControl.valueAccessor.writeValue(value);
    // let newVal = event.replace(/\D/g, "");
    // if (backspace && newVal.length <= 6) {
    //   newVal = newVal.substring(0, newVal.length - 1);
    // }
    // if (newVal.length === 0) {
    //   newVal = "";
    // } else if (newVal.length <= 3) {
    //   newVal = newVal.replace(/^(\d{0,3})/, "($1)");
    // } else if (newVal.length <= 6) {
    //   newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, "($1) ($2)");
    // } else if (newVal.length <= 10) {
    //   newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, "($1) ($2)-$3");
    // } else {
    //   newVal = newVal.substring(0, 10);
    //   newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, "($1) ($2)-$3");
    // }
    this.ngControl.valueAccessor.writeValue(value);
  }
}
