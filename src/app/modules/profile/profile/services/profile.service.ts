import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";

import { GlobalService } from "@app/shared/services/global/global.service";
import { environment } from "@env/environment";
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) { }
  changePin(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}userstaff/pin`,
      body,
      options
    );
  }
  updatePassword(body): Observable<any> {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}staff/changepassword`,
      body
    );
  }

  getStaffDetailById(id) {
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}staff/details?id=${id}`
    );
  }
  updateStaff(body) {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}staff/edit`,
      body
    );
  }
}
