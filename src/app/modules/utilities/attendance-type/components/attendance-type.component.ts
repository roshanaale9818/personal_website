import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { GlobalService } from "@app/shared/services/global/global.service";
import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { State, SortDescriptor, process } from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { leaveTypeModel } from "../../leave-type/models/leave-type.model";
import { AttendanceTypeService } from "../services/attendance-type.service";
import { ToastrMessageService } from "../../../../shared/services/toastr-message/toastr-message.service";

@Component({
  selector: "app-attendance-type",
  templateUrl: "./attendance-type.component.html",
  styleUrls: ["./attendance-type.component.scss"],
})
export class AttendanceTypeComponent implements OnInit {
  listLoading: boolean;
  leaveTypeDetail: any;
  leaveTYpeCount: number;
  selectedAttendanceType: any;

  modalRef: BsModalRef;
  attendanceTypeForm: FormGroup;

  // modal
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  editMode: boolean;
  submitted: boolean;
  companyId = this.globalService.getCompanyIdFromStorage();
  submitButton: any;
  modalTitle: any;
  public gridView: GridDataResult;
  paginationMode = true;
  skip = 0;

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";
  search_key = "";
  search_value = "";

  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);

  //  Kendo Table
  attendanceList: any[] = [];
  // state declaration for kendo grid
  public state: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: "and",
      filters: [],
    },
  };

  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private attendanceTypeService: AttendanceTypeService,
    private toastrMessageService: ToastrMessageService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getAttendanceType(this.params);
    this.buildAttendanceType();
  }

  buildAttendanceType(): void {
    this.attendanceTypeForm = this.formBuilder.group({
      title: [
        this.selectedAttendanceType ? this.selectedAttendanceType.title : "",
        Validators.required,
      ],
      description: [
        this.selectedAttendanceType
          ? this.selectedAttendanceType.description
          : "",
      ],
      status: [
        this.selectedAttendanceType
          ? this.selectedAttendanceType.status
          : "Active",
        Validators.required,
      ],
      company_id: [this.companyId ? this.companyId : 104],
      id: [""],
    });
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.attendanceList, this.state);
  }

  params = {
    limit: this.limit,
    page: this.globalService.pageNumber,
    sortnane: this.sortnane,
    sortno: this.sortno,
    company_id: this.companyId,
    search: {
      title: "",
      status: "",
    },
  };
  //  get method
  getAttendanceType(body): void {
    this.listLoading = true;

    this.attendanceTypeService.getAttendanceTypeList(body).subscribe(
      (response: any) => {
        console.log(response, "Hello ");
        if (response.status) {
          this.attendanceList = response.data;
          this.gridView = process(this.attendanceList, this.state);
        } else {
          this.gridView = process([], this.state);
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

  addAttendanceType(body): void {
    this.submitted = true;
    this.attendanceTypeService.addAttendanceType(body).subscribe(
      (response: CustomResponse) => {
        if (response) {
          this.toastrMessageService.showSuccess(
            "Attendance Type is added successfully"
          );
        }
        this.getAttendanceType(this.params);
        this.attendanceTypeForm.reset();
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  updateAttendanceType(body) {
    if (this.attendanceTypeForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.attendanceTypeService.updateAttendanceType(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Attendance Type is updated successfully"
          );
          this.getAttendanceType(this.params);
          this.attendanceTypeForm.reset();
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      }
    );
  }

  openModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Attendance Type";
    this.selectedAttendanceType = null;
    this.buildAttendanceType();
    this.modalRef = this.modalService.show(template, this.config);
  }

  attendanceTypeDetail;
  openEditModal(dataItem, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Update";
    this.modalTitle = "Edit Leave Type";
    this.selectedAttendanceType = dataItem;
    this.buildAttendanceType();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openViewModal(template: TemplateRef<any>, dataItem): void {
    this.attendanceTypeDetail = dataItem;
    this.modalRef = this.modalService.show(template);
  }

  onSubmitAttendanceType(): void {
    this.submitted = true;
    if (this.attendanceTypeForm.invalid) return;
    if (this.editMode) {
      this.attendanceTypeForm
        .get("id")
        .patchValue(this.selectedAttendanceType.att_type_id);
      this.updateAttendanceType(this.attendanceTypeForm.value);
    } else {
      this.addAttendanceType(this.attendanceTypeForm.value);
    }
    this.modalRef.hide();
  }

  openConfirmationDialogue(dataItem): void {
    const attendanceTypeId = {
      id: dataItem.att_type_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = dataItem.title;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteAttendanceTypeById(JSON.stringify(attendanceTypeId));
      }
    });
  }

  // delet method
  // id is sent in json formate not a number as per backend requirement
  deleteAttendanceTypeById(id): void {
    this.attendanceTypeService.deleteAttendanceType(id).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Attendance Type is deleted sucessfully"
          );
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      },
      () => {
        this.getAttendanceType(this.params);
      }
    );
  }
}
