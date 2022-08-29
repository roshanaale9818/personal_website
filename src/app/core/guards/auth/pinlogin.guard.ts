import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { AuthService } from './services/auth-service.service';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';

@Injectable({
  providedIn: 'root'
})
export class PinloginGuard implements CanActivate  {
  constructor(
    private router:Router,
    private localStorageService:LocalStorageService,
    private authService:AuthService,
    private toastrMessageService:ToastrMessageService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {


    const token = this.localStorageService.getLocalStorageItem(
      "flexYear-token"
    );
    const currentUser = this.authService.currentUserData;
    const isPinLogin = this.localStorageService.getLocalStorageItem("isPinLogin");
    if (!token || !currentUser || isPinLogin ) {
      // this.router.navigate(["/login"]);
      this.toastrMessageService.showError(
        "You are not authorized to access this menu"
      );
      return false;
    }
    return true;
  }
  }
