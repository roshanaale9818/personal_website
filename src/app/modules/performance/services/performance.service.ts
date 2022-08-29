import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpParams } from "@angular/common/http";
import { GlobalService } from "@app/shared/services/global/global.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { CustomResponse } from "@app/shared/models/custom-response.model";
@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
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
  //search performance
  searchPerformance(searchBody):Observable<CustomResponse>{
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}performances/search`,
      searchBody
    )
  }
  //delete performance
  deletePerformance(obj:{id:number}){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}performances/search`,
      obj
    )
  }
  //Get data by id
  getPerformanceById(paramsData){
    const params = new HttpParams()
    .set("id", paramsData.id)
    .set("date_format", paramsData.date_format);

  return this.httpClientService.get(
    `${this.baseIp}${this.apiPrefix}performances`,
    null,
    params
  );
  }

//edit performance
editPerformance(body){
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}performances/edit`,
    body
  )
}

getCompanyInfo(companyId):Observable<any> {
  const params = new HttpParams().set("company_id", companyId);
  return this.httpClientService.get(
    `${this.baseIp}${this.apiPrefix}company/company-info`,
    null,
    params
  );
}
savePerformance(body){
  // const params = new HttpParams().set("company_id", companyId);
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}performance/add`,
    body,
  );
}


getPerformanceDetailById(dateFormat:string,id:string,companyId:string){
    const params = new HttpParams().
    set("company_id", companyId)
    .set("date_format",dateFormat)
    .set("id",id);
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}performance/list`,
      null,
      params
    );
}

getStaffUnderManager(staffId){
  const params = new HttpParams().
  set("company_id", this.globalService.getCompanyIdFromStorage())
  .set("staff_id",staffId);
  return this.httpClientService.get(
    `${this.baseIp}${this.apiPrefix}staff/staff-manager`,
    null,
    params
  );
}




}
