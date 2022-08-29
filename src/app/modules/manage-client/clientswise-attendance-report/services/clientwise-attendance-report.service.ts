import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ClientwiseAttendanceReportService {
  private apiUrl = environment.baseIp + environment.apiPrefix;

  constructor(private httpClientService: HttpClientService) {}

  getClientList(companyId): Observable<any> {
    const params = new HttpParams().set("company_id", companyId);

    return this.httpClientService.get(
      `${this.apiUrl}client/index`,
      null,
      params
    );
  }

  getClientwiseAttendanceReport(param): Observable<any> {
    const params = new HttpParams()
      .set("id", param.id)
      .set("date_from", param.date_from)
      .set("date_to", param.date_to)
      .set("client_id", param.client_id);

    return this.httpClientService.get(
      `${this.apiUrl}attendances/reportclient`,
      null,
      params
    );
  }
}
