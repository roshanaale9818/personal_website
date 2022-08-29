import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";

import { GlobalService } from "@app/shared/services/global/global.service";
@Injectable({
  providedIn: "root",
})
export class ClientService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;

  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getClientEmployeeList(paramsData): Observable<any> {
    const params = new HttpParams()
      .set(
        "company_id",
        paramsData.company_id ? paramsData.company_id : this.companyId
      )
      .set("client_id", paramsData.clientId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}staff/staff-not-in-client`,
      null,
      params
    );
  }

  clientBasicInformation: any;
  // list of all staffs..
  getStaffList() {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}staff`,
      null,
      params
    );
  }

  getClientBasicInformationList(paramsData) {
    const params = new HttpParams().set(
      "company_id",
      paramsData.company_id ? paramsData.company_id : this.companyId
    );
    // .set("limit", paramsData.limit)
    // .set("page", paramsData.page)
    // .set("sortno", paramsData.sortno)
    // .set("sortnane", paramsData.sortnane)
    // .set("search_key", paramsData.search_key)
    // .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clients`,
      null,
      params
    );
  }

  addClientBasicInformation(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clients/add`,
      body,
      options
    );
  }

  deleteClient(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clients/remove`,
      id,
      options
    );
  }

  editClientBasicInformation(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clients/edit`,
      body,
      options
    );
  }

  setClientInformation(dataItem) {
    this.clientBasicInformation = dataItem;
  }
  getClientInformation() {
    return this.clientBasicInformation;
  }

  // clients contact persons api section.............

  getClientsContact(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientcontacts/search`,
      body,
      options
    );
  }

  addClientContact(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientcontacts/add`,
      body,
      options
    );
  }

  deleteClientContact(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientcontacts/remove`,
      id,
      options
    );
  }

  editClientContact(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientcontacts/edit`,
      body,
      options
    );
  }

  // client department section.......

  getClientsDeparment(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientdepartments/search`,
      body,
      options
    );
  }

  addClientDepartment(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientdepartments/add`,
      body,
      options
    );
  }

  deleteClientDepartment(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientdepartments/remove`,
      id,
      options
    );
  }

  editClientDepartment(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientdepartments/edit`,
      body,
      options
    );
  }

  // client divison section.............

  getClientsDivisions(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientdivisions/search`,
      body,
      options
    );
  }

  addClientDivisions(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientdivisions/add`,
      body,
      options
    );
  }

  deleteClientDivisions(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientdivisions/remove`,
      id,
      options
    );
  }

  editClientDivisions(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientdivisions/edit`,
      body,
      options
    );
  }

  // client employees section................
  getClientsEmployees(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientstaff/search`,
      body,
      options
    );
  }

  getClientsEmployee(clientId) {
    const params = new HttpParams().set("client_id", clientId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clientstaff/index`,
      null,
      params
    );
  }

  addClientEmployees(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientstaff/add-multiple`,
      body,
      options
    );
  }

  deleteClientEmployees(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientstaff/remove`,
      id,
      options
    );
  }

  editClientEmployees(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientstaff/edit`,
      body,
      options
    );
  }

  // client Ip Address..................

  // getClientsIps(body) {
  //   const options = {
  //     headers: new HttpHeaders({
  //       "Content-Type": "application/json"
  //     })
  //   };

  //   return this.httpClient.post(
  //     `${this.baseIp}${this.apiPrefix}clientips/search`,
  //     body,
  //     options
  //   );
  // }
  getClientsIps(client_id) {
    const params = new HttpParams().set("client_id", client_id);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clientips`,
      null,
      params
    );
  }

  addClientIps(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientips/add`,
      body,
      options
    );
  }

  deleteClientIps(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientips/remove`,
      id,
      options
    );
  }

  editClientIps(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientips/edit`,
      body,
      options
    );
  }

  // // Client Shift

  getClientShiftList(clientId): Observable<any> {
    const params = new HttpParams().set("client_id", clientId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clientshift/index`,
      null,
      params
    );
  }

  getClientShift(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientshift/search`,
      body,
      options
    );
  }

  getClientShifts() {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientshift`,
      null,
      options
    );
  }

  addClientShift(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientshift/add`,
      body,
      options
    );
  }

  deleteClientShift(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientshift/remove`,
      id,
      options
    );
  }

  editClientShift(body): Observable<any> {
    // const options = {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json",
    //   }),
    // };

    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}clientshift/edit`,
      body
    );
  }

  // Client Attendance Threshold

  getClientAttendanceThreshold(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}client-attendance-thresold/search`,
      body,
      options
    );
  }

  addClientAttendanceThreshold(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}client-attendance-thresold/add`,
      body,
      options
    );
  }

  editClientAttendanceThreshold(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}client-attendance-thresold/edit`,
      body,
      options
    );
  }

  deleteClientAttendanceThreshold(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}client-attendance-thresold/remove`,
      id,
      options
    );
  }

  getShiftByCompanyId(): Observable<any> {
    const params = new HttpParams().set(
      "company_id",
      this.globalService.getCompanyIdFromStorage()
    );
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clientshift/company-shift`,
      null,
      params
    );
  }

  // Client Employee Shift

  getClientStaffShift(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientstaffshift/search`,
      body,
      options
    );
  }

  addClientStaffShift(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientstaffshift/add`,
      body,
      options
    );
  }

  addMultipleClientStaffShift(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientstaffshift/add-multiple`,
      body,
      options
    );
  }

  editClientStaffShift(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientstaffshift/edit`,
      body,
      options
    );
  }

  deleteClientStaffShift(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}clientstaffshift/remove`,
      id,
      options
    );
  }

  // CSV Upload for Client Employee
  addClientCsvUpload(body): Observable<any> {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}client/csv-uploads`,
      body
    );
  }

  selectedClientShiftId: any;
  setClientShiftId(dataItem): void {
    this.selectedClientShiftId = dataItem;
  }

  getClientShiftId(dataItem) {
    return this.selectedClientShiftId;
  }

  /** Grace Report API  **/
  addGraceTime(body) {
    return this.httpClientService.post(
      ` ${this.baseIp}${this.apiPrefix}grace-time/add`,
      body
    );
  }

  getGraceTime(clientId, clientShiftId) {
    const params = new HttpParams()
      .set("client_id", clientId)
      .set("client_shift_id", clientShiftId);
    const headers = new HttpHeaders().set("Content-Type", "");

    return this.httpClient.get(
      `${this.baseIp}${this.apiPrefix}grace-time/detail`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  updateGraceTime(body) {
    return this.httpClientService.post(
      ` ${this.baseIp}${this.apiPrefix}grace-time/edit`,
      body
    );
  }

  // GET BREAK LIST OF CLIENT SHIFT ..........
  getBreakTypeList(params): Observable<any> {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}attendance-type/search`,
      params
    );
  }

  getBreakLists(clientShiftId): Observable<any> {
    const params = new HttpParams().set("client_shift_id", clientShiftId);
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clientshift/break`,
      null,
      params
    );
  }

  // To change the role of Client Employees
  changeClientEmployeeRole(body): Observable<any> {
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}clientstaff/change-role`,
      body
    );
  }

  getClientFromStaff(staffId): Observable<any> {
    const params = new HttpParams().set("staff_id", staffId);
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}clientstaff/staff`,
      null,
      params
    );
  }
}
