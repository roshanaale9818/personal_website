import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { environment } from "@env/environment";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class CreateRequestService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  accessToken = this.globalService.getAccessTokenFromCookie();
  companyId = this.globalService.getCompanyIdFromStorage();

  constructor(
    private httpClientService: HttpClientService,
    private globalService: GlobalService,
    private httpClient: HttpClient
  ) {}

  getLeaveTypes(paramsData) {
    const params = new HttpParams()
      .set("access_token", this.accessToken)
      .set("limit", paramsData.limit)
      .set("company_id", this.companyId)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}leavetypes`,
      null,
      params
    );
  }

  addLeaveRequest(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}leaves/add`,
      body,
      options
    );
  }

  editLeaveRequest(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}leaves/edit`,
      body,
      options
    );
  }

  getUserList() {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}userstaff`,
      null,
      params
    );
  }
}
