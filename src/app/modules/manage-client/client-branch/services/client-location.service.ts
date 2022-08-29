import { ClientLocationList } from "./../modals/client-location.modal";

import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";

import { GlobalService } from "@app/shared/services/global/global.service";
@Injectable({
  providedIn: "root",
})
export class ClientLocationService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  selectedClientLocation: ClientLocationList;
  accessToken = this.globalService.getAccessTokenFromCookie();
  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getClientLocationList(paramsData) {
    const params = new HttpParams()
      .set("access_token", this.accessToken)
      .set("client_branch_id", paramsData.client_branch_id)
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clientlocations`,
      null,
      params
    );
  }

  addClientLocation(body): Observable<any> {
    const params = new HttpParams().set("access_token", this.accessToken);

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: params,
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientlocations/add`,
      body,
      options
    );
  }

  // edit method

  editClientLocation(body): Observable<any> {
    const params = new HttpParams().set("access_token", this.accessToken);

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: params,
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientlocations/edit`,
      body,
      options
    );
  }

  // delete method

  deleteClientLocation(id): Observable<any> {
    const params = new HttpParams().set("access_token", this.accessToken);

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: params,
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientlocations/remove`,
      id,
      options
    );
  }

  getTimeZoneList(): Observable<any> {
    const params = new HttpParams().set("access_token", this.accessToken);

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: params,
    };

    return this.httpClient.get(
      `${this.baseIp}${this.apiPrefix}setting/time-zone`,
      options
    );
  }

  setSelectedClientLocation(clientLocation): void {
    this.selectedClientLocation = clientLocation;
  }

  getSelectedClientLocation() {
    return this.selectedClientLocation;
  }
}
