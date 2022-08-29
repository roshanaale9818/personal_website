import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { CookieService } from "ngx-cookie-service";
import { environment } from "@env/environment";
import { GlobalService } from "@app/shared/services/global/global.service";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;

  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private localStorageService: LocalStorageService,
    private cookieService: CookieService,
    private globalService: GlobalService
  ) {
    // console.log(this.companyId);
  }

  loginByUsername(loginValue): Observable<any> {
    const params = new HttpParams()
      .set("username", loginValue.username)
      .set("password", loginValue.password);
    //params was erased and data is send to body
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}users/login`,
      loginValue,
      null,
      null
    );
  }

  loginByPin(pinValue): Observable<any> {
    const params = new HttpParams().set("pin", pinValue.pin);
    // .set("company_id", this.companyId.toString());

    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}users/pinlogin`,
      null,
      null,
      params
    );
  }

  loginByToken(access_token): Observable<any> {
    const params = new HttpParams().set("access_token", access_token);

    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}user/loginwithkey`,
      null,
      null,
      params
    );
  }

  /**
   * Returns the credential from local storage.
   */
  getCredentialsFromStorage() {
    return this.localStorageService.getLocalStorageItem("credentials");
  }

  getTokenFromCookie() {
    return this.localStorageService.getLocalStorageItem("flexYear-token");
  }

  /**
   * Verifies whether the user is already logged in.
   */
  isLoggedIn(): boolean {
    const access_token =
      this.localStorageService.getLocalStorageItem("flexYear-token");
    if (access_token) {
      return true;
    }
    return false;
  }

  setUserInfoOnStorage(userInfo) {
    this.localStorageService.setLocalStorageItem("user_info", userInfo);
  }

  getUserInfoFromStorage() {
    return this.localStorageService.getLocalStorageItem("user_info");
  }

  setSettingsParametersOnStorage(settingsList, emailSettingList) {
    this.localStorageService.setLocalStorageItem("setting_list", settingsList);
    this.localStorageService.setLocalStorageItem(
      "emailSetting_list",
      emailSettingList
    );
  }
  getSettingsParametersFromStorage() {
    const setting = {
      settingList: [],
      emailSettingList: [],
    };

    setting.settingList =
      this.localStorageService.getLocalStorageItem("setting_params");
    setting.emailSettingList =
      this.localStorageService.getLocalStorageItem("emailSetting_list");
    return setting;
  }

  getSettings(companyId) {
    //company id changed because of undefined cases before
    const params = new HttpParams()
      // .set("access_token", this.accessToken)
      .set("company_id", companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}settings`,
      null,
      params
    );
  }

  //getUserMenudetails
  getMenuDetails(id, companyId) {
    const params = new HttpParams()
      // .set("access_token", this.accessToken)
      .set("company_id", companyId)
      .set("user_id", id);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}role/user-menu`,
      null,
      params
    );
  }

  //getUserPreferenceSetting for userWise Setting
  getUserPreferenceSetting(userId): Observable<any> {
    const params = new HttpParams().set("user_id", userId);
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}userpreference/userdata`,
      null,
      params
    );
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
getSystemToken(){
  return this.httpClientService.get(
    `${this.baseIp}${this.apiPrefix}apikey/index`
  );
}
}
