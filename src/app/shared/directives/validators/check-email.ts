import { FormGroup } from "@angular/forms";

export function checkEmail(group: FormGroup) {
  if (group.controls.email && group.controls.confirmEmail) {
    let email = group.controls.email.value;
    let confirmEmail = group.controls.confirmEmail.value;

    return email === confirmEmail ? null : { emailMismatch: true };
  }
}
