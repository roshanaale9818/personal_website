import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientService } from '@app/core/services/http-client/http-client.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  apiUrl = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();

  constructor(
    private httpClient: HttpClient,
    private httpClientService: HttpClientService,
    private globalService: GlobalService
  ) {}

  getWeekendList(): Observable<any> {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.apiUrl}${this.apiPrefix}weekends`,
      null,
      params
    );
  }
  getWeekendArray(): Observable<any> {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.get(
      `${this.apiUrl}${this.apiPrefix}weekend/detail`,
      null,
      params
    );
  }

  // add weekend days
  addWeekends(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    let obj = {
      company_id : this.globalService.getCompanyIdFromStorage(),
      data:body
    }

    return this.httpClient.post(
      `${this.apiUrl}${this.apiPrefix}weekends/add`,
      obj,
      options
    );
  }

  deleteWeekend(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.apiUrl}${this.apiPrefix}weekends/remove`,
      id,
      options
    );
  }
  addShift(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.apiUrl}${this.apiPrefix}shifts/add`,
      body,
      options
    );
  }
  getShiftList(paramsData) {
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("limit", paramsData.limit)
      .set("page", paramsData.page)
      .set("sortno", paramsData.sortno)
      .set("sortnane", paramsData.sortnane)
      .set("search_key", paramsData.search_key)
      .set("search_value", paramsData.search_value);

    return this.httpClientService.get(
      `${this.apiUrl}${this.apiPrefix}shifts`,
      null,
      params
    );
  }
  // edit method for shift
  editShift(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.httpClient.post(
      `${this.apiUrl}${this.apiPrefix}shifts/edit`,
      body,
      options
    );
}
  // delet method
  deleteShift(id): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.apiUrl}${this.apiPrefix}shifts/remove`,
      id,
      options
    );
  }

  getFundTypeList(body): Observable<any> {
    return this.httpClientService.post(`${this.apiUrl}${this.apiPrefix}fund/search`, body);
  }

  addFundTypeList(body): Observable<any> {
    return this.httpClientService.post(`${this.apiUrl}${this.apiPrefix}fund/add`, body);
  }

  updateFundTypeList(body): Observable<any> {
    return this.httpClientService.post(`${this.apiUrl}${this.apiPrefix}fund/edit`, body);
  }

  deleteFundTypeList(body): Observable<any> {
    // return this.httpClientService.post(`${this.apiPrefix}fund/delete`, body);
    return this.httpClientService.post(`${this.apiUrl}${this.apiPrefix}fund/remove`, body);

  }
}
