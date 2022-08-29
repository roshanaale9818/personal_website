import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class ToastrMessageService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message): void {
    this.toastr.success(message);
  }

  showError(message): void {
    if (!(typeof message === "string")) {
      for (var key in message) {
        this.toastr.error(JSON.stringify(message[key]));
        return;
      }
    } else {
      this.toastr.error(message);
    }
  }

  showWarning(message) {
    this.toastr.warning(message);
  }

  showHTMLErrorMessage(message, title?:any){
    this.toastr.error(message, title, {
      enableHtml :  true
    })
  }
}
