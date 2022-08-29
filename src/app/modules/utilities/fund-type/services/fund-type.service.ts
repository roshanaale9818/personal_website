import { environment } from "@env/environment";
import { Injectable } from "@angular/core";
import { HttpClientService } from "../../../../core/services/http-client/http-client.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FundTypeService {
  private apiUrl = environment.baseIp + environment.apiPrefix;

  constructor(private httpClientService: HttpClientService) {}

  getFundTypeList(body): Observable<any> {
    return this.httpClientService.post(`${this.apiUrl}fund/search`, body);
  }

  addFundTypeList(body): Observable<any> {
    return this.httpClientService.post(`${this.apiUrl}fund/add`, body);
  }

  updateFundTypeList(body): Observable<any> {
    return this.httpClientService.post(`${this.apiUrl}fund/edit`, body);
  }

  deleteFundTypeList(body): Observable<any> {
    // return this.httpClientService.post(`${this.apiUrl}fund/delete`, body);
    return this.httpClientService.post(`${this.apiUrl}fund/remove`, body);

  }
}
