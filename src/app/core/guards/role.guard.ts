import { ToastrMessageService } from "./../../shared/services/toastr-message/toastr-message.service";
import { Injectable } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth/services/auth-service.service";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastrMessageService: ToastrMessageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    //pass the state for getting the role
    // console.log("RouteID", route.paramMap.get("id"));
    const hasRole = route.paramMap.get("id")
      ? this.authService.hasRole(route, state.url)
      : this.authService.hasRoleBypath(state.url);
    //if it has role it returns true else false
    // console.log("hasRole", hasRole);
    if (hasRole) {
      return true;
    } else {
      this.toastrMessageService.showError(
        "You are not authorized to access this menu"
      );
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
