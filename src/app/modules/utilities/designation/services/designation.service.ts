import { DesignationListModal } from "../model/designationListModal";
import { Injectable } from "@angular/core";

import { GlobalService } from "@app/shared/services/global/global.service";

import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
@Injectable({
  providedIn: "root",
})
export class DesignationService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();
  selectedDesignation: DesignationListModal;

  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getDesignationList(paramsData) {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}designations`,
      null,
      params
    );
  }

  // add designation
  addDesignation(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}designations/add`,
      body,
      options
    );
  }
  // edit method
  editDesignation(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}designations/edit`,
      body,
      options
    );
  }

  // delet allowance
  deleteDesignation(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}designations/remove`,
      id,
      options
    );
  }
  searchDesignation(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}designations/search`,
      body,
      options
    );
  }
  setSelectedDesignation(designation): void {
    this.selectedDesignation = designation;
  }

  getSelectedDesignation() {
    return this.selectedDesignation;
  }
}
