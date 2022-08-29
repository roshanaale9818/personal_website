import { AllowIpList } from "../model/allow-ip.model";
import { Injectable } from "@angular/core";
import { GlobalService } from "@app/shared/services/global/global.service";

import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";

@Injectable({
  providedIn: "root",
})
export class AllowIpService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();
  selectedAllowedIp: AllowIpList;
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getAllowedIpList(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}allowips/search`,
      body,
      options
    );
  }
  // add allowance
  addAllowedIp(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}allowips/add`,
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
      `${this.baseIp}${this.apiPrefix}allowips/edit`,
      body,
      options
    );
  }

  // delet allowance
  deleteAllowedIp(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}allowips/remove`,
      id,
      options
    );
  }
  setSelectedAllowedIp(designation): void {
    this.selectedAllowedIp = designation;
  }

  getSelectedAllowedIp() {
    return this.selectedAllowedIp;
  }
}
