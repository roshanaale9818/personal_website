
import { Injectable } from "@angular/core";
import { GlobalService } from "@app/shared/services/global/global.service";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { Currency } from "../modal/currency.modal";

@Injectable({
  providedIn: "root",
})
export class CurrencyService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();
  selectedShift: Currency;

  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getCurrenyList(body) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

      return this.httpClient.post(
        `${this.baseIp}${this.apiPrefix}currency/search`,
        body,
        options
      );
  }

  // add method
  addCurrency(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}currency/add`,
      body,
      options
    );
  }
  // edit method
  editCurrency(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}currency/edit`,
      body,
      options
    );
  }

  // delet method
  deleteCurrency(id,companyId): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    let body = {
      access_token:this.globalService.getAccessTokenFromCookie(),
      id:id,
      company_id:companyId
    }

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}currency/remove`,
      body,
      options
    );
  }

  setSelectedShift(shift): void {
    this.selectedShift = shift;
  }

  getSelectedShift() {
    return this.selectedShift;
  }
}
