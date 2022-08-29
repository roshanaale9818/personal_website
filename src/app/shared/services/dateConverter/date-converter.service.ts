import { DatePipe } from "@angular/common";
import { GlobalService } from "@app/shared/services/global/global.service";
import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";

import { environment } from "@env/environment";

import { timezoneNames, ZonedDate } from "@progress/kendo-date-math";
import "@progress/kendo-date-math/tz/all";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";
declare var require: any;
var adbs = require("ad-bs-converter");
@Injectable({
  providedIn: "root",
})
export class DateConverterService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  accessToken = this.globalService.getAccessTokenFromCookie();
  companyId = this.globalService.getCompanyIdFromStorage();

  dateParameter = {
    dateType: "",
    status: "",
  };

  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService,
    private datePipe: DatePipe
  ) {}

  bsToAdInString(dateInBs) {
    dateInBs = this.dateStringFormater(dateInBs);

    let dateObject = adbs.bs2ad(dateInBs);
    return `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
  }

  adToBsInString(dateInAd) {
    // because adbs only accepts yyyy/MM/dd formate
    dateInAd = this.dateStringFormater(dateInAd);
    let dateObject = adbs.ad2bs(dateInAd);
    return `${dateObject.en.year}-${dateObject.en.month}-${dateObject.en.day}`;
  }

  adToBsInObject(dateStringInAd) {
    let dateInAd = this.dateStringFormater(dateStringInAd);
    let dateObject = adbs.ad2bs(dateInAd);
    let dateObjectInBs = {
      year: dateObject.en.year,
      month: dateObject.en.month - 1,
      day: dateObject.en.day,
    };
    return dateObjectInBs;
  }

  getNepalidateObjectToString(nepaliDateInObject) {
    return `${nepaliDateInObject.year}/${
      parseInt(nepaliDateInObject.month) + 1
    }/${nepaliDateInObject.day}`;
  }

  // formates yyyy-MM-dd to yyyy/MM/dd
  dateStringFormater(dateInString) {
    let regex = /-/gi;
    let result = dateInString.replace(regex, "/");
    return result;
  }
  getTimeFromTimeZone(timeZone) {
    let dateTime = ZonedDate.fromLocalDate(new Date(), timeZone);
    return dateTime;
  }
}
