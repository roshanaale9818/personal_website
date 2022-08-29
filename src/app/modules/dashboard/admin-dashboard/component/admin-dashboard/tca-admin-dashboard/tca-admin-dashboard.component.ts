import { formatDate } from "@angular/common";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { GlobalService } from "@app/shared/services/global/global.service";
import { DashboardService } from "../../../../services/dashboard.service"
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";

@Component({
  selector: "app-tca-admin-dashboard",
  templateUrl: "./tca-admin-dashboard.component.html",
  styleUrls: ["./tca-admin-dashboard.component.scss"],
})
export class TcaAdminDashboardComponent implements OnInit {
  bsInlineValue = new Date();
  todayDate = "";
  constructor(
    private dashboardService: DashboardService,
    private modalService: BsModalService,
    private fb:FormBuilder,
    private globalService:GlobalService,
    private toasterMessageService:ToastrMessageService
  ) { }

  originalTheme:boolean = true;
  correctionAttendanceList:any[];
  ngOnInit() {
    this.changeDateFormat();
    this.getDashboardDetail();
    // this.getAdminDashboardSummary();
  }
    // modal config to unhide modal when clicked outside
    config = {
      backdrop: true,
      ignoreBackdropClick: true,
    };
    modalRef: BsModalRef;
    selectedData;
  onChangeCheckin(template: TemplateRef<any>,data){
    this.selectedData = data;
    this.buildCheckinForm(data);
      this.modalRef = this.modalService.show(template, this.config);
  }
  checkinForm:FormGroup;
  buildCheckinForm(data){
  this.checkinForm = this.fb.group({
    id: data
    ? data.attendance_id
    : "",
  checkin_datetime: [
    data.checkin_datetime
      ? data.checkin_datetime.replace(" ", "T")
      : null,
  ],
  checkout_datetime: [
    data.checkout_datetime
      ? data.checkout_datetime.replace(
          " ",
          "T"
        )
      : null,
  ],
  checkin_datetime_request: [
    data.checkin_datetime_request
      ? data.checkin_datetime_request.replace(
          " ",
          "T"
        )
      : null,
  ],
  checkout_datetime_request: [
    data.checkout_datetime_request
      ? data.checkout_datetime_request.replace(
          " ",
          "T"
        )
      : null,
  ],

  checkin_msg: [
   data
      ?data.checkin_msg
      : "",
  ],
  checkout_message: [
   data
      ?data.checkout_message
      : "",
  ],
  })


  }

  changeDateFormat() {
    this.todayDate = formatDate(
      this.bsInlineValue,
      "dd-MM-yyyy hh:mm:ss a",
      "en-US"
    );
  }

  leaveRequest:any[]=[];

  getDashboardDetail(){
    this.dashboardService.getAttandanceCorrection().subscribe((res:CustomResponse)=>{
      if(res.status){

        this.correctionAttendanceList = res.data;
      }
      else{
        this.correctionAttendanceList = [];
      }
    })
    this.dashboardService.getLeaveRequest().subscribe((res:CustomResponse)=>{
      if(res.status){

        this.leaveRequest = res.data;
      }
      else{
        this.leaveRequest =  []
      }
    })
  }

  // summaryDataObj: any = {
  //   totalstaff: "",
  //   activeusers: "",
  //   pending_leave: "",
  //   approve_leave: "",
  //   decline_leave: "",
  //   today_present_staff: "",
  //   attendance_correction: "",
  //   upcomming_holiday: []
  // }
  // getAdminDashboardSummary() {
  //   this.dashboardService.getAdminDashboardSummary(this.globalService.getCompanyIdFromStorage())
  //     .subscribe((res: CustomResponse) => {
  //       if (res.status) {
  //         this.summaryDataObj = res.data
  //       }
  //       else{
  //         this.summaryDataObj = {};
  //       }
  //     })

  // }
sendDateCheckin;
sendDateCheckout;
isLoading:boolean;
  onCheckInSave(){
    if(this.checkinForm.invalid) return;

    if(this.isLoading){
      return;
    }
    this.isLoading = true;
    this.sendDateCheckin =
      this.globalService.transformFromDatepicker(
        this.checkinForm.value.checkin_datetime
      ) +
      " " +
      this.globalService.transformFromTimePicker(
        this.checkinForm.value.checkin_datetime
      );

    this.sendDateCheckout =
      this.globalService.transformFromDatepicker(
        this.checkinForm.value.checkout_datetime
      ) +
      " " +
      this.globalService.transformFromTimePicker(
        this.checkinForm.value.checkout_datetime
      );



    const params = {
      id: this.checkinForm.value.id,
      checkin_datetime: this.sendDateCheckin,
      checkin_message: this.checkinForm.value.checkin_message,
      checkout_datetime: this.sendDateCheckout,
      checkout_message: this.checkinForm.value.checkout_message,
      company_id: this.globalService.getCompanyIdFromStorage(),
    };
    this.dashboardService.updateAttendanceCorrection(params).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.isLoading = false;
        this.toasterMessageService.showSuccess('Attendance updated successfully');
        this.getDashboardDetail();
        this.modalRef.hide();
      }
      else{
        this.toasterMessageService.showError("Attendance update failed.");
      }
    })

  }
}
