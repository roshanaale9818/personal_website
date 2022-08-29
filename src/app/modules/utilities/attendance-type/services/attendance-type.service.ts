import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { HttpClientService } from "../../../../core/services/http-client/http-client.service";
import { HttpParams, HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AttendanceTypeService {
  private apiUrl = environment.baseIp + environment.apiPrefix;

  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient
  ) {}

  getAttendanceTypeList(params): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}attendance-type/search`, params);
  }

  addAttendanceType(body): Observable<any> {
    return this.httpClientService.post(
      `${this.apiUrl}attendance-type/add`,
      body
    );
  }

  updateAttendanceType(body): Observable<any> {
    return this.httpClientService.post(
      `${this.apiUrl}attendance-type/edit`,
      body
    );
  }

  deleteAttendanceType(body): Observable<any> {
    return this.httpClientService.post(
      `${this.apiUrl}attendance-type/remove`,
      body
    );
  }
}
