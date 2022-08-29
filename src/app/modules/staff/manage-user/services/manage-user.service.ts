import { Params } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";

import { GlobalService } from "@app/shared/services/global/global.service";
import { environment } from "@env/environment";
@Injectable({
  providedIn: "root",
})
export class ManageUserService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;

  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getStaffList() {
    const getBody = {
      company_id: this.companyId,
      limit: 1000000,
      page: 1,
      sortno: 1,
      sortnane: "",
      search: {
        first_name: "",
        last_name: "",
        middle_name: "",
        mobile: "",
        phone: "",
        email_address: "",
        citizenship_no: "",
        gender: "",
        marital_status: "",
        employee_type: "",
        department_id: "",
        designation_id: "",
        emp_id: "",
        dob: "",
      },
    };
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}staff/index`,
      null,
      params
    );
  }

  getUserList(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}userstaff/search`,
      body,
      options
    );
  }

  getUserLists(): Observable<any> {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}userstaff`,
      null,
      params
    );
  }

  registerUser(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}staff/userregister`,
      body,
      options
    );
  }
  editUser(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}userstaff/edit`,
      body,
      options
    );
  }

  deleteUser(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}userstaff/remove`,
      body,
      options
    );
  }

  // change user status
  changeStatus(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}userstaff/status`,
      body,
      options
    );
  }

  changePin(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}userstaff/pin`,
      body,
      options
    );
  }

  userDetail: any;
  setUserDetail(userDetail) {
    this.userDetail = userDetail;
  }
  getUserDetail() {
    return this.userDetail;
  }

  // get user device list
  getUserDeviceList(paramsData) {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}userdevices`,
      null,
      params
    );
  }

  listAllRoles() {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}roles`,
      null,
      params
    );
  }

  getAssignedRoles(user_id) {
    const params = new HttpParams().set("user_id", user_id);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}assignments`,
      null,
      params
    );
  }

  getRoleswithAssignment(user_id) {
    const params = new HttpParams()
      .set("user_id", user_id)
      .set("company_id", this.companyId);
    let allRoles = this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}roles`,
      null,
      params
    );
    let assignedroles = this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}assignments`,
      null,
      params
    );
    return forkJoin([assignedroles, allRoles]);
  }

  assignRoleToUser(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}roles/add`,
      body,
      options
    );
  }

  removeRoleFromUser(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}roles/remove`,
      body,
      options
    );
  }

  addToWorkFromHome(body){
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}userstaff/edit`,
      body
    );
  }
  bulkEditUserWorkFromHome(body){
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}userstaff/wfh`,
      body
    );
  }
}
