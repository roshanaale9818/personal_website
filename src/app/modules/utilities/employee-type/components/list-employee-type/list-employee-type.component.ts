import { EmployeeTypeModel } from "../../models/employeeTypeModel";
import { EmployeeTypeService } from "../../services/employee-type.service";
import { HelperService } from "../../../../../shared/services/helper/helper.service";
import { ValidationMessageService } from "@app/shared/services/validation-message/validation-message.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { CustomResponse } from "../../../../../shared/models/custom-response.model";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { Router } from "@angular/router";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

import { GlobalService } from "@app/shared/services/global/global.service";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State, SortDescriptor } from "@progress/kendo-data-query";
@Component({
  selector: "app-list-employee-type",
  templateUrl: "./list-employee-type.component.html",
  styleUrls: ["./list-employee-type.component.scss"],
})
export class ListEmployeeTypeComponent implements OnInit {
  employeeTypeForm: FormGroup;
  searching: boolean;
  employeeTypeListLoading: boolean;
  employeeTypeList: EmployeeTypeModel;
  employeeTypeListCount: number;
  responseStatus: boolean;
  startCount: number;
  endCount: number;
  currentPage: number;
  employeeTypeDetail: EmployeeTypeModel;
  modalRef: BsModalRef;
  submitButton: string;
  selectedEmployeeType: EmployeeTypeModel;
  submitted: boolean;
  language: any;
  editMode: boolean;
  modalTitle: string;
  companyId = this.globalService.getCompanyIdFromStorage();
  public gridView: GridDataResult;
  paginationMode = true;
  skip = 0;
  constructor(
    private modalService: BsModalService,
    private employeeTypeService: EmployeeTypeService,
    private fb: FormBuilder,
    private validationMessageService: ValidationMessageService,
    private toasterMessageService: ToastrMessageService,
    private router: Router,
    private globalService: GlobalService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.getEmployeeTypeList();
    this.buildEmployeeTypeForm();
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);

  buildEmployeeTypeForm() {
    const employeeType = this.selectedEmployeeType;
    this.employeeTypeForm = this.fb.group({
      employee_type: [
        employeeType ? employeeType.employee_type : "",
        Validators.required,
      ],
      description: [
        employeeType ? employeeType.description : "",
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

  dataStateChange(event) {
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
    this.getEmployeeTypeList();
  }

  //  get method
  getEmployeeTypeList(): void {
    this.employeeTypeListLoading = true;

    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };

    this.employeeTypeService.getEmployeeTypeList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };

          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.employeeTypeListLoading = false;
      },
      () => {
        this.employeeTypeListLoading = false;
      }
    );
  }
  // add employee method
  addEmployeeType(body) {
    this.employeeTypeService.addEmployeeType(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Employee Type Added successfully"
          );

          this.modalRef.hide();

          this.getEmployeeTypeList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  // edit employeeType modal

  editEmployeType(body) {
    if (this.employeeTypeForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.employeeTypeService.editEmployeeType(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Department edited successfully"
          );

          this.modalRef.hide();

          this.getEmployeeTypeList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }
  // delet method
  // id is sent in json formate not a number as per backend requirement
  deleteEmployeeTypeById(id) {
    this.employeeTypeService.deleteEmployeeType(id).subscribe(
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
        this.getEmployeeTypeList();
      }
    );
  }

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  openViewModal(template: TemplateRef<any>, employeeTypeDetail) {
    this.employeeTypeDetail = employeeTypeDetail;
    this.modalRef = this.modalService.show(template, this.config);
  }

  openAddModal(template: TemplateRef<any>) {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Employee Type";
    this.selectedEmployeeType = null;
    this.buildEmployeeTypeForm();

    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModel(employeeType, template: TemplateRef<any>) {
    this.submitButton = "Update";
    this.submitted = false;
    this.editMode = true;
    this.modalTitle = "Edit Employee TYpe";
    this.employeeTypeService.setSelectedEmployeeType(employeeType);
    this.selectedEmployeeType = this.employeeTypeService.getSelectedEmployeeType();
    this.buildEmployeeTypeForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(employeeType: EmployeeTypeModel) {
    const employeeTypeId = {
      id: employeeType.employee_type_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = employeeType.employee_type;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteEmployeeTypeById(JSON.stringify(employeeTypeId));
      }
    });
  }

  onSubmitEmployeeType() {
    this.submitted = true;

    if (this.employeeTypeForm.invalid) return;
    this.employeeTypeForm.patchValue({
      company_id: this.companyId,
    });
    if (this.editMode) {
      this.employeeTypeForm.patchValue({
        id: this.selectedEmployeeType.employee_type_id,
      });
      this.editEmployeType(this.employeeTypeForm.value);
      // edit code..
    } else {
      this.addEmployeeType(this.employeeTypeForm.value);
    }
  }
}
