import { GlobalService } from "@app/shared/services/global/global.service";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "@app/modules/auth/login/services/login.service";
import { config, Observable, of } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LogoutConfirmationComponent } from "@app/shared/components/logout-confirmation/logout-confirmation.component";
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private loginService: LoginService,
    private globalService: GlobalService,
    private localStorageService: LocalStorageService,
    private toastrMessageService: ToastrMessageService,
    private modalService: BsModalService
  ) {}
  modalRef: BsModalRef;
  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // We should not add access_token to login, register & refreshToken API's
    const urlToIgnore = /login/gi || /register/gi || /verify-company/gi;

    if (request.url.search(urlToIgnore) === -1) {
      request = request.clone({
        setParams: {
          access_token: this.localStorageService.getLocalStorageItem(
            "flexYear-token"
          ),
        },
      });
    }

    return next.handle(request).pipe(
      tap((evt) => {
        if (evt instanceof HttpResponse) {
          if(evt.body &&evt.body.response){
            if(evt.body.status == 'failure' && evt.body.response == "Invalid Access Token"){
              this.globalService.logout();
            }
          }
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          console.log(err);
          if (err.status == 0) {
            this.modalRef = this.modalService.show(
              LogoutConfirmationComponent,
              this.config
            );
            //this.modalRef.content.data = "Username";
            this.modalRef.content.action = "logout";
            this.modalRef.content.onClose.subscribe((confirm) => {
              if (confirm) {
                this.globalService.logout();
              }
            });
          }
          // Internal Server error
          if (err.status == 500) {
            this.toastrMessageService.showError(
              "Server is not available. Please try again later!!"
            );
          }
        }
        return of(err);
      })
    );
  }
}
