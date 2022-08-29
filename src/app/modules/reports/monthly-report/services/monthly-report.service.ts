import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";

import { GlobalService } from "@app/shared/services/global/global.service";

@Injectable({
  providedIn: "root",
})
export class MonthlyReportService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;

  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}
  // get staff list with username
  getStaffList() {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}staff`,
      null,
      params
    );
  }

  exportExcel(body): Observable<any> {
    // let headers = new HttpHeaders();
    // headers = new HttpHeaders().set("content-type", "multipart/form-data");
    // return this.httpClient.post(
    //   `${this.baseIp}${this.apiPrefix}attendance/excel-export`,
    //   body,
    //   { headers: headers, responseType: "blob" }

    // );
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}attendance/excel-export`,
      body
    );
  }

  exportMonthlyExcelReport(body): Observable<any> {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}attendance/excel-export-monthly`,
      body
    );
  }

  exportWeeklyExcelReport(body): Observable<any> {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}attendance/excel-export-weekly`,
      body
    );
  }

  getMonthlyReport(body): Observable<any> {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}attendance/reportclient`,
      body
    );
  }

  checkClientList(staffId): Observable<any> {
    return this.httpClient.get(
      `${this.baseIp}${this.apiPrefix}clientstaff/staff`
    );
  }

  getDailyReport(body): Observable<any> {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}attendance/oneday-report`,
      body
    );
  }

  getWeeklyReport(body): Observable<any> {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}attendance/weekly-report`,
      body
    );
  }

  addAttendance(body): Observable<any> {
    console.log("Body" + JSON.stringify(body));
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}attendance/addmultiple`,
      body,
      options
    );
  }

  addForceChangeMultiple(body): Observable<any> {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}attendance/force-change-multiple`,
      body
    );
  }

  getUserAttendance(paramData): Observable<any> {
    const params = new HttpParams()
      .set("id", paramData.id)

      .set("date", paramData.date);

      if( paramData.client_id){
        params.set("client_id", paramData.client_id)
      }

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}userstaff/staff-attendance`,
      null,
      params
    );
  }

  getUserAttendances(paramData): Observable<any> {
    const params = new HttpParams()
      .set("id", paramData.id)
      .set("date", paramData.date);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}userstaff/attendance`,
      null,
      params
    );
  }

  updateForceChange(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}attendance/forcecheckout`,
      body,
      options
    );
  }

  deleteForceChange(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}attendance/remove`,
      body,
      options
    );
  }

  getUserwiseMonthlyReport(body): Observable<any> {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("id", body.id)
      .set("date_from", body.date_from)
      .set("date_to", body.date_to);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}attendance/report`,
      null,
      params
    );
  }

  // ..........................................USERWISE ATTENDANCE.........................................................
  addRequestChange(body): Observable<any> {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}attendance/correction-review`,
      body
    );
  }

  getUserLists(): Observable<any> {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}userstaff`,
      null,
      params
    );
  }
}
