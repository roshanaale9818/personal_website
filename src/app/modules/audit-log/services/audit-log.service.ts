import { Injectable } from "@angular/core";
import {HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { GlobalService } from "@app/shared/services/global/global.service";
@Injectable({
  providedIn: "root",
})
export class AuditLogService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;

  accessToken = this.globalService.getAccessTokenFromCookie();
  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  getAuditLogs(body){
    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}auditlog/search`,
      body
    );
  }
}
