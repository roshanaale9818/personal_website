import { CustomResponse } from "../../../../../shared/models/custom-response.model";
import { ShiftService } from "../../services/shift.service";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { DatePipe } from "@angular/common";
import { ShiftList } from "../../modal/shiftList.modal";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import {
  Component,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { State, SortDescriptor } from "@progress/kendo-data-query";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
@Component({
  selector: "app-list-shift",
  templateUrl: "./list-shift.component.html",
  styleUrls: ["./list-shift.component.scss"],
  providers: [DatePipe],
})
export class ListShiftComponent implements OnInit {
  shiftForm: FormGroup;
  selectedShift: ShiftList;
  modalRef: BsModalRef;
  submitted: boolean;
  language: any;
  editMode: boolean;
  paginationMode = true;

  submitButton: string;
  modalTitle: string;
  companyId = this.globalService.getCompanyIdFromStorage();
  shiftListLoading: boolean;
  public gridView: GridDataResult;
  skip = 0;
  currentDate: Date = new Date();
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,

    private datePipe: DatePipe,
    private globalService: GlobalService,
    private toasterMessageService: ToastrMessageService,
    private shiftService: ShiftService
  ) {}

  ngOnInit() {
    this.buildShiftForm();
    this.getShiftList();
  }

  buildShiftForm() {
    const shift = this.selectedShift;
    this.shiftForm = this.fb.group({
      name: [shift ? shift.name : "", Validators.required],
      shift_from: [shift ? shift.shift_from : "", [Validators.required]],
      shift_to: [shift ? shift.shift_to : "", [Validators.required]],
      sunday: [shift ? shift.sunday : ""],
      monday: [shift ? shift.monday : ""],
      tuesday: [shift ? shift.tuesday : ""],
      wednesday: [shift ? shift.wednesday : ""],
      thursday: [shift ? shift.thursday : ""],
      friday: [shift ? shift.friday : ""],
      saturday: [shift ? shift.saturday : ""],
      late_warn_time: [shift ? shift.late_warn_time : "", Validators.required],
      check_in_restriction: [shift ? shift.check_in_restriction : ""],
      break_time: [shift ? shift.break_time : ""],
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

  getShiftList(): void {
    this.shiftListLoading = true;

    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };

    this.shiftService.getShiftList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.gridView = { data: response.data, total: response.count };

          return;
        } else {
          this.gridView = { data: [], total: 0 };
        }
      },
      (error) => {
        this.shiftListLoading = false;
      },
      () => {
        this.shiftListLoading = false;
      }
    );
  }

  // add shift..
  addShift(body): void {
    this.shiftService.addShift(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Shift Added successfully");

          this.modalRef.hide();

          this.getShiftList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // edit method
  editShift(body): void {
    if (this.shiftForm.pristine) {
      this.modalRef.hide();
      return;
    }
    this.shiftService.editShift(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.toasterMessageService.showSuccess("Shift edited successfully");

          this.modalRef.hide();

          this.getShiftList();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
  }

  // delet method
  deleteShiftById(id): void {
    this.shiftService.deleteShift(id).subscribe(
      (response: CustomResponse) => {
        if (response.status === true) {
          this.toasterMessageService.showSuccess("Shift deleted sucessfully");
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      },
      () => {
        this.getShiftList();
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
    // console.log(event);
    if (event.sort[0]) {
      this.sort = event.sort;
      if (event.sort[0].dir === "asc") {
        this.sortno = "2";
      } else {
        this.sortno = "1";
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
    this.getShiftList();
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
    this.modalTitle = "Add Shift";
    this.selectedShift = null;
    this.buildShiftForm();

    this.modalRef = this.modalService.show(template, this.config);
  }

  openConfirmationDialogue(shift: ShiftList): void {
    const shiftId = {
      id: shift.shift_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = shift.name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteShiftById(JSON.stringify(shiftId));
      }
    });
  }

  // shift_from: new Date(
  //   new Date().toISOString().slice(0, 10) + " " + shift.shift_from
  // ),
  // edit modal
  openEditModel(shift: ShiftList, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Update";
    this.modalTitle = "Edit Shift";
    this.selectedShift = shift;
    // this object is made to covert a time string into  javascript instance object.
    // let changedShift = {
    //   shift_id: shift.shift_id,
    //   name: shift.name,
    //   shift_from: shift.shift_from,
    //   shift_to: shift.shift_to,
    //   sunday: shift.sunday,
    //   monday: shift.monday,
    //   tuesday: shift.tuesday,
    //   wednesday: shift.wednesday,
    //   thursday: shift.thursday,
    //   friday: shift.friday,
    //   saturday: shift.saturday,
    //   late_warn_time: shift.late_warn_time,
    //   check_in_restriction: shift.check_in_restriction,
    //   company_id: shift.company_id,
    //   break_time: shift.break_time,
    // };

    // this.shiftService.setSelectedShift(changedShift);
    // this.selectedShift = this.shiftService.getSelectedShift();

    this.buildShiftForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  // changeTimeFormate(): void {
  //   this.shiftForm.value.shift_from = this.datePipe.transform(
  //     this.shiftForm.value.shift_from,
  //     "HH:mm:ss"
  //   );
  //   this.shiftForm.value.shift_to = this.datePipe.transform(
  //     this.shiftForm.value.shift_to,
  //     "HH:mm:ss"
  //   );
  //   this.shiftForm.value.late_warn_time = this.datePipe.transform(
  //     this.shiftForm.value.late_warn_time,
  //     "HH:mm:ss"
  //   );
  //   this.shiftForm.value.check_in_restriction = this.datePipe.transform(
  //     this.shiftForm.value.check_in_restriction,
  //     "HH:mm:ss"
  //   );

  //   this.shiftForm.value.break_time = this.datePipe.transform(
  //     this.shiftForm.value.break_time,
  //     "HH:mm:ss"
  //   );
  // }

  setCheckedValues(): void {
    if (this.shiftForm.value.sunday == true) {
      this.shiftForm.value.sunday = "1";
    } else {
      this.shiftForm.value.sunday = "0";
    }
    if (this.shiftForm.value.monday == true) {
      this.shiftForm.value.monday = "1";
    } else {
      this.shiftForm.value.monday = "0";
    }
    if (this.shiftForm.value.tuesday == true) {
      this.shiftForm.value.tuesday = "1";
    } else {
      this.shiftForm.value.tuesday = "0";
    }
    if (this.shiftForm.value.wednesday == true) {
      this.shiftForm.value.wednesday = "1";
    } else {
      this.shiftForm.value.wednesday = "0";
    }
    if (this.shiftForm.value.thursday == true) {
      this.shiftForm.value.thursday = "1";
    } else {
      this.shiftForm.value.thrusday = "0";
    }
    if (this.shiftForm.value.friday == true) {
      this.shiftForm.value.friday = "1";
    } else {
      this.shiftForm.value.friday = "0";
    }
    if (this.shiftForm.value.saturday == true) {
      this.shiftForm.value.saturday = "1";
    } else {
      this.shiftForm.value.saturday = "0";
    }
  }

  onSubmitShift(): void {
    this.submitted = true;

    if (this.shiftForm.invalid) return;
    this.shiftForm.patchValue({
      company_id: this.companyId,
    });

    if (this.editMode) {
      this.shiftForm.patchValue({
        id: this.selectedShift.shift_id,
      });
      // this.changeTimeFormate();
      this.setCheckedValues();

      this.editShift(this.shiftForm.value);
    } else {
      // this.changeTimeFormate();
      this.setCheckedValues();
      this.addShift(this.shiftForm.value);
    }
  }
}
