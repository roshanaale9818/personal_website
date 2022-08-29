import { GlobalService } from "@app/shared/services/global/global.service";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "@app/modules/auth/login/services/login.service";
import { Observable, of } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private loginService: LoginService,
    private globalService: GlobalService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // We should not add access_token to login, register & refreshToken API's
    const urlToIgnore = /login/gi || /register/gi;

    if (request.url.search(urlToIgnore) === -1) {
      request = request.clone({
        setParams: {
          access_token: this.loginService.getTokenFromCookie(),
        },
      });
    }

    return next.handle(request).pipe(
      tap((evt) => {
        if (evt instanceof HttpResponse) {
          // console.log(evt);
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          // console.log(err);
          if (err.status == 0) {
            this.globalService.logout();
          }
        }
        return of(err);
      })
    );
  }
}
