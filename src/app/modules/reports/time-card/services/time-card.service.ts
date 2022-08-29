import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import {
  TimeCardReportRootModel,
  UserRootObject,
} from "../models/time-card.models";

@Injectable({
  providedIn: "root",
})
export class TimeCardService {
  private apiUrl = environment.baseIp + environment.apiPrefix;
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getTimeCardReportList(body): Observable<any> {
    // const options = {
    //   "Content-type": "application/json",
    //   headers: new HttpHeaders({
    //     access_token: this.globalService.getAccessTokenFromCookie(),
    //   }),
    // };
    // const params = new HttpParams()
    //   .set("company_id", queryParams.company_id)
    //   .set("client_id", queryParams.client_id)
    //   .set("begDate", queryParams.begDate)
    //   .set("endDate", queryParams.endDate);

    // return this.httpClientService.post(
    //   `${this.apiUrl}attendance/timecard`,
    //   body,
    //   options
    // );

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.apiUrl}attendance/timecard`,
      body,
      options
    );
  }

  getUserByClientId(clientId): Observable<UserRootObject> {
    const params = new HttpParams().set("client_id", clientId);

    return this.httpClientService.get(
      `${this.apiUrl}clientstaff`,
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

  getUsersByClientId(clientId, status): Observable<any> {
    const params = new HttpParams()
      .set("client_id", clientId)
      .set("status", status);

    return this.httpClientService.get(
      `${this.apiUrl}clientstaff`,
      null,
      params
    );
  }

  getUsersByClientsId(clientId): Observable<any> {
    const params = new HttpParams().set("client_id", clientId);

    return this.httpClientService.get(
      `${this.apiUrl}clientstaff`,
      null,
      params
    );
  }

  getUserLists(): Observable<any> {
    const params = new HttpParams().set("company_id", this.globalService.getCompanyIdFromStorage());

    return this.httpClientService.get(
      `${this.apiUrl}userstaff`,
      null,
      params
    );
  }
}
