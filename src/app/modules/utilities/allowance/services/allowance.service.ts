import { AllowanceListModal } from "../modal/allowanceListModal";
import { Injectable } from "@angular/core";
import { GlobalService } from "@app/shared/services/global/global.service";

import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
@Injectable({
  providedIn: "root",
})
export class AllowanceService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();
  selectedAllowance: AllowanceListModal;
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getAllowanceList(paramsData) {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}allowances`,
      null,
      params
    );
  }

  // add allowance
  addAllowance(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}allowances/add`,
      body,
      options
    );
  }
  // edit method
  editAllowance(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}allowances/edit`,
      body,
      options
    );
  }

  // delet allowance
  deleteAllowance(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}allowances/remove`,
      id,
      options
    );
  }

  setSelectedAllowance(allowance): void {
    this.selectedAllowance = allowance;
  }

  getSelectedAllowance() {
    return this.selectedAllowance;
  }
}
