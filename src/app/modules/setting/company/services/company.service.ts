import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { GlobalService } from "@app/shared/services/global/global.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CompanyService {
  baseIp = environment.baseIp;
  apiUrl = environment.baseIp + environment.apiPrefix;
  apiPrefix = environment.apiPrefix;
  accessToken = this.globalService.getAccessTokenFromCookie();
  companyId = this.globalService.getCompanyIdFromStorage();

  constructor(
    private httpClientService: HttpClientService,
    private globalService: GlobalService,
    private httpClient: HttpClient
  ) {}

  getCompanyList(paramsData) {
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

  addCompany(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}companies/add`,
      body,
      options
    );
  }

  editCompany(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}companies/edit`,
      body,
      options
    );
  }

  deleteCompany(id,subdomain): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    let bodyObj = {
      id:id,
      accessToken:this.accessToken,
      subdomain:subdomain
    }

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}companies/remove`,
      bodyObj
      ,
      options
    );
  }

  getAppAccessToken(subDomain): Observable<any> {
    const params = new HttpParams().set("subdomain", subDomain);

    return this.httpClientService.get(
      `${this.apiUrl}appaccess/accessbydomain`,
      null,
      params
    );
  }

  selectedCompanyDetail;
  setCompanyDetail(detail) {
    this.selectedCompanyDetail = detail;
  }

  getCompanyDetail() {
    return this.selectedCompanyDetail;
  }

  getSubdomainSuggestion(subdomain:string){
    const params = new HttpParams()
    .set("subdomain", subdomain)

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}company-registration/suggest-subdomain`,
      null,{
        params:params
      }
    );
  }
}
