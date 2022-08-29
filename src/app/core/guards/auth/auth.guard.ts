import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { CookieService } from "ngx-cookie-service";
import { AuthService } from "./services/auth-service.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private authService:AuthService
  ) {}

  canActivate(): boolean {
    const token = this.localStorageService.getLocalStorageItem(
      "flexYear-token"
    );
    const currentUser = this.authService.currentUserData;
    if (!token) {
      this.router.navigate(["/login"]);
      return false;
    }
    return true;
  }
}
