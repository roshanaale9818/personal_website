import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { leaveTypeModel } from "../../models/leave-type.model";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { LeaveTypeService } from "../../leave-type.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { State, SortDescriptor } from "@progress/kendo-data-query";
@Component({
  selector: "app-list-leave-type",
  templateUrl: "./list-leave-type.component.html",
  styleUrls: ["./list-leave-type.component.scss"],
})
export class ListLeaveTypeComponent implements OnInit {
  listLoading: boolean;
  leaveTypeDetail: any;
  leaveTYpeCount: number;
  modalRef: BsModalRef;
  leaveTypeForm: FormGroup;
  selectedLeaveType: leaveTypeModel;
  editMode: boolean;
  submitted: boolean;
  companyId = this.globalService.getCompanyIdFromStorage();
  submitButton: any;
  modalTitle: any;
  public gridView: GridDataResult;
  paginationMode = true;
  skip = 0;

  constructor(
    private leaveTypeService: LeaveTypeService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toasterMessageService: ToastrMessageService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.getLeaveType();
    this.buildLeaveTypeForm();
  }

  buildLeaveTypeForm(): void {
    const leaveType = this.selectedLeaveType;
    this.leaveTypeForm = this.fb.group({
      title: [leaveType ? leaveType.title : "", Validators.required],
      description: [
        leaveType ? leaveType.description : "",
        Validators.required,
      ],
      company_id: [this.companyId ? this.companyId : ""],
      id: [""],
    });
  }

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);

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
        const searchTerm = event.filter.filters[0].value;
        const searchField = event.filter.filters[0].field;
        this.search_value = searchTerm;
        this.search_key = searchField;
      } else {
        // normal api call
        this.search_value = "";
        this.search_key = "";
      }
    }
    // search logic ends here
    this.getLeaveType();
  }

  //  get method
  getLeaveType(): void {
    this.listLoading = true;
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };
    this.leaveTypeService.getleaveTypeList(params).subscribe(
      (response: CustomResponse) => {
        if (response) {
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
  addLeaveType(body): void {
    this.submitted = true;
    this.leaveTypeService.addLeaveType(body).subscribe(
      (response: CustomResponse) => {
        if (response) {
          this.toasterMessageService.showSuccess(
            "Leave Type added successfully"
          );
        }
        this.getLeaveType();
        this.leaveTypeForm.reset();
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  editLeaveType(body) {
    if (this.leaveTypeForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.leaveTypeService.editLeaveType(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Leave Type edited successfully"
          );
          this.getLeaveType();
          this.leaveTypeForm.reset();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  openModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Leave Type";
    this.selectedLeaveType = null;
    this.buildLeaveTypeForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModel(leaveType: leaveTypeModel, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Update";
    this.modalTitle = "Edit Leave Type";
    this.leaveTypeService.setselectedLeaveType(leaveType);
    this.selectedLeaveType = this.leaveTypeService.getSelectedLeaveType();
    this.buildLeaveTypeForm();
    this.modalRef = this.modalService.show(template, this.config);
  }
  openViewModal(template: TemplateRef<any>, leaveTypeDetail): void {
    this.leaveTypeDetail = leaveTypeDetail;
    this.modalRef = this.modalService.show(template);
  }

  onSubmitleaveType(): void {
    this.submitted = true;
    if (this.leaveTypeForm.invalid) return;
    if (this.editMode) {
      this.leaveTypeForm
        .get("id")
        .patchValue(this.selectedLeaveType.leave_type_id);
      this.editLeaveType(this.leaveTypeForm.value);
    } else {
      this.addLeaveType(this.leaveTypeForm.value);
    }
    this.modalRef.hide();
  }
  // modal
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  // delet method
  // id is sent in json formate not a number as per backend requirement
  deleteLeaveTypeById(id): void {
    this.leaveTypeService.deleteLeaveType(id).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Leave Type deleted sucessfully"
          );
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getLeaveType();
      }
    );
  }

  openConfirmationDialogue(leaveType: leaveTypeModel): void {
    const leaveTypeId = {
      id: leaveType.leave_type_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = leaveType.title;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteLeaveTypeById(JSON.stringify(leaveTypeId));
      }
    });
  }
}
