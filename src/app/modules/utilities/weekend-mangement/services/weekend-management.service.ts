import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";

import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { ApiRouteConst } from "@app/shared/constants/api-route.constant";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { GlobalService } from "@app/shared/services/global/global.service";

@Injectable({
  providedIn: "root",
})
export class WeekendManagementService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();

  constructor(
    private httpClient: HttpClient,
    private httpClientService: HttpClientService,
    private globalService: GlobalService
  ) {}

  getWeekendList(): Observable<any> {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}weekends`,
      null,
      params
    );
  }
  getWeekendArray(): Observable<any> {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}weekend/detail`,
      null,
      params
    );
  }

  // add weekend days
  addWeekends(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    let obj = {
      company_id : this.globalService.getCompanyIdFromStorage(),
      data:body
    }

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}weekends/add`,
      obj,
      options
    );
  }

  deleteWeekend(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}weekends/remove`,
      id,
      options
    );
  }
}
