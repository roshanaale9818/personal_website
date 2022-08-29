import { ClientBranchList } from "./../modals/client-branch.modal";
import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";

import { GlobalService } from "@app/shared/services/global/global.service";
@Injectable({
  providedIn: "root",
})
export class ClientBranchService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  selectedClientBranch: ClientBranchList;
  accessToken = this.globalService.getAccessTokenFromCookie();
  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getClientBranchList(paramsData) {
    const params = new HttpParams()
      .set("access_token", this.accessToken)
      .set(
        "company_id",
        paramsData.company_id ? paramsData.company_id : this.companyId
      )
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clientbranches`,
      null,
      params
    );
  }

  addClientBranch(body): Observable<any> {
    const params = new HttpParams().set("access_token", this.accessToken);

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: params,
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientbranches/add`,
      body,
      options
    );
  }

  // edit method

  editClientBranch(body): Observable<any> {
    const params = new HttpParams().set("access_token", this.accessToken);

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: params,
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientbranches/edit`,
      body,
      options
    );
  }

  // delete method

  deleteClientBranch(id): Observable<any> {
    const params = new HttpParams().set("access_token", this.accessToken);

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: params,
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientbranches/remove`,
      id,
      options
    );
  }

  setSelectedClientBranch(clientBranch): void {
    this.selectedClientBranch = clientBranch;
  }

  getSelectedClientBranch() {
    return this.selectedClientBranch;
  }
}
