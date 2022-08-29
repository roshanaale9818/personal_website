import { Component, OnInit, TemplateRef } from "@angular/core";
import { GlobalService } from "../../../../../shared/services/global/global.service";
import { ActivatedRoute } from "@angular/router";
import { ClientService } from "../../client.service";
import { State, process } from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegexConst } from "../../../../../shared/constants/regex.constant";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "../../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { ToastrMessageService } from "../../../../../shared/services/toastr-message/toastr-message.service";

@Component({
  selector: "app-client-attendance-threshold",
  templateUrl: "./client-attendance-threshold.component.html",
  styleUrls: ["./client-attendance-threshold.component.scss"],
})
export class ClientAttendanceThresholdComponent implements OnInit {
  modalRef: BsModalRef;
  clientAttendanceThresholdForm: FormGroup;
  regexconstant = RegexConst;
  companyId = this.globalService.getCompanyIdFromStorage();
  listLoading: boolean;
  skip = 0;
  editMode: boolean;
  submitButton: any;
  modalTitle: any;
  selectedAttendanceThreshold: any;
  minuteList: any[] = [];
  //Kendo Table
  public clientAttendanceThresholdList: any[] = [];
  public state: State = {
    skip: 0,
    take: 10,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  public gridView: GridDataResult = process(
    this.clientAttendanceThresholdList,
    this.state
  );

  constructor(
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private modalService: BsModalService,
    private toastrMessageService: ToastrMessageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getClientAttendanceThreshold(this.getBody);
    this.buildClientAttendanceThresholdForm();
    this.getMinuteList();
  }

  clientId = this.route.snapshot.params.id;
  buildClientAttendanceThresholdForm(): void {
    this.clientAttendanceThresholdForm = this.formBuilder.group({
      id: "",
      client_id: parseInt(this.clientId),
      threshold_from: [
        this.selectedAttendanceThreshold
          ? this.selectedAttendanceThreshold.threshold_from
          : "",
        [Validators.required],
      ],
      threshold_to: [
        this.selectedAttendanceThreshold
          ? this.selectedAttendanceThreshold.threshold_to
          : "",
        [Validators.required],
      ],

      rounded_time: this.selectedAttendanceThreshold
        ? this.selectedAttendanceThreshold.rounded_time
        : "",

      valid_from: this.selectedAttendanceThreshold
        ? this.selectedAttendanceThreshold.valid_from
        : "",
      valid_to: this.selectedAttendanceThreshold
        ? this.selectedAttendanceThreshold.valid_to
        : "",
      company_id: this.globalService.getCompanyIdFromStorage(),
    });
  }

  // Get minute list from 0 to 60
  getMinuteList(): void {
    for (let i = 0; i <= 60; i++) {
      this.minuteList.push(i);
    }
  }

  loading: boolean;
  getBody = {
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortnane: "",
    sortno: 2,
    search: {
      client_id: parseInt(this.route.snapshot.params.id),
    },
  };
  getClientAttendanceThreshold(body): void {
    this.loading = true;
    this.clientService.getClientAttendanceThreshold(body).subscribe(
      (response) => {
        console.log(response);
        if (response.status) {
          this.clientAttendanceThresholdList = response.data;
          this.gridView = process(
            this.clientAttendanceThresholdList,
            this.state
          );
        }
      },
      (error) => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.clientAttendanceThresholdList, this.state);
  }

  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openConfirmationDialogue(dataItem) {
    const clientAttendanceThreshold = {
      id: dataItem.client_attendance_thresold_id,
      company_id: this.companyId,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = dataItem.name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteClientAttendanceThreshold(
          JSON.stringify(clientAttendanceThreshold)
        );
      }
    });
  }

  deleteClientAttendanceThreshold(id) {
    this.clientService.deleteClientAttendanceThreshold(id).subscribe(
      (response) => {
        if (response.status === true) {
          this.toastrMessageService.showSuccess(
            "Client Shift deleted Sucessfully"
          );
        }
      },
      (error) => {
        this.toastrMessageService.showError(error);
      },
      () => {
        this.getClientAttendanceThreshold(this.getBody);
      }
    );
  }

  openAddModal(template: TemplateRef<any>): void {
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Client Attendance Threshold";
    this.selectedAttendanceThreshold = null;
    this.buildClientAttendanceThresholdForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModal(dataItem, template: TemplateRef<any>): void {
    this.editMode = true;
    this.submitButton = "Edit";
    this.modalTitle = "Edit Client Attendance Threshold";
    this.selectedAttendanceThreshold = dataItem;
    this.buildClientAttendanceThresholdForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmit() {
    console.log(this.selectedAttendanceThreshold, "loggggggg");
    if (this.clientAttendanceThresholdForm.invalid) return;
    if (this.editMode) {
      this.clientAttendanceThresholdForm.patchValue({
        id: this.selectedAttendanceThreshold.att_threshold_id,
      });
      this.editClientAttendanceThreshold(
        this.clientAttendanceThresholdForm.value
      );
    } else {
      this.addClientAttendanceThreshold(
        this.clientAttendanceThresholdForm.value
      );
    }
  }

  addClientAttendanceThreshold(body): void {
    this.clientService.addClientAttendanceThreshold(body).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Client Attendance Threshold is added successfully"
          );
          this.modalRef.hide();
        } else {
          this.toastrMessageService.showError(
            "Client Attendance Threshold is not added"
          );
        }
      },
      (error) => {
        this.toastrMessageService.showError(error.message);
      },
      () => {
        this.getClientAttendanceThreshold(this.getBody);
      }
    );
  }

  editClientAttendanceThreshold(body): void {
    this.clientService.editClientAttendanceThreshold(body).subscribe(
      (response) => {
        if (response.status) {
          this.toastrMessageService.showSuccess(
            "Client Attendance Threshold is updated successfully"
          );
          this.modalRef.hide();
        } else {
          this.toastrMessageService.showError(
            "Client Attendance Threshold is not updated"
          );
        }
      },
      (error) => {
        this.toastrMessageService.showError(error.message);
      },
      () => {
        this.getClientAttendanceThreshold(this.getBody);
      }
    );
  }
}
