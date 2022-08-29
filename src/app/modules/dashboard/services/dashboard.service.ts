import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { GlobalService } from "@app/shared/services/global/global.service";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}



  getAdminDashboardSummary(id): Observable<any> {
    const params = new HttpParams().set("company_id", id);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}site/admindashboard`,
      null,
      params
    );
  }
  getStaffDashboardSummary(id){
    const params = new HttpParams().set("company_id", id);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}site/staffdashboard`,
      null,
      params
    );
  }
  getAttandanceCorrection(){
    let params = {
      limit: 10,
      page: 1,
      sortnane: "checkin_datetime",
      sortno: 2,
      company_id: this.globalService.getCompanyIdFromStorage(),
      search: {
        user_id: "",
        checkin_datetime: "",
        checkout_datetime: "",
        correction_status: "P",
        checked_by: "",
        checkin_message: "",
        correction_request: 1,
      },
    };
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}attendance/search`,
      params,
      null
    );
  }
  getLeaveRequest(){
    let params = {
      company_id:this.globalService.getCompanyIdFromStorage(),
      limit:10,
      page:"1",
      sortno:2,
      sortnane:"date_to",
      search:{
        staff_id:"",date_to:"",date_from:"",description:"",leave_type:"",status:"0"}}
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}leaves/search`,
      params,
      null
    );
  }

  updateAttendanceCorrection(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(`${this.baseIp}${this.apiPrefix}attendance/edit`, body, options);
  }


}
