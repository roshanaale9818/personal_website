import { Injectable } from '@angular/core';

import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { CookieService } from "ngx-cookie-service";
import { environment } from "@env/environment";
import { GlobalService } from "@app/shared/services/global/global.service";
import { RequestForgotPassword, ResetPassword } from './../components/modal/requestforgetpassword.interface';
@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {

  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;

  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private localStorageService: LocalStorageService,
    private cookieService: CookieService,
    private globalService: GlobalService
  ) {

  }

  getCompanyDetail(domain){
    const params = new HttpParams()
    // .set("access_token", this.accessToken)
    .set("subdomain", domain)


  return this.httpClientService.get(
    `${this.baseIp}${this.apiPrefix}appaccess/accessbydomain`,
    null,
    params
  );
   //returns system token


  }

  sendVerificationEmail(requestPassword:RequestForgotPassword){
    const params = new HttpParams()
    // .set("access_token", this.accessToken)
    .set("company_id",String( requestPassword.company_id))
    .set("email",requestPassword.email);


  return this.httpClientService.get(
    `${this.baseIp}${this.apiPrefix}user/request-password-reset`,
    null,
    params
  );
  }


  changePassword(resetPassword:ResetPassword){
    const params = new HttpParams()
    // .set("access_token", this.accessToken)
    .set("company_id",String( resetPassword.company_id))
    .set("reset_token",resetPassword.reset_token)
    .set('password',resetPassword.password)
    .set('password_repeat',resetPassword.password_repeat);


  return this.httpClientService.get(
    `${this.baseIp}${this.apiPrefix}user/reset-password`,
    null,
    params
  );
  }


}
