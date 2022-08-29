import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { ApiRouteConst } from "@app/shared/constants/api-route.constant";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { EmployeeTypeModel } from "../models/employeeTypeModel";

import { GlobalService } from "@app/shared/services/global/global.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";

@Injectable({
  providedIn: "root",
})
export class EmployeeTypeService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  selectedEmployeeType: EmployeeTypeModel;
  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getEmployeeTypeList(paramsData): Observable<any> {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}employeetypes`,
      null,
      params
    );
  }

  addEmployeeType(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}employeetypes/add`,
      body,
      options
    );
  }

  // edit method

  editEmployeeType(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}employeetypes/edit`,
      body,
      options
    );
  }

  // delete method

  deleteEmployeeType(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}employeetypes/remove`,
      id,
      options
    );
  }

  setSelectedEmployeeType(employeeType): void {
    this.selectedEmployeeType = employeeType;
  }

  getSelectedEmployeeType() {
    return this.selectedEmployeeType;
  }
}
