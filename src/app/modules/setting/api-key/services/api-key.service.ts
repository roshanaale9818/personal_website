import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiKeyService {
  private apiUrl = environment.baseIp + environment.apiPrefix;

  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder
  ) {}

  getApiKeyLists(): Observable<any> {
    return this.httpClientService.get(`${this.apiUrl}apikey/index`);
  }
}
