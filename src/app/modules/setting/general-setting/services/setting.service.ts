import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";

import { GlobalService } from "@app/shared/services/global/global.service";

@Injectable({
  providedIn: "root",
})
export class SettingService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;

  accessToken = this.globalService.getAccessTokenFromCookie();
  companyId = this.globalService.getCompanyIdFromStorage();
  // settingsparams = this.globalService.getSettingsFromStorage();
  settingsparams;


  // setting body
  settingBody = {
    company_id: this.companyId,
    setting: {
      COMP_NAME: "",
      COMP_ADDR: "",
      COMP_COUNTRY: "",
      COMP_PHONE: "",
      GS_DATE: "",
      GS_DT_FORMAT: "",
      GS_TIME_ZONE: "",
      GS_SEND_ATTN_EMAIL: "",
      GS_SEND_LEAVE_RQ_MAIL: "",
      GS_SEND_ATTN_CORR_RQ_MAIL: "",

      GM_STAFF_PRESENT: "",
      GM_ATT_ALERT: "",
      GS_LEAVE_REVIEW_MONTH: "",
      GS_LATE: "",
      GS_SEND_ATTN_EMAIL_MANAGER: "",
      GS_SEND_LEAVE_RQ_MAIL_MANAGER: "",
      GS_SEND_ATTN_CORR_RQ_MAIL_MANAGER: "",
      GS_MANAGER_LATE_ATTENDANCE_EMAIL: "",
      GS_LATE_ATTENDANCE_EMAIL: "",
      GS_IP: "",
      DEC_POINT:"",
      CURRENCY:"",
      OT_Allow:"",
      negative_format:"",
      name_format:""


    },
    emailsetting: {
      GE_MAIL_TYPE: "",
      GE_RELOAD_INTERVAL: "",
      GE_MAIL_NO: "",
      GE_MAIL_ENCODE_BIT: "",
      GE_SERVER_HOST: "",
      GE_SERVER_USERNAME: "",
      GE_SERVER_PASSWORD: "",
      GE_SERVER_ENC_TYPE: "",
      GE_SERVER_PORT: "",
      GE_PHP_FROM: "",
      GE_PHP_REPLY_TO: "",
      GE_SENDER_NAME: "",
      GE_PHP_ALTERNATIVE_PATH: "",
      GE_PHP_RETURN_PATH: "",
    },

    //company rule starts here

    rules:{
      CR_WHPD:'',
      CR_OT1:'',
      CR_OT2:'',
      CR_LHU:'',

      //check box starts here
      CR_LAAW:'',
      CR_BREAK_PAID:'',
      CR_LUNCH_PAID:'',
      CR_LABW:'',
      CR_PUBLIC_PAID:'',
    }
    // company rule ends here
  };

  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getSettings() {
    this.companyId = this.globalService.getCompanyIdFromStorage();
    const params = new HttpParams()
      .set("access_token", this.accessToken)
      .set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}settings`,
      null,
      params
    );
  }

  getControlValue(controlName) {
    this.settingsparams = this.globalService.getSettingsFromStorage();
    const controlValue = {
      value: "",
    };

    this.settingsparams.settingList.forEach((item) => {
      if (item.code == controlName) {
        controlValue.value = item.value;
      }
      if (item.setting_code == controlName) {
        controlValue.value = item.setting_value;
      }
    });

    return controlValue.value;
  }

  // edit setting

  editSettings(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}settings/edit`,
      body,
      options
    );
  }

  uploadCompanyLogo(img, companyId): Observable<any> {
    var formData = new FormData();
    formData.append("logo", img.logo);
    formData.append("company_id", companyId);

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}setting/uploadlogo`,
      formData
    );
  }

  getCompanyLogo(companyId): Observable<any> {
    const params = new HttpParams().set("company_id", companyId);
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}setting/logo`,
      null,
      params
    );
  }
  getSettingsForCompanyChange(companyId) {
    this.companyId = this.globalService.getCompanyIdFromStorage();
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
  getCurrenyList(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

      return this.httpClient.post(
        `${this.baseIp}${this.apiPrefix}currency/search`,
        body,
        options
      );
  }
}
