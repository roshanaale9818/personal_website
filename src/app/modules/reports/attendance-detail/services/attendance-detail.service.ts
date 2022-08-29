import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";

import { GlobalService } from "@app/shared/services/global/global.service";
@Injectable({
  providedIn: "root",
})
export class AttendanceDetailService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;

  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  //   get attendance detail...
  getAttendanceDetail(id, clientId): Observable<any> {
    const params = new HttpParams().set("id", id).set("client_id", clientId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}userstaff/attendance`,
      null,
      params
    );
  }

  getAttendanceDetails(body): Observable<any> {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}attendance/search`,
      body
    );
  }

  deleteAttendanceDetail(body): Observable<any> {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}attendance/remove`,
      body
    );
  }

  getClientFromStaff(staffId): Observable<any> {
    const params = new HttpParams().set("staff_id", staffId);
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clientstaff/staff`,
      null,
      params
    );
  }

  getEmployeeList(companyId): Observable<any> {
    const params = new HttpParams().set("company_id", companyId);
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}staff/index`,
      null,
      params
    );
  }
}
