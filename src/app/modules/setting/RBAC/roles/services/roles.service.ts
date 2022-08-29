import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RolesService {
  constructor(private http: HttpClient) {}
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  selectedRoles;
  setRolesList(roles): void {
    this.selectedRoles = roles;
  }

  getRolesList() {
    return this.selectedRoles;
  }

  getAllRolesList(companyId): Observable<any> {
    let params = new HttpParams().set("company_id", companyId);
    return this.http.get(`${this.baseIp}${this.apiPrefix}role/index`, {
      headers: null,
      params: params,
    });
  }
  //for single role detail
  getRoleByName(companyId, roleName) {
    let params = new HttpParams()
      .set("company_id", companyId)
      .set("name", roleName);
    return this.http.get(`${this.baseIp}${this.apiPrefix}role/index`, {
      headers: null,
      params: params,
    });
  }

  addRole(bodyObj) {
    return this.http.post(
      `${this.baseIp}${this.apiPrefix}role/addrole`,
      bodyObj
    );
  }

  assignRoute(bodyObj): Observable<any> {
    return this.http.post(
      `${this.baseIp}${this.apiPrefix}role/assign-route`,
      bodyObj
    );
  }
  removeRole(bodyObj): Observable<any> {
    return this.http.post(
      `${this.baseIp}${this.apiPrefix}role/removerole`,
      bodyObj
    );
  }
  removeRoute(bodyObj): Observable<any> {
    return this.http.post(
      `${this.baseIp}${this.apiPrefix}role/remove-route`,
      bodyObj
    );
  }

  getRoleRoute(roleName, companyId) {
    let params = new HttpParams()
      .set("role_name", roleName)
      .set("company_id", companyId);
    return this.http.get(`${this.baseIp}${this.apiPrefix}role/list-route`, {
      headers: null,
      params: params,
    });
  }

  getAllMenus(companyId) {
    let params = new HttpParams().set("company_id", companyId);
    return this.http.get(`${this.baseIp}${this.apiPrefix}menu/list`, {
      headers: null,
      params: params,
    });
  }
  editRole(bodyObj) {
    return this.http.post(
      `${this.baseIp}${this.apiPrefix}role/editrole`,
      bodyObj
    );
  }
}
