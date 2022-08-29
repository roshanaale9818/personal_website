import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientService } from '@app/core/services/http-client/http-client.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { environment } from "@env/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyregisterService {

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



  addCompany(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}company-registration/add`,
      body,
      options
    );
  }
  userRegister(body){
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}company-registration/userregister`,
      body
    );

  }
  getSystemToken(){
    return this.httpClient.get(
      `${this.baseIp}${this.apiPrefix}apikey/index`
    );
  }
  verifyCompany(paramsData){
    const params = new HttpParams()
    .set("company_id", paramsData.company_id)
    .set("verify_code", paramsData.verify_code)
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}company-registration/verify-company`,
      null,{
        params:params
      }
    );
  }

  getCompanyActivatedStatus(verify_code:string){
    const params = new HttpParams()
    .set("verify_code", verify_code)

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}company-registration/verify-company`,
      null,{
        params:params
      }
    );
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
