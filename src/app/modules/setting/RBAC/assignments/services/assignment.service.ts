import { Injectable } from '@angular/core';
import { HttpClientService } from '@app/core/services/http-client/http-client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;

  constructor(private httpClientService: HttpClientService,
    private httpClient:HttpClient) { }
  getUserList(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.httpClient.post(
      `${this.baseIp}${this.apiPrefix}userstaff/search`,
      body,
      options
    );
  }
}
