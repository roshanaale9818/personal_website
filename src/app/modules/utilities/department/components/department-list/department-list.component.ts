// import { HelperService } from "../../../../../shared/services/helper/helper.service";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { CustomResponse } from "../../../../../shared/models/custom-response.model";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { DepartmentService } from "../../services/department.service";
import { DepartmentListModel } from "../../model/departmentListModel";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";

import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

import { GlobalService } from "@app/shared/services/global/global.service";
import { State, SortDescriptor } from "@progress/kendo-data-query";

import { GridDataResult } from "@progress/kendo-angular-grid";
import { CookieService } from "ngx-cookie-service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";

@Component({
  selector: "app-department-list",
  templateUrl: "./department-list.component.html",
  styleUrls: ["./department-list.component.scss"],
})
export class DepartmentListComponent implements OnInit {
  departmentForm: FormGroup;
  modalRef: BsModalRef;
  listLoading = false;
  departmentDetail: any;
  selectedDepartment: DepartmentListModel;
  submitted: boolean;
  language: any;
  submitButton: string;
  editMode: boolean;
  modalTitle: string;
  skip = 0;
  paginationMode = true;
  companyId = this.globalService.getCompanyIdFromStorage();
  public gridView: GridDataResult;

  constructor(
    private modalService: BsModalService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private toasterMessageService: ToastrMessageService,
    private globalService: GlobalService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.buildDepartmentForm();
    this.getdepartmentList();
    console.log(this.token);
  }

  buildDepartmentForm(): void {
    const department = this.selectedDepartment;
    this.departmentForm = this.fb.group({
      department_name: [
        department ? department.department_name : "",
        Validators.required,
      ],
      description: [
        department ? department.description : "",
        Validators.required,
      ],
      company_id: [""],
      id: [""],
    });
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
    if (event.sort[0]) {
      this.sort = event.sort;
      if (event.sort[0].dir === "asc") {
        this.sortno = 2;
      } else {
        this.sortno = 1;
      }
      this.sortnane = event.sort[0].field;
    }

    // sorting logic ends here..

    if (event.skip == 0) {
      this.skip = event.skip;
      this.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.page = pageNo.toString();
    }

    // pagination logic ends here
    if (event.filter) {
      if (event.filter.filters[0]) {
        // search api call
        // this.paginationMode = false;
        const searchTerm = event.filter.filters[0].value;
        const searchField = event.filter.filters[0].field;
        this.search_value = searchTerm;
        this.search_key = searchField;
      } else {
        // normal api call
        // this.paginationMode = true;
        this.search_value = "";
        this.search_key = "";
      }
    }
    // search logic ends here
    this.getdepartmentList();
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);
  //  get method
  getdepartmentList(): void {
    this.listLoading = true;

    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };

    this.departmentService.getDepartmentList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };

          return;
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

  token = this.localStorageService.getLocalStorageItem("flexYear-token");
  addDepartment(body): void {
    const bodyParms = {
      access_token: this.token,
      department_name: this.departmentForm.value.department_name,
      description: this.departmentForm.value.description,
      company_id: this.companyId,
    };
    console.log(" Body Params" + JSON.stringify(bodyParms));
    this.departmentService.addDepartment(bodyParms).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Department Added successfully"
          );

          this.modalRef.hide();

          this.getdepartmentList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  editDepartment(body): void {
    if (this.departmentForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.departmentService.editDepartment(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Department edited successfully"
          );
          this.modalRef.hide();
          this.getdepartmentList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  // delet method
  // id is sent in json formate not a number as per backend requirement
  deleteDepartmentById(id): void {
    this.departmentService.deleteDepartment(id).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Department deleted sucessfully"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getdepartmentList();
      }
    );
  }

  openConfirmationDialogue(department: DepartmentListModel): void {
    const departmentId = {
      id: department.department_id,
    };

    this.modalRef = this.modalService.show(ConfirmationDialogComponent);
    this.modalRef.content.data = department.department_name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteDepartmentById(JSON.stringify(departmentId));
      }
    });
  }

  onSubmitDepartment(): void {
    if (this.departmentForm.invalid) return;
    this.departmentForm.patchValue({
      company_id: this.companyId,
    });
    if (this.editMode) {
      this.departmentForm.patchValue({
        id: this.selectedDepartment.department_id,
      });
      this.editDepartment(this.departmentForm.value);
      // edit code..
    } else {
      this.addDepartment(this.departmentForm.value);
    }
  }

  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  openAddModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Department";
    this.selectedDepartment = null;
    this.buildDepartmentForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openViewModal(template: TemplateRef<any>, departmentDetail): void {
    this.departmentDetail = departmentDetail;
    this.modalRef = this.modalService.show(template);
  }

  openEditModel(department, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Update";
    this.modalTitle = "Edit Department";
    this.departmentService.setSelectedDepartment(department);
    this.selectedDepartment = this.departmentService.getSelectedDepartment();
    this.buildDepartmentForm();
    this.modalRef = this.modalService.show(template, this.config);
  }
}
