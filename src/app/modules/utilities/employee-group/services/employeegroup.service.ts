import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientService } from '@app/core/services/http-client/http-client.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { environment } from "@env/environment";
@Injectable({
  providedIn: 'root'
})
export class EmployeegroupService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) { }
  getEmployeeGroupList(paramsData){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}employee-group/search`,
      paramsData,
    );
  }

  onAddEmployeeGroup(body){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}employee-group/add`,
      body,
    );
  }
  
  onEditEmployeeGroup(body){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}employee-group/edit`,
      body,
    );
  }
  onDeleteEmployeeGroup(bodyObj){
    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}employee-group/remove`,
      bodyObj,
    );
  }
}
