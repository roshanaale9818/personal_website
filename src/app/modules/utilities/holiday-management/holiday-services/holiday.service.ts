import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { ApiRouteConst } from "@app/shared/constants/api-route.constant";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";

@Injectable({
  providedIn: "root",
})
export class HolidayService {
  selectedHoliday: any;
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  adminRouteConst = ApiRouteConst.HOLIDAY;
  companyId = this.globalService.getCompanyIdFromStorage();

  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}
  // get holiday method
  getHolidayList(paramsData): Observable<any> {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}holidays`,
      null,
      params
    );
  }
  // add holiday method
  addHolidays(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}holidays/add`,
      body,
      options
    );
  }

  // edit holiday method
  editHoliday(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}holidays/edit`,
      body,
      options
    );
  }

  // method to delet holiday
  deleteHolidayById(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}holidays/remove`,
      id,
      options
    );
  }

  setselectedHoliday(holiday): void {
    this.selectedHoliday = holiday;
  }
  getSelectedHoliday() {
    return this.selectedHoliday;
  }
}
