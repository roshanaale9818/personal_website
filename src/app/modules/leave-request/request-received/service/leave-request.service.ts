import { Observable } from "rxjs";
import { LocalStorageService } from "./../../../../shared/services/local-storage/local-storage.service";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { GlobalService } from "@app/shared/services/global/global.service";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class LeaveRequestService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  accessToken = this.globalService.getAccessTokenFromCookie();

  constructor(
    private httpClientService: HttpClientService,
    private globalService: GlobalService,
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}
  // staff_id = this.localStorageService.getLocalStorageItem("user_id");
  company_id = this.globalService.getCompanyIdFromStorage();
  // getLeaveRequests(paramsData) {
  //   const params = new HttpParams()
  //     .set("limit", paramsData.limit)
  //     .set("page", paramsData.page)
  //     .set("sortno", paramsData.sortno)
  //     .set("sortnane", paramsData.sortnane)
  //     .set("search_key", paramsData.search_key)
  //     .set("search_value", paramsData.search_value)
  //     .set("company_id", this.company_id);

  //   return this.httpClientService.get(
  //     `${this.baseIp}${this.apiPrefix}leaves`,
  //     null,
  //     params
  //   );
  // }

  getLeaveRequests(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}leaves/search`,
      body
    );
  }

  deleteLeaveRequest(id) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}leaves/remove`,
      id,
      options
    );
  }
  leaveRequest: any;
  setSelectedLeaveRequests(dataItem) {
    this.leaveRequest = dataItem;
  }

  getSelectedLeaveRequest() {
    return this.leaveRequest;
  }

  updateLeaveStatus(body): Observable<any> {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}leave/status`,
      body
    );
  }
  getClientStaff(staffId): Observable<any> {
    const params = new HttpParams().set("staff_id", staffId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clientstaff/staff`,
      null,
      params
    );
  }

  getUserList() {
    const params = new HttpParams().set("company_id", this.company_id);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}userstaff`,
      null,
      params
    );
  }
  searchStaffId;
  setSearchStaffId(staffId){
    this.searchStaffId = staffId;
  }
  get getSearchStaffId(){
    return this.searchStaffId;
  }
}
