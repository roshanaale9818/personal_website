import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class ValidationMessageService {
  formSubmitted: boolean;

  constructor() {}

  /**
   * returns form validation messages
   * @param group
   * @param formErrors
   * @param validationMessages
   * @param language
   */
  getFormErrors(
    group: FormGroup,
    formErrors,
    validationMessages,
    language = "en-US",
    touchedOrDirty = null
  ): any {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get the control. The control can be a nested form group
      const abstractControl = group.get(key);

      // If the control is nested form group, recursively call
      // this same method
      if (abstractControl instanceof FormGroup) {
        this.getFormErrors(
          abstractControl,
          formErrors,
          validationMessages,
          language,
          touchedOrDirty
        );
        // If the control is a FormControl
      } else {
        // Clear the existing validation errors
        formErrors[key] = "";

        let condition;
        if (touchedOrDirty) {
          condition =
            abstractControl &&
            !abstractControl.valid &&
            (abstractControl.touched || abstractControl.dirty);
        } else {
          condition = abstractControl && !abstractControl.valid;
        }

        if (condition) {
          // Get all the validation messages of the form control according to the language selected
          // that has failed the validation
          let messages;
          if (language === "es") {
            let validationMessageInEs = validationMessages.es;
            messages = validationMessageInEs[key];
          } else {
            let validationMessageInEnUs = validationMessages.enUS;
            messages = validationMessageInEnUs[key];
          }
          // Find which validation has failed. For example required,
          // minlength or maxlength. Store that error message in the
          // formErrors object. The UI will bind to this object to
          // display the validation errors
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              formErrors[key] += messages[errorKey] + " ";
            }
          }
        }
      }
    });
    return formErrors;
  }

  scrollToErrorField(element) {
    if (element.length) {
      element[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}
