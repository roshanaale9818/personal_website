import { FormGroup } from "@angular/forms";

export function checkPassword(group: FormGroup) {
    if (group.controls.password && group.controls.confirmPassword) {
        let password = group.controls.password.value;
        let confirmPassword = group.controls.confirmPassword.value;
    
        return password === confirmPassword ? null : {passwordMismatch: true};
    }
}
