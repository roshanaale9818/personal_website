import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";

import { GlobalService } from "@app/shared/services/global/global.service";
@Injectable({
  providedIn: "root",
})
export class YearlyMonthlyReportService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();
  nepaliYearList = [
    { year: "2077" },
    { year: "2076" },
    { year: "2075" },
    { year: "2074" },
    { year: "2073" },
    { year: "2072" },
    { year: "2071" },
  ];
  englishYearList = [
    { year: "2020" },
    { year: "2019" },
    { year: "2018" },
    { year: "2017" },
    { year: "2016" },
    { year: "2015" },
    { year: "2014" },
  ];
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getYearlyReport(paramsData) {
    const params = new HttpParams()
      .set("user_id", paramsData.user_id)
      .set("year", paramsData.year)
      .set("date_format", paramsData.date_format);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}attendances/yearlyreport`,
      null,
      params
    );
  }
}
