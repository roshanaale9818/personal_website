import { Injectable } from '@angular/core';
import { HttpClientService } from '@app/core/services/http-client/http-client.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class TaxslabService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  constructor(
    private httpClientService: HttpClientService,
    private globalService:GlobalService
  ) { }
  getTaxSlabList(paramsData){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}tax-slab/search`,
      paramsData,
    );
  }

  onAddTaxSlab(body){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}tax-slab/add`,
      body,
    );
  }

  onEditTaxSlab(body){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}tax-slab/edit`,
      body,
    );
  }
  onDeleteTaxSlab(bodyObj){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}tax-slab/remove`,
      bodyObj,
    );
  }
  getAllEmployeeGroup(){
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
  onAddEmployeeGroup(body){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}employee-group/add`,
      body,
    );
  }
}
