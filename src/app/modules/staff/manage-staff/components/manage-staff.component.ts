import { Component, Inject, OnInit, TemplateRef, ViewChild } from "@angular/core";

import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ManageStaffService } from "../services/manage-staff.service";
import { GlobalService } from "../../../../shared/services/global/global.service";
import { ToastrMessageService } from "../../../../shared/services/toastr-message/toastr-message.service";
import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { Router } from "@angular/router";
import { HelperService } from "../../../../shared/services/helper/helper.service";
import { DepartmentService } from "../../../utilities/department/services/department.service";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { Staff } from "../models/staff.model";
import { FileRestrictions, FileSelectComponent, SelectEvent } from "@progress/kendo-angular-upload";
import { DOCUMENT } from "@angular/common";
import { environment } from "@env/environment";
import { CustomResponse } from "@app/shared/models/custom-response.model";

@Component({
  selector: "app-manage-staff",
  templateUrl: "./manage-staff.component.html",
  styleUrls: ["./manage-staff.component.scss"],
})
export class ManageStaffComponent implements OnInit {
  public gridView: GridDataResult;
  countrySetting;
  listLoading: boolean;
  skip = 0;
  baseImageUrl = environment.baseImageUrl;
  companyId;
  searchForm: FormGroup;
  regexConst = RegexConst;
  csvImportForm: FormGroup;
  modalRef: BsModalRef;
  url: any;
  search_value: any;
  search_key: any;

  constructor(
    private formBuilder: FormBuilder,
    private manageStaffService: ManageStaffService,
    private helperService: HelperService,
    private modalService: BsModalService,
    private toastrMessageService: ToastrMessageService,
    private router: Router,
    private globalService: GlobalService,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.companyId = this.globalService.getCompanyIdFromStorage();
    this.getBody.company_id = this.companyId;
   }

  ngOnInit() {
    this.getStaffList(this.getBody);
    this.buildStaffSearchForm();
    this.buildBulkImportForm();
    this.getStaffLists();
    this.getEmployeeTypeDropdownList();
  }

  buildBulkImportForm(): void {
    this.csvImportForm = this.formBuilder.group({
      file: "",
    });
  }

  public uploadRestrictions: FileRestrictions = {
    allowedExtensions: [".csv"],
  };

  formData = new FormData();
  public selectEventHandler(e: SelectEvent) {
    // After Version changed we commited e.files.forEach part
    //  e.files.forEach((file) => {
    if (!e.files[0].validationErrors) {
      this.formData.append("file", e.files[0].rawFile);
      this.csvImportForm.patchValue({ file: e.files[0].rawFile });
      this.csvImportForm.markAsDirty();
    }
    //   });
  }

  onSubmit(): void {
    this.formData.append("company_id", this.companyId);
    this.manageStaffService.uploadCsvBulkImport(this.formData).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(response.detail);
          this.modalRef.hide();
          this.getStaffList(this.getBody);
        } else {
          //to remove br we have showHTmlErrorMessage
          this.toastrMessageService.showHTMLErrorMessage(response.detail);
        }
      },
      (error) => {
        this.toastrMessageService.showError(error.detail);
      },
      () => { }
    );
  }
  file: any;

  openBulkFileUpload(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 1;
  sortnane = "full_name";
  sortKey = "";

  getBody = {
    company_id: null,
    limit: this.limit,
    page: this.page,
    sortno: this.sortno,
    sortnane: this.sortnane,
    search: {
      first_name: "",
      last_name: "",
      middle_name: "",
      mobile: "",
      phone: "",
      email_address: "",
      citizenship_no: "",
      gender: "",
      marital_status: "",
      employee_type: "",
      department_id: "",
      designation_id: "",
      emp_id: "",
      dob: "",
    },
  };

  getStaffLists(): void {
    this.manageStaffService.getStaffLists().subscribe((response) => {
      if (response.status) {
        console.log(response);
      }
    });
  }

  isCollapsed = true;
  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);

  buildStaffSearchForm() {
    this.searchForm = this.fb.group({
      first_name: [""],
      last_name: [""],
      middle_name: [""],
      mobile: ["", Validators.pattern(this.regexConst.MOBILE_NUMBER)],
      phone: ["", Validators.pattern(this.regexConst.PHONE_NO)],
      email_address: ["", Validators.pattern(this.regexConst.EMAIL)],
      citizenship_no: ["", Validators.pattern(this.regexConst.NUMBER)],
      gender: [""],
      marital_status: [""],
      employee_type: [""],
      designation_id: [""],
      department_id: [""],
      emp_id: ["", Validators.required],
      dob: [""],
    });
  }

  onSearchStaff() {
    this.getBody.search.first_name = this.searchForm.value.first_name;
    this.getBody.search.last_name = this.searchForm.value.last_name;
    this.getBody.search.middle_name = this.searchForm.value.middle_name;
    this.getBody.search.mobile = this.searchForm.value.mobile;
    this.getBody.search.phone = this.searchForm.value.phone;
    this.getBody.search.email_address = this.searchForm.value.email_address;
    this.getBody.search.citizenship_no = this.searchForm.value.citizenship_no;
    this.getBody.search.gender = this.searchForm.value.gender;
    this.getBody.search.marital_status = this.searchForm.value.marital_status;
    this.getBody.search.employee_type = this.searchForm.value.employee_type;
    this.getBody.search.emp_id = this.searchForm.value.emp_id;
    this.getBody.search.dob = this.searchForm.value.dob;
    this.getBody.search.designation_id = this.searchForm.value.designation_id;
    this.getBody.search.department_id = this.searchForm.value.department_id;

    this.getStaffList(this.getBody);
  }

  onCancel() {
    const getBody = {
      company_id: this.companyId,
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search: {
        first_name: "",
        last_name: "",
        middle_name: "",
        mobile: "",
        phone: "",
        email_address: "",
        citizenship_no: "",
        gender: "",
        marital_status: "",
        employee_type: "",
        department_id: "",
        designation_id: "",
        emp_id: "",
        dob: "",
      },
    };
    this.isCollapsed = true;
    this.state.skip = 0;
    this.skip = 0;
    this.getStaffList(getBody);
  }

  getStaffList(body) {
    this.listLoading = true;
    this.manageStaffService.getStaffListWithMultiSearch(body).subscribe(
      (response) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  // state declaration for kendo grid
  public state: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: "and",
      filters: [],
    },
  };
  // sortDescriptor declaration for kendo grid
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

  dataStateChange(event): void {
    // if (event.sort[0]) {
    //   this.sort = event.sort;
    //   if (event.sort[0].dir === "asc") {
    //     this.getBody.sortno = 2;
    //   } else {
    //     this.getBody.sortno = 1;
    //   }
    //   this.getBody.sortnane = event.sort[0].field;
    // }

    // sorting logic ends here..

    if (event.skip == 0) {
      this.skip = event.skip;
      this.getBody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.getBody.page = pageNo.toString();
    }
    // pagination logic ends here

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
    // search logic ends here
    this.getStaffList(this.getBody);
  }

  employeeTypeList: any;
  getEmployeeTypeDropdownList(): void {
    this.manageStaffService.getEmployeeType().subscribe((response) => {
      if (response.status) {
        this.employeeTypeList = response.data;
      } else {
        this.employeeTypeList = [];
      }
    });
  }

  designationList: any;
  getDesignationDropdownList(): void {
    this.manageStaffService.getDesignation().subscribe((response) => {
      if (response.status) {
        this.designationList = response.data;
      } else {
        this.designationList = [];
      }
    });
  }
  departmentList: any;
  getDepartmentDropdownList(): void {
    const params = {
      limit: 100,
      page: "",
      sortno: "",
      sortnane: "",
      search_key: "",
      search_value: "",
    };
    this.departmentService.getDepartmentList(params).subscribe((response) => {
      if (response.status) {
        this.departmentList = response.data;
      } else {
        this.departmentList = [];
      }
    });
  }

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  navigateToStaffDetail(staffDetail) {
    // console.log("onviewclicked",staffDetail);
    // this.manageStaffService.setUserIdForPinChange(staffDetail);
    this.router.navigate(["/staff/manage-staff/view/", staffDetail.staff_id]);
  }

  deleteStaff(staff) {
    const id = {
      id: staff.staff_id,
    };
    this.manageStaffService.deleteStaffById(id).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Staff is deleted successfully"
          );
        } else {
          this.toastrMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      },
      () => {
        this.getStaffList(this.getBody);
      }
    );
  }

  gotoEditStaff(staff: Staff) {
    this.router.navigate(["/staff/manage-staff/edit/", staff.staff_id]);
  }

  /**
   * Returns staff full name along with employee id
   * @param staff
   */
  getStaffFullNameWithEmpId(staff: Staff) {
    return this.helperService.getStaffFullName(staff);
  }

  collapseButton: any;

  collapsed(): void {
    // this.searchForm.reset();
    // this.getStaffList(this.getBody);
    this.collapseButton = "Search Employee";
  }
  expanded(): void {
    this.collapseButton = "Hide Search Bar";
  }

  exportEmployeeReport(): void {
    const body = {
      company_id: this.globalService.getCompanyIdFromStorage(),
      client_id: "",
    };
    this.manageStaffService.excelExport(body).subscribe((response) => {
      this.document.location.href = response.data;
    });
  }
  onRemoveFile(event) {
    console.log("onREMOVE CALLED", event);
  }
  onCancelRef() {
    this.modalRef.hide();
    this.csvImportForm.patchValue({ file: "" })
  }
  ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.globalService.resetConfirmationMethods();

  }

    //reset the methods so that it doesn't have effects on other component in destroy
    confirmText:string
    setConfirmationDialogMethods(body){
      this.globalService.showConfirmBox.next(true);
      this.globalService.confirmationSubmitDisableStatus.next(true);
      this.globalService.showConfirmationLabel.next("Enter Email Address");
      this.globalService.confirmInputText.subscribe((res)=>{
        this.confirmText = res;
        this.globalService.confirmationSubmitDisableStatus.next(true);
        if(this.confirmText == body.email_address){
          this.globalService.confirmationSubmitDisableStatus.next(false);
        }
        else{
          this.globalService.confirmationSubmitDisableStatus.next(true);
        }
      }

      )
    }

}
