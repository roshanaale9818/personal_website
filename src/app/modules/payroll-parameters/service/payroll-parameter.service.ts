import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpParams } from "@angular/common/http";
import { GlobalService } from "@app/shared/services/global/global.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { SearchPayrollParameter } from "../modal/payrollparameter.interface";

@Injectable({
  providedIn: 'root'
})
export class PayrollParameterService {
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
  searchParameters(searchBody:SearchPayrollParameter):Observable<CustomResponse>{
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}payroll-parameter/search`,
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





// save parameters for new
saveParameters(body){
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}payroll-parameter/add`,
    body
  )
}
// edit parameters for new
editParameters(body){
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}payroll-parameter/edit`,
    body
  )
}

// edit save parameters
editSaveParameters(body){
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}payroll-parameter/edit`,
    body
  )
}



deleteParameter(body){
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}payroll-parameter/remove`,
    body
  )
}



getStaffListWithMultiSearch(body) {
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}staff/search`,
    body
  );
}

// get department list
getDepartmentList(body){
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}department/search`,
    body
  );
}


getShiftList(body){
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}shift/search`,
    body
  );
}

//assign employees
assignEmployees(body){
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}payroll-staff/add`,
    body
  );
}



//getSavedStaffs
getAssignedEmployees(body){
  return this.httpClientService.post(
    `${this.baseIp}${this.apiPrefix}payroll-staff/search`,
    body
  );
}



}
