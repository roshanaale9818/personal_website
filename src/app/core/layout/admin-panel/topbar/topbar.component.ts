import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { environment } from "@env/environment";
import { LoginService } from "@app/modules/auth/login/services/login.service";
import { HelperService } from "@app/shared/services/helper/helper.service";
import { LayoutService } from "../../services/layout.service";
import { SettingService } from "@app/modules/setting/general-setting/services/setting.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { GlobalService } from "@app/shared/services/global/global.service";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})
export class TopbarComponent implements OnInit {
  defaultImagePath = environment.defaultImagePath;
  imageUrl = environment.baseImageUrl;
  selectedLanguage: string;
  user_id = this.localStorageService.getLocalStorageItem("staff_id");

  constructor(
    private router: Router,
    private loginService: LoginService,
    private helperService: HelperService,
    private layoutService: LayoutService,
    private generalSettingService: SettingService,
    private localStorageService: LocalStorageService,
    private globalService: GlobalService
  ) {}
  navigateToDashboard() {
    this.router.navigate(["/dashboard/admin"]);
  }
  companyName;
  ngOnInit() {
    this.companyId = this.globalService.getCompanyIdFromStorage();
    this.getUserInfo();
    this.getCompanyLogo();
    // console.log(this.user_id);
    this.globalService.getCompanyName.subscribe((data)=>{
      if(data){
        this.companyName = data;
      }
    })
  }

  detail;
  companyId: number;
  getCompanyLogo(): void {
    // console.log("PSDADSAD",this.companyId)
    this.generalSettingService
      .getCompanyLogo(this.companyId)
      .subscribe((response) => {
        this.detail = response;
      });
  }
  isPinLogin:boolean;
  userInfo: any;
  getUserInfo() {
    this.userInfo = this.loginService.getUserInfoFromStorage();
    this.getUserFullName();
    this.isPinLogin = this.localStorageService.getLocalStorageItem("isPinLogin");
  }

  userName: string;
  getUserFullName() {
    if (this.userInfo) {
      this.userName = this.helperService.getFullName(this.userInfo);
    } else {
      this.userName = "Unknown";
    }
    this.layoutService.setUserFullName(this.userName);
  }

  toogleSideNav() {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  }

  navigateToStaffDetail(): void {
    //route to new profile component
    // this.router.navigate(["staff/manage-staff/view", this.user_id]);
    this.router.navigate(["/profile"]);
  }
}
