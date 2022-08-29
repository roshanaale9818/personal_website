import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

import { HttpClientService } from "@app/core/services/http-client/http-client.service";

import { GlobalService } from "@app/shared/services/global/global.service";
@Injectable({
  providedIn: "root",
})
export class MessageService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();
  constructor(
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private globalService: GlobalService
  ) {}

  //   get attendance detail...
  getMessageContactList(id) {
    const params = new HttpParams()
      .set("id", id)
      .set("company_id", this.companyId);
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}messages/accessmessage`,
      null,
      params
    );
  }
  getMessage(paramsObject) {
    const params = new HttpParams()
      .set("sender_id", paramsObject.sender_id)
      .set("receiver_id", paramsObject.receiver_id);
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}messages`,
      null,
      params
    );
  }
  sendMessage(paramsObject): Observable<any> {
    const params = new HttpParams()
      .set("receiver_id", paramsObject.receiver_id)
      .set("sender_id", paramsObject.sender_id)
      .set("message", paramsObject.message);

    return this.httpClientService.post(
      `${this.baseIp}${this.apiPrefix}messages/post`,
      null,
      null,
      params
    );
  }
}
