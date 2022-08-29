import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BreakReportService {
  private apiUrl = environment.baseIp + environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();

  constructor(
    private httpClientService: HttpClientService,
    private globalService: GlobalService
  ) {}

  getStaffList() {
    const params = new HttpParams().set("company_id", this.companyId);
    return this.httpClientService.get(`${this.apiUrl}staff`, null, params);
  }

  getBreakReport(paramData): Observable<any> {
    const params = new HttpParams()
      .set("id", paramData.id)
      .set("date_from", paramData.date_from)
      .set("date_to", paramData.date_to);

    return this.httpClientService.get(
      `${this.apiUrl}attendances/breakreport`,
      null,
      params
    );
  }
}
