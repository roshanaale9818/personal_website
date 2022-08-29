import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CorrectionAttendanceService {
  apiUrl = environment.baseIp + environment.apiPrefix;

  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient
  ) {}

  getAttendanceList(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.apiUrl}attendance/search`,
      body,
      options
    );
  }

  deleteAttendanceCorrection(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.apiUrl}attendance/remove`,
      body,
      options
    );
  }

  updateAttendanceCorrection(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(`${this.apiUrl}attendance/edit`, body, options);
  }

  approveAttendanceList(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.apiUrl}attendance/status`,
      body,
      options
    );
  }
  getEmployeeList(companyId): Observable<any> {
    const params = new HttpParams().set("company_id", companyId);
    return this.httpClientService.get(
      `${this.apiUrl}staff/index`,
      null,
      params
    );
  }
  getClientFromStaff(staffId): Observable<any> {
    const params = new HttpParams().set("staff_id", staffId);
    return this.httpClientService.get(
      `${this.apiUrl}clientstaff/staff`,
      null,
      params
    );
  }

  correctionUserId;
  setSharedUserId(userId) {
    this.correctionUserId = userId;
  }
  getCorrectionUserId() {
    if (this.correctionUserId) {
      return this.correctionUserId;
    } else {
      return null;
    }
  }
  getUserList(company_id) {
    const params = new HttpParams().set("company_id", company_id);

    return this.httpClientService.get(
      `${this.apiUrl}userstaff`,
      null,
      params
    );
  }
}
