import { filter } from "rxjs/operators";
import { DepartmentService } from "../../../department/services/department.service";
import { DesignationListModal } from "../../model/designationListModal";
import { CustomResponse } from "../../../../../shared/models/custom-response.model";
import { DesignationService } from "../../services/designation.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { HelperService } from "@app/shared/services/helper/helper.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { Router } from "@angular/router";
import { ValidationMessageService } from "@app/shared/services/validation-message/validation-message.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
@Component({
  selector: "app-list-designation",
  templateUrl: "./list-designation.component.html",
  styleUrls: ["./list-designation.component.scss"],
})
export class ListDesignationComponent implements OnInit {
  designationForm: FormGroup;
  modalRef: BsModalRef;
  submitted: boolean;
  editMode: boolean;
  submitButton: string;
  modalTitle: string;
  designationDetail: DesignationListModal;
  designationListLoading: boolean;
  public gridView: GridDataResult;
  selectedDesignation: DesignationListModal;
  language: any;
  skip = 0;
  paginationMode = true;
  companyId = this.globalService.getCompanyIdFromStorage();
  departmenListLoading: boolean;
  departmentList;

  public defaultItem = {
    department_id: null,
    department_name: "Select All",
    description: "",
    company_id: this.companyId,
  };
  constructor(
    private modalService: BsModalService,
    private designationService: DesignationService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private validationMessageService: ValidationMessageService,
    private departmentService: DepartmentService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.getDesignationList();
    this.buildDesignationForm();
    this.getdepartmentList();
  }

  buildDesignationForm(): void {
    const designation = this.selectedDesignation;
    this.designationForm = this.fb.group({
      designation_name: [
        designation ? designation.designation_name : "",
        Validators.required,
      ],
      department_id: [designation ? designation.department_id : ""],
      description: [designation ? designation.description : ""],
      company_id: [""],
      id: [""],
    });
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = "2";
  sortnane = "";
  search_key = "";
  search_value = "";

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);
  // search body for search APi
  searchBody = {
    company_id: this.companyId,
    limit: this.limit,
    page: "",
    sortno: "",
    sortnane: "",
    search: {
      designation_name: "",
      department_name: "",
      description: "",
    },
  };

  getDesignationList(): void {
    this.designationListLoading = true;

    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };

    this.designationService.getDesignationList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };

          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.designationListLoading = false;
      },
      () => {
        this.designationListLoading = false;
      }
    );
  }
  designationMultiSearch(body) {
    this.designationListLoading = true;
    this.designationService.searchDesignation(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };

          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.designationListLoading = false;
      },
      () => {
        this.designationListLoading = false;
      }
    );
  }

  // add designation..
  addDesignation(body): void {
    this.designationService.addDesignation(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Designation Added successfully"
          );

          this.modalRef.hide();

          this.getDesignationList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // edit method
  editDesignation(body): void {
    if (this.designationForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.designationService.editDesignation(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Designation edited successfully"
          );

          this.modalRef.hide();

          this.getDesignationList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // delet method
  deleteDesignationById(id): void {
    this.designationService.deleteDesignation(id).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Designation deleted sucessfully"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getDesignationList();
      }
    );
  }

  onSubmitDesignation(): void {
    this.submitted = true;

    if (this.designationForm.invalid) return;
    this.designationForm.patchValue({
      company_id: this.companyId,
    });
    if (this.editMode) {
      this.designationForm.patchValue({
        id: this.selectedDesignation.designation_id,
      });
      this.editDesignation(this.designationForm.value);
      // console.log(this.designationForm.value);
      // edit code here
    } else {
      this.addDesignation(this.designationForm.value);
      // console.log(this.designationForm.value);
    }
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
  // separate method for department is made because datastateChange function is not fired in kendoDropdown..
  searchDepartment(event): void {
    // adding search department key into search body
    this.searchBody.search.department_name = event.department_name;
    // if user clicks select All then setting null value so that all value is displayed
    if (event.department_id == null) {
      this.searchBody.search.department_name = "";
      this.searchBody.search.designation_name = "";
      this.searchBody.search.description = "";
    }
    this.skip = 0;
    this.designationMultiSearch(this.searchBody);
  }

  dataStateChange(event): void {
    if (event.sort[0]) {
      this.sort = event.sort;
      if (event.sort[0].dir === "asc") {
        this.searchBody.sortno = "2";
      } else {
        this.searchBody.sortno = "1";
      }

      this.searchBody.sortnane = event.sort[0].field;
    }

    // sorting logic ends here..

    if (event.skip == 0) {
      this.skip = event.skip;

      this.searchBody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.searchBody.page = pageNo.toString();
    }

    // pagination logic ends here
    if (event.filter) {
      if (event.filter.filters[0]) {
        if (event.filter.filters[0].field == "department_name") {
          this.searchBody.search.department_name =
            event.filter.filters[0].value;
        }
        if (event.filter.filters[0].field == "description") {
          this.searchBody.search.description = event.filter.filters[0].value;
        }
        if (event.filter.filters[0].field == "designation_name") {
          this.searchBody.search.designation_name =
            event.filter.filters[0].value;
        }
      } else {
        this.searchBody.search.department_name = "";
        this.searchBody.search.description = "";
        this.searchBody.search.designation_name = "";
      }

      this.designationMultiSearch(this.searchBody);
    }
    // search logic ends here
  }

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openAddModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Designation";
    this.selectedDesignation = null;
    this.buildDesignationForm();

    this.modalRef = this.modalService.show(template, this.config);
  }
  openViewModal(template: TemplateRef<any>, designationDetail): void {
    this.designationDetail = designationDetail;
    this.modalRef = this.modalService.show(template, this.config);
  }
  // edit modal
  openEditModel(designation, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Update";
    this.modalTitle = "Edit Designation";

    this.designationService.setSelectedDesignation(designation);
    this.selectedDesignation = this.designationService.getSelectedDesignation();

    this.buildDesignationForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(designation: DesignationListModal): void {
    const designationId = {
      id: designation.designation_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = designation.designation_name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteDesignationById(JSON.stringify(designationId));
      }
    });
  }

  // get department method to show department list in dropdown

  getdepartmentList(): void {
    this.departmenListLoading = true;

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
          this.departmentList = response.data;

          return;
        } else {
          this.departmentList = [];
        }
      },
      (error) => {
        this.departmenListLoading = false;
      },
      () => {
        this.departmenListLoading = false;
      }
    );
  }
}
