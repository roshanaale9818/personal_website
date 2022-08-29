import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { RegexConst } from "@app/shared/constants/regex.constant";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { GlobalService } from "@app/shared/services/global/global.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { process, SortDescriptor, State } from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ClientService } from "../../client.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-client-shift",
  templateUrl: "./client-shift.component.html",
  styleUrls: ["./client-shift.component.scss"],
})
export class ClientShiftComponent implements OnInit {
  modalRef: BsModalRef;
  clientShiftForm: FormGroup;
  regexconstant = RegexConst;
  companyId = this.globalService.getCompanyIdFromStorage();
  listLoading: boolean;
  skip = 0;
  editMode: boolean;
  submitButton: any;
  modalTitle: any;
  selectedClientShift: any;
  date: DatePipe;

  //Kendo Table
  public clientShiftList: any[] = [];
  public state: State = {
    skip: 0,
    take: 10,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  public gridView: GridDataResult = process(this.clientShiftList, this.state);

  constructor(
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private clientService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = 2;
  sortnane = "";

  pageLimit = parseInt(this.limit);
  clientId = this.activatedRoute.snapshot.params.id;

  ngOnInit() {
    this.buildclientShiftForm();
    this.getBreakList();
    this.activatedRoute.parent.params.subscribe((params) => {
      this.clientId = params["id"];
      if (this.clientId) {
        this.getClientShift();
      }
    });
  }

  saveUsername;
  onSaveUsernameChanged() {}

  checkMonday(): void {
    if (this.clientShiftForm.value.monday == true) {
      this.clientShiftForm.get("monday").setValue(1);
    } else if (this.clientShiftForm.value.monday == false) {
      this.clientShiftForm.get("monday").setValue(0);
    }
  }

  checkTuesday(): void {
    if (this.clientShiftForm.value.tuesday == true) {
      this.clientShiftForm.controls["tuesday"].setValue("1");
    } else if (this.clientShiftForm.value.tuesday == false) {
      this.clientShiftForm.get("tuesday").setValue(0);
    }
  }

  checkWednesday(): void {
    if (this.clientShiftForm.value.wednesday == true) {
      this.clientShiftForm.controls["wednesday"].setValue("1");
    } else if (this.clientShiftForm.value.wednesday == false) {
      this.clientShiftForm.get("wednesday").setValue(0);
    }
  }

  checkThursday(): void {
    if (this.clientShiftForm.value.thursday == true) {
      this.clientShiftForm.controls["thursday"].setValue("1");
    } else if (this.clientShiftForm.value.thursday == false) {
      this.clientShiftForm.get("thursday").setValue(0);
    }
  }

  checkFriday(): void {
    if (this.clientShiftForm.value.friday == true) {
      this.clientShiftForm.controls["friday"].setValue("1");
    } else if (this.clientShiftForm.value.friday == false) {
      this.clientShiftForm.get("friday").setValue(0);
    }
  }

  checkSaturday(): void {
    if (this.clientShiftForm.value.saturday == true) {
      this.clientShiftForm.controls["saturday"].setValue("1");
    } else if (this.clientShiftForm.value.saturday == false) {
      this.clientShiftForm.get("saturday").setValue(0);
    }
  }

  checkSunday(): void {
    if (this.clientShiftForm.value.sunday == true) {
      this.clientShiftForm.controls["sunday"].setValue(1);
    } else if (this.clientShiftForm.value.sunday == false) {
      this.clientShiftForm.get("sunday").setValue(0);
    }
  }

  buildclientShiftForm() {
    this.clientShiftForm = this.fb.group({
      id: "",
      name: [
        this.selectedClientShift ? this.selectedClientShift.name : "",
        Validators.required,
      ],
      shift_from: [
        this.selectedClientShift ? this.selectedClientShift.shift_from : "",
        Validators.required,
      ],
      shift_to: [
        this.selectedClientShift ? this.selectedClientShift.shift_to : "",
        Validators.required,
      ],
      client_id: [
        this.selectedClientShift
          ? this.selectedClientShift.client_id
          : this.activatedRoute.parent.snapshot.params.id,
      ],
      company_id: [this.companyId],
      monday: this.selectedClientShift
        ? this.selectedClientShift.monday == 1
          ? true
          : false
        : "",
      tuesday: this.selectedClientShift
        ? this.selectedClientShift.tuesday == 1
          ? true
          : false
        : "",
      wednesday: this.selectedClientShift
        ? this.selectedClientShift.wednesday == 1
          ? true
          : false
        : "",
      thursday: this.selectedClientShift
        ? this.selectedClientShift.thursday == 1
          ? true
          : false
        : "",
      friday: this.selectedClientShift
        ? this.selectedClientShift.friday == 1
          ? true
          : false
        : "",
      saturday: this.selectedClientShift
        ? this.selectedClientShift.saturday == 1
          ? true
          : false
        : "",
      sunday: this.selectedClientShift
        ? this.selectedClientShift.sunday == 1
          ? true
          : false
        : "",
      late_warn_time: this.selectedClientShift
        ? this.selectedClientShift.late_warn_time
        : "",
      check_in_restriction: this.selectedClientShift
        ? this.selectedClientShift.check_in_restriction
        : "",
      allow_ot: this.selectedClientShift
        ? this.selectedClientShift.allow_ot == 1
          ? true
          : false
        : "",
      break: this.fb.array([]),
    });
  }

  shiftBreakList: any[] = [];
  getClientShiftBreak(id): void {
    this.shiftBreakList = [];
    this.clientService.getBreakLists(id).subscribe((response) => {
      if (response.status) {
        this.shiftBreakList = response.data;
        if (this.selectedClientShift) {
          this.clientShiftForm.setControl(
            "break",
            this.setClientShift(response.data)
          );
        }
      }
    });
  }

  checkOverTime(event): void {
    if (this.clientShiftForm.value.allow_ot) {
      this.clientShiftForm.get("allow_ot").setValue(1);
    } else {
      this.clientShiftForm.get("allow_ot").setValue(0);
    }
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

  addBreakFormGroup() {
    return this.fb.group({
      att_type_id: "",
      time: "",
      status: "",
    });
  }

  addBreakType(): void {
    const addBreak = this.clientShiftForm.get("break") as FormArray;
    addBreak.push(this.addBreakFormGroup());
  }

  setClientShift(clientShift) {
    const formArray = new FormArray([]);
    clientShift.forEach((element) => {
      formArray.push(
        this.fb.group({
          id: element.break_id,
          att_type_id: element.att_type_id,
          time: element.time,
          status: element.status == "1" ? true : false,
        })
      );
    });
    return formArray;
  }

  removeBreak = [];
  removeBreakType(index, breakList): void {
    (<FormArray>this.clientShiftForm.get("break")).removeAt(index);
    this.removeBreak.push({ is_remove: "1", id: breakList.get("id").value });
  }

  breakLists: any[] = [];
  getBreakList(): void {
    this.clientService.getBreakTypeList(this.params).subscribe((response) => {
      this.breakLists = [];
      if (response.status) {
        response.data.forEach((element) => {
          this.breakLists.push({
            title: element.title,
            id: element.att_type_id,
          });
        });
      }
    });
  }

  clientShiftId;
  loading: boolean;
  getClientShift() {
    const getBody = {
      limit: this.limit,
      page: this.page,
      sortnane: this.sortnane,
      sortno: this.sortno,

      company_id: this.globalService.getCompanyIdFromStorage(),
      search: {
        client_id: this.clientId,
        name: "",
        shift_from: "",
        shift_to: "",
        late_warn_time: "",
        check_in_restriction: "",
      },
    };
    this.loading = true;
    this.clientService.getClientShift(getBody).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.clientShiftList = response.data;
          this.gridView = process(this.clientShiftList, this.state);
        } else {
          this.gridView = process([], this.state);
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
    this.gridView = process(this.clientShiftList, this.state);
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

    // if (event.skip == 0) {
    //   this.skip = event.skip;
    //   this.getBody.page = "1";
    // } else {
    //   this.skip = event.skip;
    //   const pageNo = event.skip / event.take + 1;

    //   this.getBody.page = pageNo.toString();
    // }

    // pagination logic ends here
    // if (event.filter) {
    //   if (event.filter.filters[0]) {
    //     // search api call

    //     if (event.filter.filters[0].field == "name") {
    //       this.getBody.search.name = event.filter.filters[0].value;
    //     }
    //     if (event.filter.filters[0].field == "details") {
    //       this.getBody.search.details = event.filter.filters[0].value;
    //     }
    //     if (event.filter.filters[0].field == "status") {
    //       this.getBody.search.status = event.filter.filters[0].value;
    //     }
    //   } else {
    //     // normal api call

    //     this.getBody.search.details = "";
    //     this.getBody.search.name = "";
    //     this.getBody.search.status = "";
    //   }
    // }
    // search logic ends here
    // this.getClientShift();
  }

  addClientShift(body) {
    if (this.clientShiftForm.invalid) return;
    const startBreakArray = this.clientShiftForm.get("break").value;
    startBreakArray.push(...this.removeBreak);
    const obj = {
      name: this.clientShiftForm.value.name,
      shift_from: this.clientShiftForm.value.shift_from,
      shift_to: this.clientShiftForm.value.shift_to,
      client_id: this.clientId,
      company_id: this.companyId,
      monday: this.clientShiftForm.value.monday,
      tuesday: this.clientShiftForm.value.tuesday,
      wednesday: this.clientShiftForm.value.wednesday,
      thursday: this.clientShiftForm.value.thursday,
      friday: this.clientShiftForm.value.friday,
      saturday: this.clientShiftForm.value.saturday,
      sunday: this.clientShiftForm.value.sunday,
      late_warn_time: this.clientShiftForm.value.late_warn_time,
      check_in_restriction: this.clientShiftForm.value.check_in_restriction,
      allow_ot: this.clientShiftForm.value.allow_ot,
      break: startBreakArray,
    };
    this.clientService.addClientShift(obj).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Shift is added successfully"
          );
        } else {
          this.toasterMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.modalRef.hide();
        this.getClientShift();
      }
    );
  }

  editClientShift(getBody): void {
    if (this.clientShiftForm.invalid) {
      this.modalRef.hide();
      return;
    }

    const startBreakArray = this.clientShiftForm.get("break").value;
    startBreakArray.push(...this.removeBreak);
    const obj = {
      id: this.selectedClientShift.client_shift_id,
      name: this.clientShiftForm.value.name,
      shift_from: this.clientShiftForm.value.shift_from,
      shift_to: this.clientShiftForm.value.shift_to,
      client_id: this.clientId,
      company_id: this.companyId,
      monday: this.clientShiftForm.value.monday,
      tuesday: this.clientShiftForm.value.tuesday,
      wednesday: this.clientShiftForm.value.wednesday,
      thursday: this.clientShiftForm.value.thursday,
      friday: this.clientShiftForm.value.friday,
      saturday: this.clientShiftForm.value.saturday,
      sunday: this.clientShiftForm.value.sunday,
      late_warn_time: this.clientShiftForm.value.late_warn_time,
      check_in_restriction: this.clientShiftForm.value.check_in_restriction,
      allow_ot: this.clientShiftForm.value.allow_ot,
      break: startBreakArray,
    };
    this.clientService.editClientShift(obj).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Client Shift is updated successfully"
          );
        } else {
          this.toasterMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error.message);
      },
      () => {
        this.modalRef.hide();
        this.getClientShift();
      }
    );
  }

  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openConfirmationDialogue(dataItem) {
    const clientShiftId = {
      id: dataItem.client_shift_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = dataItem.name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteClientDivisionById(JSON.stringify(clientShiftId));
      }
    });
  }

  deleteClientDivisionById(id) {
    this.clientService.deleteClientShift(id).subscribe(
      (response) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess(
            "Client Shift deleted Sucessfully"
          );
        } else {
          this.toasterMessageService.showError(response.data);
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getClientShift();
      }
    );
  }

  openAddModal(template: TemplateRef<any>): void {
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Client Shift";
    this.selectedClientShift = null;
    this.buildclientShiftForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModal(dataItem, template: TemplateRef<any>): void {
    this.editMode = true;
    this.submitButton = "Edit";
    this.modalTitle = "Edit Client Shift";
    this.selectedClientShift = dataItem;
    this.clientShiftId = dataItem.client_shift_id;
    this.buildclientShiftForm();
    this.getClientShiftBreak(this.clientShiftId);
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmit() {
    if (this.clientShiftForm.invalid) return;
    for (let a of this.clientShiftForm.value.break) {
      if (a.status) {
        a.status = "1";
      } else {
        a.status = "0";
      }
    }
    if (this.editMode) {
      this.editClientShift(this.clientShiftForm.value);
    } else {
      this.addClientShift(this.clientShiftForm.value);
    }
  }
}
