import { UserPreference } from "./../models/user-preference-setting.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserPreferenceSettingService {
  private apiUrl = environment.baseIp + environment.apiPrefix;

  constructor(private httpClientService: HttpClientService) {}

  getUserPreferenceSetting(userId): Observable<any> {
    const params = new HttpParams().set("user_id", userId);
    return this.httpClientService.get(
      `${this.apiUrl}userpreference/userdata`,
      null,
      params
    );
  }

  getUserType(): Observable<any> {
    return this.httpClientService.get(`${this.apiUrl}userpreference/type`);
  }

  addUserPreference(body): Observable<any> {
    return this.httpClientService.post(
      `${this.apiUrl}userpreference/add`,
      body
    );
  }

  updateUserPreference(body): Observable<any> {
    return this.httpClientService.post(
      `${this.apiUrl}userpreference/edit`,
      body
    );
  }
}
