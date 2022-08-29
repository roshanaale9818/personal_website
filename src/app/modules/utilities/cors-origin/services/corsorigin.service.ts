import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { SearchCorsOrigin } from "../modal/searchcorsorigin.interface";
import { AddCorsOrigin } from "../modal/addCorsOrigin.interface";

@Injectable({
  providedIn: "root",
})
export class CorsOriginService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;

  accessToken = this.globalService.getAccessTokenFromCookie();
  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getCorsList(body:SearchCorsOrigin) {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}cors-origin/search`,
      body
    );
  }

  addCors(body:AddCorsOrigin): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}cors-origin/add`,
      body
    );
  }

  // edit method

  editCors(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}cors-origin/edit`,
      body,
      options
    );
  }

  // delete method

  deleteCorsOrigin(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}cors-origin/remove`,
      id,
      options
    );
  }

}
