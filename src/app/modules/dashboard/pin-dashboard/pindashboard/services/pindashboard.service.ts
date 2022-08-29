import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { ApiRouteConst } from "@app/shared/constants/api-route.constant";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { GlobalService } from "@app/shared/services/global/global.service";

@Injectable({
  providedIn: "root",
})
export class PinDashboardService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  addAttendance(attendanceFormData, clientId): Observable<any> {
    const params = new HttpParams()
      .set("id", attendanceFormData.id)
      .set("datetime", attendanceFormData.datetime)
      .set("type", attendanceFormData.type)
      .set("company_id", this.companyId)
      .set("checkin_message", attendanceFormData.checkin_message)
      .set("client_id", clientId);
    console.log(" Parms " + JSON.stringify(params));
    console.log(" this.baseIp " + JSON.stringify(this.baseIp));

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "multipart/form-data",
      }),
      params: params,
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}attendances/inout`,
      null,
      options
    );
  }

  // requestReviewCheckIn(reqReviewFormData): Observable<any> {
  //   const params = new HttpParams()
  //     .set("id", reqReviewFormData.id)
  //     .set("datetime", reqReviewFormData.datetime)
  //     .set("req_date", reqReviewFormData.req_date)
  //     .set(
  //       "correction_request_message",
  //       reqReviewFormData.correction_request_message
  //     );

  //   const options = {
  //     headers: new HttpHeaders({
  //       "Content-Type": "multipart/form-data",
  //     }),
  //     params: params,
  //   };

  //   return this.httpClient.post(
  //     `${this.baseIp}${this.apiPrefix}attendances/correction`,
  //     null,
  //     options
  //   );
  // }

  requestReviewCheckIn(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}attendances/correction`,
      body,
      options
    );
  }

  requestReviewCheckOut(reqReviewFormData): Observable<any> {
    const params = new HttpParams()
      .set("id", reqReviewFormData.id)
      .set("datetime", reqReviewFormData.datetime)
      .set("req_date", reqReviewFormData.req_date)
      .set(
        "correction_request_message",
        reqReviewFormData.correction_request_message
      );

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "multipart/form-data",
      }),
      params: params,
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}attendances/checkoutreview`,
      null,
      options
    );
  }

  getAttendanceHistory(id, date) {
    const params = new HttpParams().set("id", id).set("date", date);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}userstaff/attendance`,
      null,
      params
    );
  }

  getButtonStatus(id, clientId): Observable<any> {
    const params = new HttpParams()
      .set("id", id)
      .set("company_id", this.companyId)
      .set("client_id", clientId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}attendances/attstatus`,
      null,
      params
    );
  }
  getForgetTocheckoutStatus(id): Observable<any> {
    const params = new HttpParams().set("id", id);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}attendances/forgottocheckout`,
      null,
      params
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
}
