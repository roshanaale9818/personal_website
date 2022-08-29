import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { DepartmentListModel } from "../model/departmentListModel";
import { GlobalService } from "@app/shared/services/global/global.service";

@Injectable({
  providedIn: "root",
})
export class DepartmentService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  selectedDepartment: DepartmentListModel;
  accessToken = this.globalService.getAccessTokenFromCookie();
  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getDepartmentList(paramsData) {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}departments`,
      null,
      params
    );
  }

  addDepartment(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    console.log(" body " + JSON.stringify(body));
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}departments/add`,
      body
    );
  }

  // edit method

  editDepartment(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}departments/edit`,
      body,
      options
    );
  }

  // delete method

  deleteDepartment(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}departments/remove`,
      id,
      options
    );
  }

  setSelectedDepartment(department): void {
    this.selectedDepartment = department;
  }

  getSelectedDepartment() {
    return this.selectedDepartment;
  }
}
