import { Component, OnInit, TemplateRef } from "@angular/core";
import { CompanyService } from "../../services/company.service";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { GlobalService } from "@app/shared/services/global/global.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { CompanyModel, RegisterUserModel } from "../../model/company.model";
import { GridDataResult } from "@progress/kendo-angular-grid";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { SortDescriptor, State } from "@progress/kendo-data-query";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { MaskConst } from "@app/shared/constants/mask.constant";
import { Router } from "@angular/router";
import { debounceTime, switchMap } from "rxjs/operators";

@Component({
  selector: "app-company-list",
  templateUrl: "./company-list.component.html",
  styleUrls: ["./company-list.component.scss"],
})
export class CompanyListComponent implements OnInit {
  companyListLoading: boolean = false;
  phoneMask = MaskConst.PHONE_NUMBER;
  gridView: GridDataResult;
  companyDetail: CompanyModel;
  companyForm: FormGroup;
  submitButton: string;
  skip = 0;
  submitted: boolean;
  language: any;
  editMode: boolean;
  paginationMode = true;
  emailPattern = RegexConst.EMAIL;
  phonePattern = RegexConst.PHONE_NO;
  newCompanyId: number;
  createCompany: boolean = false;

  navigateToCompanyDetail(detail) {
    this.companyService.setCompanyDetail(detail);
    this.router.navigate(["setting/company/details", detail.company_id]);
  }

  // Modal fields
  modalRef: BsModalRef;
  modalTitle: string;

  config = {
    // modal config to unhide modal when clicked outside
    backdrop: true,
    ignoreBackdropClick: true,
  };

  // API properties
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);
  constructor(
    private companyService: CompanyService,
    private globalService: GlobalService,
    private modalService: BsModalService,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private router: Router,
    // private bsModelRef: BsModalRef
  ) { }

  ngOnInit() {
    this.getCompanyList();
    this.createCompanyForm();
    this.buildForm();
  }

  createCompanyForm() {
    this.companyForm = this.fb.group({
      id: "",
      company_name: ["", Validators.required],
      address: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]],
      phone: ["", [Validators.required, Validators.pattern(this.phonePattern)]],
      remarks: [""],
      subdomain: ["", [Validators.required, this.patternValidator()]],
      status: [""],
      template: ["", [Validators.required]]
    });
  }

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      // const regex = new RegExp("^[a-z]*$");
      // const valid = regex.test(control.value);
      // return valid ? null : { invalidDomain: true };
    };
  }

  getCompanyList(): void {
    this.companyListLoading = true;
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };

    this.companyService.getCompanyList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {

          this.gridView = { data: response.data, total: response.count };

          this.gridView.data.forEach(
            (item) => (item.status = item.status ? "Active" : "Inactive")
          );
          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.toastrMessageService.showError(error.name);
        this.companyListLoading = false;
      },
      () => {
        this.companyListLoading = false;
      }
    );
  }

  get subdomain() {
    return this.companyForm.get("subdomain");
  }

  addCompany() {
    let template = this.companyForm.get('template').value;
    this.companyForm.get('template').setValue(parseInt(template));
    let body = this.companyForm.value;
    body = this.companyForm.value;
    body.phone = body.phone.replace(/\-/g, "");
    body.subdomain = this.subdomainSuggestion + ".flexyear.com";
    // console.log("phone",body)
    this.companyService.addCompany(body).subscribe(
      (response: RegisterUserModel) => {
        if (response.status) {
          this.toastrMessageService.showSuccess("Company Added successfully");
          this.modalRef.hide();

          this.newCompanyId = response.data.company_id
            ? response.data.company_id
            : null;
          this.companyForm.reset();

          localStorage.setItem(
            "company_staff_id",
            JSON.stringify(response.staff_id)
          );
          // openm
          this.router.navigate([
            "setting/company/company-user",
            this.newCompanyId,
          ]);

          // this.router.navigate(["/setting/company/company-user"]);
        } else if (response.data.email) {
          this.toastrMessageService.showError(response.data.email[0]);
        } else if (response.data.subdomain) {
          this.toastrMessageService.showError(response.data.subdomain[0]);
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }
  get subdomainSuggestion() {
    const subdomainValue = this.companyForm.get("subdomain");
    return subdomainValue.value.toLowerCase().replace(/[\/\s]+/gi, "-");

  }
  editCompany() {
    if (this.companyForm.pristine) {
      this.modalRef.hide();
      return;
    }
    let body = this.companyForm.value;
    body = this.companyForm.value;
    body.phone = body.phone.replace(/\-/g, "");
    body.subdomain = this.subdomainSuggestion + ".flexyear.com";
    this.companyService.editCompany(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toastrMessageService.showSuccess("Company updated successfully");
          this.modalRef.hide();
          this.getCompanyList();
          this.companyForm.reset();
        }
        else {
          // this.toasterMessageService.showError(res.response)
          if (response.data && response.data) {
            for (let x in response.data) {
              console.log("this is ex", x);
              this.toastrMessageService.showHTMLErrorMessage(response.data[x])
            }
            // response.data.forEach(x=>{
            //   this.toastrMessageService.showError(x);
            // })
          }
          if (response && response.userdata) {
            for (let x in response.userdata) {
              this.toastrMessageService.showHTMLErrorMessage(response.userdata[x][0])
            }

          }
        }
      },
      (error) => {
        // this.toastrMessageService.showError(error);

      }
    );
  }

  deleteCompanyById(id, subdomain) {
    this.companyService.deleteCompany(id, subdomain).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.getCompanyList();
          this.toastrMessageService.showSuccess("Company deleted succesfully");
        }
        else {
          this.toastrMessageService.showError(response.response)
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  // Modal

  companyViewModal(template, data): void {
    this.companyDetail = data;
    this.modalTitle = "View Company";
    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(company) {
    this.setConfirmationDialogMethods(company)
    const companyId = {
      id: company.company_id,
    };

    // let modelRef: BsModalRef
    // console.log("this is bsmodelref",this.bsModelRef);
    // return;
    // let confirmComponent = new ConfirmationDialogComponent(this.bsModelRef)
    // confirmComponent.showConfirmationInput = true;
    // confirmComponent.showConfirmationLabel = "Enter subdomain";
    // if(confirmComponent.confirmationText  == company.subdomain){
    //   confirmComponent.disable = false;
    // }
    // else{
    //   confirmComponent.disable = true;
    // }

    // console.log("here is the component called",confirmComponent)
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = company.company_name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        // JSON.stringify(companyId)

        this.deleteCompanyById(company.company_id, company.subdomain);
      }
    });

  }
  subdomainSuggestions: any[] = [];
  subdomainMessage: string;
  addCompanyModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.companyForm.reset();
    this.companyForm.get("status").patchValue(1);
    this.submitButton = "Create";
    this.modalTitle = "Add Company";
    this.modalRef = this.modalService.show(template, this.config);

    this.companyForm.get('company_name').valueChanges.subscribe((res: string) => {
      // this.getpasswordControlMsg();
      let value = res;
      if (value.length > 10) {
        value = value.trim();
        value = value.split(" ")[0];
      }
      // replace(/\_/g, "")
      // first and last
      // replace(/\_^/, "").replace(/\_$/, "")
      this.companyForm.get("subdomain").setValue(value.trim().toLowerCase().replace(/\-/g, "").replace(/\./g, '').replace(/[\/\s]+/gi, "-"))

    })
    this.companyForm.get("subdomain").valueChanges
      .pipe(
        debounceTime(600),
        switchMap(res => {
          res.replace(/[\/\s]+/gi, "-")

          //calling the api if the subdomain is available
          return this.companyService.getSubdomainSuggestion(res + ".flexyear.com")
        })
        // and subscribe the response
      ).subscribe(((res: any) => {
        console.log("res", res);
        if (res.status) {
          this.subdomainMessage = null;
          this.subdomainSuggestions = null;
        }
        else {
          // res.detail;
          this.subdomainMessage = "The requested subdomain is not available.Please select from below."
          res.data ? this.subdomainSuggestions = res.data : this.subdomainSuggestions = null;
        }


      }))
  }

  openEditModal(template, companyData) {
    this.submitted = false;
    this.modalTitle = "Edit Company";
    this.submitButton = "Update";
    companyData["id"] = companyData.company_id;
    console.log("subdomain",companyData.subdomain)
    if(companyData && companyData.subdomain){
      companyData.subdomain = companyData.subdomain.split(".flexyear.com")[0]
    }
    this.companyForm.patchValue(companyData);
    if (companyData.status == "Active")
      this.companyForm.get("status").patchValue("1");
    else this.companyForm.get("status").patchValue("0");

    this.modalRef = this.modalService.show(template, this.config);
  }

  setSubdomainValue(value: string) {
    console.log("hello this is subv", value);
    let name = value.split(".flexyear.com")
    console.log("name", name);
    this.companyForm.get('subdomain').setValue(name[0]);
    this.subdomainSuggestions = [];
  }

  onSubmitCompany(template: TemplateRef<any>) {
    this.submitted = true;
    this.createCompany = true;

    if (this.companyForm.invalid) return;
    if (this.companyForm.get("id").value) {
      this.editCompany();
    } else {
      this.addCompany();
    }
  }

  public state: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: "and",
      filters: [],
    },
  };
  //sortDescriptor declaration for kendo grid
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

  dataStateChange(event): void {
    if (event.sort[0]) {
      this.sort = event.sort;
      if (event.sort[0].dir === "asc") {
        this.sortno = 2;
      } else {
        this.sortno = 1;
      }
      this.sortnane = event.sort[0].field;
    }

    // Search

    if (event.filter) {
      if (event.filter.filters[0]) {
        const searchTerm = event.filter.filters[0].value;
        const searchField = event.filter.filters[0].field;
        this.search_value = searchTerm;
        this.search_key = searchField;
      } else {
        this.search_value = "";
        this.search_key = "";
      }
    }
    // search ends here

    if (event.skip == 0) {
      this.skip = event.skip;
      this.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.page = pageNo.toString();
    }

    this.getCompanyList();
  }

  openAddModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.modalTitle = "Add Credentials To Staff";
    this.buildForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  companyId = this.globalService.getCompanyIdFromStorage();
  userCredentialsForm: FormGroup;
  buildForm() {
    this.userCredentialsForm = this.fb.group({
      // staff_id: [
      //   this.selectedUser ? this.selectedUser.staff_id : "",
      //   Validators.required,
      // ],
      username: "",

      passwords: this.fb.group({
        password: "",
        confirm_password: "",
      }),

      access_level: [0],
      role: [2],
      company_id: [this.companyId],
      user_id: [""],
    });
  }

  //first of all set the methods here
  confirmSubdomain:string
  setConfirmationDialogMethods(body){
    this.globalService.showConfirmBox.next(true);
    this.globalService.showConfirmationLabel.next("Enter subdomain");
    this.globalService.confirmInputText.subscribe((res)=>{
      this.confirmSubdomain = res;
      if(this.confirmSubdomain == body.subdomain){
        this.globalService.confirmationSubmitDisableStatus.next(false);

      }
      else{
        this.globalService.confirmationSubmitDisableStatus.next(true);
      }
    }

    )
  }
  ngOnDestroy(){
    //reset the methods so that it doesn't have effects on other component in destroy
    this.globalService.resetConfirmationMethods();
  }

}
