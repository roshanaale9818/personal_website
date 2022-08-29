import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from "@angular/router";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthCanLoadServiceGuard implements CanLoad {
  constructor(private localStorageService: LocalStorageService) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    //determine whether you want to load the module
    //return true or false

    return true;
  }
}
