import { Params } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { GlobalService } from "@app/shared/services/global/global.service";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "../../../../shared/services/local-storage/local-storage.service";
@Injectable({
  providedIn: "root",
})
export class ManageStaffService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();

  constructor(
    private httpClientService: HttpClientService,
    private globalService: GlobalService,
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  getStaffLists(): Observable<any> {
    const queryParams = new HttpParams().set("company_id", this.companyId);
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}staff/index`,
      null,
      queryParams
    );
  }
  pinChangeUserId;
  setUserIdForPinChange(id) {
    this.pinChangeUserId = id;
  }

  getPinChangeUserId() {
    return this.pinChangeUserId;
  }
  getClientStaff(staffId): Observable<any> {
    const params = new HttpParams().set("staff_id", staffId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clientstaff/staff`,
      null,
      params
    );
  }

  getStaffList(params) {
    const queryParams = new HttpParams()
      .set("company_id", this.companyId.toString())
      .set("limit", params.limit)
      .set("page", params.page)
      .set("sortno", params.sortno)
      .set("sortnane", params.sortnane)
      .set("search_key", params.search_key)
      .set("search_value", params.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}staff`,
      null,
      queryParams
    );
  }

  getStaffListWithMultiSearch(body) {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}staff/search`,
      body
    );
  }

  deleteStaffById(body) {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}staff/remove`,
      body,
      null
    );
  }

  getStaffDetailById(id) {
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}staff/details?id=${id}`
    );
  }

  getShiftList() {
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}shifts?company_id=${this.companyId}`
    );
  }

  getLeaveTypeList() {
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}leavetypes?company_id=${this.companyId}`
    );
  }

  getAllowanceList() {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("limit", "")
      .set("page", "")
      .set("sortno", "")
      .set("sortnane", "")
      .set("search_key", "")
      .set("search_value", "");

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}allowances`,
      null,
      params
    );
  }

  getEmployeeType() {
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}employeetypes?company_id=${this.companyId}`
    );
  }

  getPaymentType() {
    const body = {
      company_id: 1,
      limit: 100,
      page: "",
      sortno: 1,
      sortnane: "type",
      search: {
        type: "",
      },
    };
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}payment-types/search`,
      body
    );
  }

  getDesignation() {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("limit", "100")
      .set("page", "1")
      .set("sortno", "")
      .set("sortnane", "")
      .set("search_key", "")
      .set("search_value", "");

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}designations`,
      null,
      params
    );
  }

  addStaff(body) {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}staff/add`,
      body
    );
  }

  updateStaff(body) {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}staff/edit`,
      body
    );
  }

  addStaffProfilePicture(img, staffId) {
    var formData = new FormData();
    formData.append("staff_photo", img.staff_photo);
    formData.append("id", staffId);

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}staff/upload`,
      formData
    );
  }

  getSalaryPeriod() {
    return [
      {
        title: "Hourly",
        value: "H",
      },
      {
        title: "Weekly",
        value: "W",
      },
      {
        title: "Biweekly",
        value: "B",
      },
      {
        title: "Semimonthly",
        value: "S",
      },
      {
        title: "Monthly",
        value: "M",
      },
    ];
  }

  accessToken = this.localStorageService.getLocalStorageItem("flexYear-token");
  uploadCsvBulkImport(body): Observable<any> {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}staff/staffimport`,
      body
    );
  }

  excelExport(body): Observable<any> {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}staff/excel-export`,
      body
    );
  }

  updatePassword(body): Observable<any> {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}staff/changepassword`,
      body
    );
  }

  addAttachment(body) {
    return this.httpClient.post(`${this.baseIp}${this.apiPrefix}staff/attechment`, body);
  }
  deleteAttachment(body) {
    return this.httpClient.post(`${this.baseIp}${this.apiPrefix}staff/remove-attachment`, body);
  }
  getAllEmployeeGroup() {
    let body = {
      access_token: this.globalService.getAccessTokenFromCookie,
      limit: this.globalService.pagelimit,
      page: this.globalService.pageNumber,
      sortnane: "",
      sortno: 1,
      company_id: this.globalService.getCompanyIdFromStorage(),
      search: {
        title: "",
        code: "",
        status: "Active"
      }
    }
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}employee-group/search`,
      body,
    );
  }
  getFundTypeList() {
    let body = {
      company_id:this.companyId,
      limit: "",
      page: "",
      sortnane: "",
      search:{
        details:"",
        status:"Active"
      },
      sortno: 2
    }
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}fund/search`,
      body,
    );
  }
  addStaffFundMultiple(body){
      return this.httpClientService.post(
        `${this.baseIp}${this.apiPrefix}staff-fund/add-multiple`,
        body,
      );

  }
  getStaffFundList(body){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}staff-fund/search`,
      body,
    );
  }
  updateStaffFund(body){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}staff-fund/edit`,
      body,
    );
  }
  removeStaffFund(body){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}staff-fund/remove`,
      body,
    );
  }

}
