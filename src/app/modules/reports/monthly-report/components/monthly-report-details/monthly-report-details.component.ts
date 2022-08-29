import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { MonthlyReportService } from "../../services/monthly-report.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { GlobalService } from "../../../../../shared/services/global/global.service";
import { CorrectionAttendance } from "../../../../daybook-management/correction-attendance/models/correction-attendance.model";
import { ToastrMessageService } from "../../../../../shared/services/toastr-message/toastr-message.service";
import { ClientService } from "../../../../manage-client/client/client.service";
import { process, SortDescriptor, State } from "@progress/kendo-data-query";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
import { CustomDateTimeLocalPickerSettings } from "@app/shared/components/custom-datetimelocal-picker/modal/datepickerSetting";

@Component({
  selector: "app-monthly-report-details",
  templateUrl: "./monthly-report-details.component.html",
  styleUrls: ["./monthly-report-details.component.scss"],
})
export class MonthlyReportDetailsComponent implements OnInit {
  @Input() details;
  @Input() userId;
  @Input() clientId;
  @Output() onSubmit = new EventEmitter<any>();
  @Input() timeFormat;
  @Input() dateFormat;

  selectedForceChange: any;
  transformedCheckinDate: any;
  transformedCheckoutDate: any;
  checkinDate: Date;
  checkoutDate: Date;
  newCheckinTime: string;
  newCheckoutTime: string;
  newCheckinDate: string;
  newCheckoutDate: string;
  newCheckinDateTime: string;
  newCheckoutDateTime: string;
  date = new Date();
  timeFormatSetting: any;
  dateFormatSetting: any;

  constructor(
    private monthlyReportService: MonthlyReportService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private forceChangeService: MonthlyReportService,
    private toastrMessageService: ToastrMessageService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.initSettings();
    this.getUserAttendanceDetails();
  }

  status;
  userAttendance: any[] = [];
  gridView: GridDataResult;
  public state: State = {
    skip: 0,
    take: 10,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };

  abc(value) {
    this.onSubmit.emit(value);
  }

  nullRow: boolean;
  getUserAttendanceDetails(): void {
    let body = {
      id: this.userId,
      client_id: this.clientId,
      date: this.details.date,
    };

    this.monthlyReportService.getUserAttendance(body).subscribe((response) => {
      this.userAttendance = response;
      if (response.data == "empty") {
        this.nullRow = true;
      }
      this.gridView = process(this.userAttendance, this.state);
    });
  }

  forceChangeForm: FormGroup;
  buildForceChangeForm(): void {
    this.forceChangeForm = this.formBuilder.group({
      checkin_datetime: [
        this.checkinDate ? this.checkinDate : this.date,
        [Validators.required],
      ],
      checkout_datetime: [
        this.checkoutDate ? this.checkoutDate : this.date,
        [Validators.required],
      ],
    });
  }

  selectedAttendance;
  attendanceIdToForceChange: number;
  today = new Date();
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "modal-sm",
  };

  openForceChangeModal(template: TemplateRef<any>, dataItem): void {
    this.attendanceIdToForceChange = dataItem.attendance_id;
    this.selectedAttendance = dataItem;
    this.checkinDate = dataItem.checkin_datetime
      ? dataItem.checkin_datetime.replace(" ", "T")
      : this.date;
    this.checkoutDate = dataItem.checkout_datetime
      ? dataItem.checkout_datetime.replace(" ", "T")
      : this.date;

    this.buildForceChangeForm();
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmitForceChange(): void {

    if(!this.globalService.dateTimeLocalValidator(this.forceChangeForm.value.checkout_datetime,this.forceChangeForm.value.checkin_datetime)){
      this.toastrMessageService.showError("Checkout date cannot be smaller than check in date.");
      return;
    }
    const body = {
      id: this.attendanceIdToForceChange,
      checkin_datetime: this.forceChangeForm.value.checkin_datetime.replace(
        "T",
        " "
      ),
      checkout_datetime: this.forceChangeForm.value.checkout_datetime.replace(
        "T",
        " "
      ),
      company_id: this.globalService.getCompanyIdFromStorage(),
    };
    if (this.forceChangeForm.invalid || this.forceChangeForm.pristine) return;
    this.forceChangeService.updateForceChange(body).subscribe((response) => {
      if (response.status) {
        this.modalRef.hide();
        this.toastrMessageService.showSuccess(
          "Datetime is changed successfully"
        );

        this.onSubmit.emit("Done");
        this.abc("done");
        this.getUserAttendanceDetails();
      }
    });
  }

  // modal config
  openConfirmationDialogue(dataItem) {

    const monthlyReport = {
      id: dataItem.attendance_id,
    };

    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "this attendance";
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteAttendance(JSON.stringify(monthlyReport));
      }
    });
  }

  deleteAttendance(body): void {
    this.monthlyReportService.deleteForceChange(body).subscribe((response) => {
      if (response.status) {
        this.toastrMessageService.showSuccess(
          "Attendance is deleted successfully."
        );
        this.getUserAttendanceDetails();
      } else {
        this.toastrMessageService.showError("Attendance is not deleted.");
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
    width:'60%'
  }
  customDateTimeLocalPickerSettingsForCheckOut:CustomDateTimeLocalPickerSettings = {
    id:'checkOut',
    minDate:new Date(),
    maxDate:new Date(),
    class:'',
    placeholder:'Check Out Date Time',
    width:'60%'
  }
  onCheckInValue(value){
    //if validation is required we just pass the date here we just pass here for min and max
    // this.customDateTimeLocalPickerSettingsForCheckOut.maxDate = value;
    this.customDateTimeLocalPickerSettingsForCheckOut.minDate = value;
    this.forceChangeForm.get('checkout_datetime').setValue(value);
  }
  datePickerFormat;
  systemSetting;
  datePickerSettingUserWise;
  initSettings() {
    this.systemSetting = this.globalService.getDateSettingFromStorage();
    //init the system date picker setting
    if (this.systemSetting !== null && this.systemSetting !== undefined) {
      this.datePickerFormat = this.systemSetting.GS_DATE;
    }
    this.datePickerSettingUserWise = this.globalService.getUserPreferenceSetting('UP_DATE_TYPE');
    if (this.datePickerSettingUserWise !== undefined && this.datePickerSettingUserWise !== null) {
      if (this.datePickerSettingUserWise.value) {
        this.datePickerFormat = this.datePickerSettingUserWise.value == 'BS' ? 'N' : 'E';
      }
    }
  }
}
