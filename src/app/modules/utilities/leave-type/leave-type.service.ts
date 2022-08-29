import { GlobalService } from "@app/shared/services/global/global.service";
import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";

import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";

@Injectable({
  providedIn: "root",
})
export class LeaveTypeService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  selectedLeaveType: any;
  leaveTypeDetail: any;
  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  addLeaveType(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}leavetypes/add`,
      body,
      options
    );
  }

  getleaveTypeList(paramsData): Observable<any> {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("limit", paramsData.limit)
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
  setselectedLeaveType(leaveType): void {
    this.selectedLeaveType = leaveType;
  }

  getSelectedLeaveType() {
    return this.selectedLeaveType;
  }

  // edit method

  editLeaveType(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}leavetypes/edit`,
      body,
      options
    );
  }

  // delete method

  deleteLeaveType(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}leavetypes/remove`,
      id,
      options
    );
  }
}
