import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "@app/shared/services/global/global.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CookieService } from "ngx-cookie-service";
import { AppAccessRootModel } from "../../model/company.model";
import { CompanyService } from "../../services/company.service";

@Component({
  selector: "app-company-detail",
  templateUrl: "./company-detail.component.html",
  styleUrls: ["./company-detail.component.scss"],
})
export class CompanyDetailComponent implements OnInit {
  selectedCompany;
  modalTitle: string;
  subDomain;
  appAccessData: AppAccessRootModel;

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private globalService: GlobalService,
    private modalService: BsModalService,
    private cookieService: CookieService
  ) {
    this.selectedCompany = this.companyService.getCompanyDetail();
    this.subDomain = this.selectedCompany.subdomain;
  }
  modalRef: BsModalRef;
  ngOnInit() {
    this.getAppAccess();
    // this.localStorageService.setLocalStorageItem(
    //   "temp_company_id",
    //   this.selectedCompany.company_id
    // );
  }

  navigateToSwitchCompany() {
    // let userInfo = this.localStorageService.getLocalStorageItem("user_info");

    // userInfo.company_id = this.route.snapshot.params.id;
    // console.log(userInfo, "USERINFO");

    this.globalService.setCompanyId(this.route.snapshot.params.id);
    this.localStorageService.setLocalStorageItem('changedCompanyId',this.route.snapshot.params.id);
    this.localStorageService.setLocalStorageItem('companyName',this.selectedCompany.company_name);
    // this.globalService.getCompanyIdFromStorage();
    this.globalService.companyName.next(this.selectedCompany.company_name);
    this.router.navigate(["/dashboard/admin"]);
    this.reloadPage();
  }

  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  viewTokenModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  getAppAccess(): void {
    this.companyService
      .getAppAccessToken(this.subDomain)
      .subscribe((response) => {
        this.appAccessData = response;
        console.log(response);
      });
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }
}
