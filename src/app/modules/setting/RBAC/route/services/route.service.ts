import { HttpClientService } from "./../../../../../core/services/http-client/http-client.service";
import { GlobalService } from "./../../../../../shared/services/global/global.service";
import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RouteService {
  apiUrl = environment.baseIp + environment.apiPrefix;
  companyId = this.globalService.getCompanyIdFromStorage();

  constructor(
    private globalService: GlobalService,
    private httpClientService: HttpClientService
  ) {}

  getMenuList(): Observable<any> {
    const params = new HttpParams().set("company_id", this.companyId);
    return this.httpClientService.get(`${this.apiUrl}menu/list`, null, params);
  }

  getRouteList(body): Observable<any> {
    const params = new HttpParams().set("company_id", this.companyId);

    return this.httpClientService.post(
      `${this.apiUrl}menu/search`,
      body,
      null,
      params
    );
  }

  addRouteList(body): Observable<any> {
    return this.httpClientService.post(`${this.apiUrl}menu/add`, body);
  }

  updateRouteList(body): Observable<any> {
    return this.httpClientService.post(`${this.apiUrl}menu/edit`, body);
  }

  deleteRouteList(body): Observable<any> {
    return this.httpClientService.post(`${this.apiUrl}menu/remove`, body);
  }
}
