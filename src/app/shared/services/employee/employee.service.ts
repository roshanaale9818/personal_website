import { GlobalService } from "@app/shared/services/global/global.service";
import { HttpClientService } from "./../../../core/services/http-client/http-client.service";
import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();

  constructor(
    private httpClientService: HttpClientService,
    private globalService: GlobalService
  ) {
    this.getStaffList();
  }

  getEmployeeList(): Observable<any> {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}staff/index`,
      null,
      params
    );
  }

  getStaffList() {
    let staffList;
    this.getEmployeeList().subscribe((response) => {
      if (response.status) {
        staffList = response.data;
      } else {
        staffList = [];
      }
      return staffList;
    });
  }
}
