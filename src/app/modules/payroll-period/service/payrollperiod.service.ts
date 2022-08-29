import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpParams } from "@angular/common/http";
import { GlobalService } from "@app/shared/services/global/global.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { SearchPayrollPeriod } from "../modal/payrollperiod.interface";
import { SuggestParameterParams } from "../modal/suggestparams.interface";


@Injectable({
  providedIn: 'root'
})
export class PayrollperiodService {
  baseIp = environment.baseIp;
  apiUrl = environment.baseIp + environment.apiPrefix;
  apiPrefix = environment.apiPrefix;
  accessToken = this.globalService.getAccessTokenFromCookie();
  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private globalService: GlobalService
  ) { }
  getCompanyList(paramsData):Observable<CustomResponse> {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}companies`,
      null,
      params
    );
  }
  //search parameters
  searchParametersPeriods(searchBody:SearchPayrollPeriod):Observable<CustomResponse>{
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}payroll-parameter-period/search`,
      searchBody
    )
  }

// add payroll period
  savePayrollPeriod(body){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}payroll-parameter-period/add`,
      body
    )
  }


  // get payroll parameters list
  getPayrollParametersList(body){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}payroll-parameter/search`,
      body
    )
  }



  deletePayrollPeriod(body){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}payroll-parameter-period/remove`,
      body
    )
  }

onPayrollGenerate(body){
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}payroll/payroll-generate`,
    body
  )
}





onPayrollSuggest(paramsData:SuggestParameterParams){
  const params = new HttpParams()
  .set("company_id", String(paramsData.company_id))
  .set("parameter_id", String(paramsData.parameter_id))
  .set("date_type", paramsData.date_type)
  .set("access_token", paramsData.access_token)

  return this.httpClientService.get(
    `${this.baseIp}${this.apiPrefix}payroll-parameter-period/suggest-parameter`,
    null,
    params
  )
}



}

