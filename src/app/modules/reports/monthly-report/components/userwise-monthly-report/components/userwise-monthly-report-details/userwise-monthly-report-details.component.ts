import { UserwiseMonthlyReport } from "./../../models/userwise-monthly-report.model";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { BsModalService } from "ngx-bootstrap";
import { BsModalRef } from "ngx-bootstrap";
import { Component, Input, OnInit, Output, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { EventEmitter } from "events";
import { GlobalService } from "@app/shared/services/global/global.service";
import { MonthlyReportService } from "@app/modules/reports/monthly-report/services/monthly-report.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { CustomDateTimeLocalPickerSettings } from "@app/shared/components/custom-datetimelocal-picker/modal/datepickerSetting";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";

@Component({
  selector: "app-userwise-monthly-report-details",
  templateUrl: "./userwise-monthly-report-details.component.html",
  styleUrls: ["./userwise-monthly-report-details.component.scss"],
})
export class UserwiseMonthlyReportDetailsComponent implements OnInit {
  @Input() details;
  @Input() role;
  @Input() timeFormat;
  @Input() dateFormat;
  loading: boolean;
  attendanceIdToForceChange: string;

  userAttendanceList: any[] = [];
  userId = this.localStorageService.getLocalStorageItem("user_id");
  //Kendo Table
  limit = "30";
  skip = 0;
  pageLimit = parseInt(this.limit);
  public state: State = {
    skip: 0,
    take: 20,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  gridView: GridDataResult;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  constructor(
    private monthlyReportService: MonthlyReportService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private globalService: GlobalService,
    private userwiseForceChangeService: MonthlyReportService,
    private toastrMessageService: ToastrMessageService,
    private localStorageService: LocalStorageService,
    public authService:AuthService
  ) {}

  ngOnInit() {
    this.getUserAttendanceDetails();
    this.buildRequestChangeForm();
  }

  forceChangeForm: FormGroup;
  buildForceChangeForm(): void {
    this.forceChangeForm = this.formBuilder.group({
      company_id: this.globalService.getCompanyIdFromStorage(),
      id: this.selectedAttendance ? this.selectedAttendance.attendance_id : "",
      checkin_datetime: this.selectedAttendance
        ? this.selectedAttendance.checkin_datetime.replace(" ", "T")
        : "",
      checkout_datetime: this.selectedAttendance
        ? this.selectedAttendance.checkout_datetime.replace(" ", "T")
        : "",
    });
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.userAttendanceList, this.state);
  }

  getUserAttendanceDetails(): void {
    this.loading = true;
    let body = {
      id: this.userId,
      date: this.details.date,
    };

    this.monthlyReportService.getUserAttendances(body).subscribe(
      (response) => {
        if (response.status) {
          this.userAttendanceList = response.data;
          this.gridView = process(this.userAttendanceList, this.state);
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

  modalRef: BsModalRef;
  selectedAttendance;
  openCorrectionModal(template: TemplateRef<any>, dataItem): void {
    this.selectedAttendance = dataItem;
    this.buildForceChangeForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmitForceChange(): void {
    if(!this.globalService.dateTimeLocalValidator(this.forceChangeForm.value.checkout_datetime,this.forceChangeForm.value.checkin_datetime)){
      this.toastrMessageService.showError("Checkout date cannot be smaller than check in date.");
      return;
    }
    (this.forceChangeForm.value.checkin_datetime =
      this.forceChangeForm.value.checkin_datetime.replace("T", " ")),
      (this.forceChangeForm.value.checkout_datetime =
        this.forceChangeForm.value.checkout_datetime.replace("T", " "));
    if (this.forceChangeForm.invalid || this.forceChangeForm.pristine) return;
    this.userwiseForceChangeService
      .updateForceChange(this.forceChangeForm.value)
      .subscribe((response) => {
        if (response.status) {
          this.modalRef.hide();
          this.toastrMessageService.showSuccess(
            "Datetime is changed successfully"
          );
          this.getUserAttendanceDetails();
        }
      });
  }

  requestChangeForm: FormGroup;
  buildRequestChangeForm(): void {
    this.requestChangeForm = this.formBuilder.group({
      attendance_id: this.selectedUserwiseMonthlyAttendance
        ? this.selectedUserwiseMonthlyAttendance.attendance_id
        : "",
      in_datetime: this.selectedUserwiseMonthlyAttendance
        ? this.selectedUserwiseMonthlyAttendance.checkin_datetime.replace(
            " ",
            "T"
          )
        : "",
      out_datetime: this.selectedUserwiseMonthlyAttendance
        ? this.selectedUserwiseMonthlyAttendance.checkout_datetime.replace(
            " ",
            "T"
          )
        : "",
      message: "",
    });
  }

  selectedUserwiseMonthlyAttendance;
  openRequestModal(template: TemplateRef<any>, dataItem): void {
    this.selectedUserwiseMonthlyAttendance = dataItem;
    this.buildRequestChangeForm();
    console.log(this.selectedUserwiseMonthlyAttendance);
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmitRequestChange(): void {
    if(!this.globalService.dateTimeLocalValidator(this.requestChangeForm.value.out_datetime,this.requestChangeForm.value.in_datetime)){
      this.toastrMessageService.showError("Checkout date cannot be smaller than check in date.");
      return;
    }
    let body = {
      attendance_id: this.selectedUserwiseMonthlyAttendance.attendance_id,
      in_datetime: this.requestChangeForm.value.in_datetime.replace("T", " "),
      out_datetime: this.requestChangeForm.value.out_datetime.replace("T", " "),
      message: this.requestChangeForm.value.message,
    };

    this.userwiseForceChangeService
      .addRequestChange(body)
      .subscribe((response) => {
        if (response.status) {
          this.modalRef.hide();
          this.toastrMessageService.showSuccess(response.detail);
        } else {
          this.toastrMessageService.showError("Request is not submitted");
        }
      });
  }

    //setting for each datepicker formcontrol
    customDateTimeLocalPickerSettingsForCheckIn:CustomDateTimeLocalPickerSettings = {
      id:'checkin',
      minDate:new Date(),
      maxDate:new Date(),
      class:'',
      placeholder:'Check In Date Time',
      width:'100%'
    }
    customDateTimeLocalPickerSettingsForCheckOut:CustomDateTimeLocalPickerSettings = {
      id:'checkOut',
      minDate:new Date(),
      maxDate:new Date(),
      class:'',
      placeholder:'Check Out Date Time',
      width:'100%'
    }
    onCheckInValue(value){
      //if validation is required we just pass the date here we just pass here for min and max
      // this.customDateTimeLocalPickerSettingsForCheckOut.maxDate = value;
      this.customDateTimeLocalPickerSettingsForCheckOut.minDate = value;
      this.requestChangeForm.get('out_datetime').setValue(value);
    }

    customDateTimeLocalPickerSettingsForLunchIn:CustomDateTimeLocalPickerSettings = {
      id:'checkin',
      minDate:new Date(),
      maxDate:new Date(),
      class:'',
      placeholder:'Check In Date Time',
      width:'100%'
    }
    customDateTimeLocalPickerSettingsForLunchOut:CustomDateTimeLocalPickerSettings = {
      id:'checkOut',
      minDate:new Date(),
      maxDate:new Date(),
      class:'',
      placeholder:'Check Out Date Time',
      width:'100%'
    }
    onLunchInValue(value){
      //if validation is required we just pass the date here we just pass here for min and max
      // this.customDateTimeLocalPickerSettingsForCheckOut.maxDate = value;
      this.customDateTimeLocalPickerSettingsForLunchOut.minDate = value;
      this.forceChangeForm.get('checkout_datetime').setValue(value);
    }

}
