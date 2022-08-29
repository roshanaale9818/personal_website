import { Injectable } from "@angular/core";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private localStorageService: LocalStorageService) {
    this.currentUserRoleSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("role"))
    );
    this.currentUserRole = this.currentUserRoleSubject.asObservable();
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("user_info"))
    )
    this.currentUser = this.currentUserSubject.asObservable();

  }
  hasRoleBypath(routeParam): boolean {
    // console.log("ROUTEPARAM", routeParam);
    const userMenu: any[] =
      this.localStorageService.getLocalStorageItem("userMenuDetails");
    //  const userRole= this.localStorageService.getLocalStorageItem('role');
    if (userMenu) {
      const value = userMenu.filter((x) => x.angular_route == routeParam)[0];
      // console.log("VALUE route", value);
      if (value != null) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  }
  getRole() {
    const userMenu: any[] =
      this.localStorageService.getLocalStorageItem("userMenuDetails");
  }
  public currentUserRoleSubject: BehaviorSubject<any>;
  public currentUserRole: Observable<any>;
  //getCurrentUserValue returns the current user role
  public get currentUserRoleValue(): any {
    return this.currentUserRoleSubject.value;
  }

  //for current user i.e user-info in our local storage
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public get currentUserData(): any {
    return this.currentUserSubject.value;
  }
  hasRole(route,url?:string) {
    const currentUser = this.currentUserRoleValue;
    // if (route.data.roles && !route.data.roles.includes(currentUser)) {
    //   // role not authorised so redirect to home page
    //   return false;
    // } else {
    //   return true;
    // }

    //allow  access if it has parent menu
    let parentRoute =route.data.parentMenuRoute;
    const userMenu: any[] =
      this.localStorageService.getLocalStorageItem("userMenuDetails");
    if (userMenu) {
      const value = userMenu.filter((x) => x.angular_route == parentRoute)[0];
      // console.log("VALUE route for id", value);
      if (value != null) {
        return true;
      } else {
        return false;
      }
    }

    return false;


  }
}
