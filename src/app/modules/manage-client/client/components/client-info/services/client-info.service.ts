import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { HttpClientService } from "../../../../../../core/services/http-client/http-client.service";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class ClientInfoService {
  private apiUrl = environment.baseIp + environment.apiPrefix;

  constructor(private httpClientService: HttpClientService) {}

  getLocationLists(clientLocationId): Observable<any> {
    console.log(" Client Location ID" + clientLocationId);
    const params = new HttpParams().set("client_location_id", clientLocationId);
    return this.httpClientService.get(
      `${this.apiUrl}clientlocation/location`,
      null,
      params
    );
  }
}
