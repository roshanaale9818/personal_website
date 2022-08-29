import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from '@app/shared/services/global/global.service';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { DownloadPayrollCSV } from '../components/payroll-view/modal/downloadpayrollcsv.interface';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) { }

  getStaffList(body) {
    const params = new HttpParams().set("company_id", this.globalService.getCompanyIdFromStorage());

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}staff/search`,
      body,
      {
        params: params
      }
    );
  }

  generatePayroll(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}payroll/post`,
      body,
      options
    );
  }
  generatePayrollForStaff(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}payroll/generate`,
      body,
      options
    );
  }
  onAddAdvancedPayroll(bodyObj) {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}payroll/add`,
      bodyObj,
    );
  }
  onEditPayment(bodyObj) {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}payroll/edit`,
      bodyObj,
    );
  }
  onSearchHistory(bodyObj) {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}payroll/history`,
      bodyObj,
    );
  }
  onBulkPay(body) {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}payroll/bulkpay`,
      body,
    );
  }

  onSearchPayRoll(bodyObj) {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}payroll/search`,
      bodyObj,
    );
  }
  getEmployeeTypeList(paramsData): Observable<any> {
    const params = new HttpParams()
      .set("company_id", this.globalService.getCompanyIdFromStorage())
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClient.get(
      `${this.baseIp}${this.apiPrefix}employeetypes`,
      {
        params: params
      }

    );
  }
  getDepartmentList(paramsData) {
    const params = new HttpParams()
      .set("company_id", this.globalService.getCompanyIdFromStorage())
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClient.get(
      `${this.baseIp}${this.apiPrefix}departments`,
      {
        params: params
      }

    );
  }

  getDesignationList(paramsData) {
    const params = new HttpParams()
      .set("company_id", this.globalService.getCompanyIdFromStorage())
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClient.get(
      `${this.baseIp}${this.apiPrefix}designations`,
      { params: params }

    );
  }

  getCurrencyDetail(id) {
    const params = new HttpParams()
      .set("company_id", this.globalService.getCompanyIdFromStorage())
      .set("currency_id", id)


    return this.httpClient.get(
      `${this.baseIp}${this.apiPrefix}currency/detail`,
      { params: params }

    );
  }

  editMultipleAdvance(bodyObj) {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}payslip-add-deduct/edit-multiple`,
      bodyObj,
    );
  }
  getPaySlipAddDeduct(id,type) {
    const params = new HttpParams()
      .set("company_id", this.globalService.getCompanyIdFromStorage())
      .set("payslip_id", id)
       .set("type", type)
    return this.httpClient.get(
      `${this.baseIp}${this.apiPrefix}payslip-add-deduct/detail`,
      {params: params}
    );
  }
  onRemovePayOrDeduction(bodyObj) {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}payslip-add-deduct/remove`,
      bodyObj,
    );
  }
  getCompanyLogo(companyId): Observable<any> {
    const params = new HttpParams().set("company_id", companyId);
    return this.httpClient.get(
      `${this.baseIp}${this.apiPrefix}setting/logo`,

      {params:params}
    );
  }
  getCompanyInfo(companyId):Observable<any> {
    const params = new HttpParams().set("company_id", companyId);
    return this.httpClient.get(
      `${this.baseIp}${this.apiPrefix}company/company-info`,

      {params:params}
    );
  }



  onPayrollList(bodyObj) {
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}payroll/payroll-list`,
      bodyObj,
    );
  }

  onDownLoadCSV(bodyObj:DownloadPayrollCSV){
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}payroll/payroll-csv`,
      bodyObj,
    );
  }

}
