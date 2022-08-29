import { Router } from "@angular/router";
// import { map } from "rxjs/operators";
// import { ValidationMessageService } from "@app/shared/services/validation-message/validation-message.service";
import { DateConverterService } from "./../../../../shared/services/dateConverter/date-converter.service";
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GlobalService } from "@app/shared/services/global/global.service";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { MonthlyReportService } from "./../../monthly-report/services/monthly-report.service";
import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
// import { GridComponent } from "@progress/kendo-angular-grid";
import { BsDatepickerConfig } from "ngx-bootstrap";
// import { TimeCardService } from "../../time-card/services/time-card.service";
import { NepaliDatePickerSettings } from "@app/shared/components/nepali-date-picker/modals/nepalidatepickersettings.interface";
import { AuthService } from "@app/core/guards/auth/services/auth-service.service";
import { AdBsDateConvertService } from "@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service";
import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
@Component({
  selector: "app-monthly-chart",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./monthly-chart.component.html",
  styleUrls: ["./monthly-chart.component.scss"],
})
export class MonthlyChartComponent implements OnInit {
  staffList: any;
  user: any;
  loading: boolean;
  todaysDateInEnglish = new Date();
  currentEnglishMonth = this.todaysDateInEnglish.getMonth() + 1;
  dateSetting = this.globalService.getDateSettingFromStorage();
  dateFormat = this.dateSetting.GS_DT_FORMAT;
  nepaliMonth = this.globalService.nepaliMonth;
  englishMonth = this.globalService.englishMonth;
  monthlyChartForm: FormGroup;
  staff_id = this.localStorageService.getLocalStorageItem("user_id");
  englishFirstDayOfMonth = this.datePipe.transform(
    new Date(
      this.todaysDateInEnglish.getFullYear(),
      this.currentEnglishMonth - 1,
      1
    ),
    // "MM-dd-yyyy"
    "M/d/yy"
  );
  nepalifirstDayOfMonth = this.globalService.nepalifirstDayOfMonth;
  @Input() isSingleReport: boolean = false;

  currentDateInenglish = this.datePipe.transform(
    this.todaysDateInEnglish,
    // "MM-dd-yyyy"
    "M/d/yy"
  );
  currentNepaliDate = this.globalService.currentNepaliDate;
  nepaliFirstDayInString = this.globalService.nepaliFirstDayInString;
  currentNepaliDateInString = this.globalService.currentNepaliDateInString;
  submitted: boolean;
  statusField = ["In", "Out", "Total(Hrs)"];
  datePickerConfig: Partial<BsDatepickerConfig>;
  englishMonths: any[];
  nepaliMonths: any[];

  constructor(
    private localStorageService: LocalStorageService,
    private monthlyReportService: MonthlyReportService,
    private globalService: GlobalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private dateConverterService: DateConverterService,
    public auth: AuthService,
    // private validationMessageService: ValidationMessageService,
    private sanitizer: DomSanitizer,
    private adbsConvertService: AdBsDateConvertService,
    private router: Router,
  ) {
    // this.datePickerConfig = Object.assign(
    //   {},
    //   {
    //     containerClass: "theme-dark-blue",
    //     showWeekNumbers: false,
    //     dateInputFormat: "MM/DD/YYYY",
    //   }
    // );
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    this.configUserDateAndTimeSetting();
    this.initSettings();
  }

  currentUrl = this.router.url;
  ngOnInit() {
    this.loading = true;
    if (this.auth.currentUserRoleValue !== "staff") {
      this.getStaffList();
    }
    this.datePickerFormat == "E" ? this.englishMonths = this.globalService.englishMonth : this.nepaliMonths = this.globalService.nepaliMonth;
    this.buildForm();
    this.getMonthlyReport();
    // console.log(this.dateSetting.GS_DT_FORMAT);
    this.loading = false;
    if (this.datePickerFormat == "N") {
      this.assignNepaliDates();
    }


  }
  selectedMonth:string;

  currentNepaliLastDayOfMonth: any;
  currentNepaliFirstDayOfMonth: any;
  assignNepaliDates() {
    this.currentNepaliFirstDayOfMonth = this.adbsConvertService.getNepaliFirstDayOfMonth(this.datePickerConfig.dateInputFormat);
    this.currentNepaliLastDayOfMonth = this.adbsConvertService.getLastDayOfNepaliMonth(this.datePickerConfig.dateInputFormat)
    let currentNepaliMonth = this.datePickerConfig.dateInputFormat == "YYYY/MM/DD" ? this.currentNepaliLastDayOfMonth.substring(5, 7)
      :
      this.currentNepaliLastDayOfMonth.substring(0, 2);
    currentNepaliMonth = currentNepaliMonth < 9 ? currentNepaliMonth.substring(1, 2) : currentNepaliMonth;
    this.monthlyChartForm.get('month').setValue(
      currentNepaliMonth
    )
    // this.monthlyChartForm.get('date_from').setValue(
    //   this.currentNepaliFirstDayOfMonth ? this.currentNepaliFirstDayOfMonth:''
    // )

  }

  // nepali month change method starts here
  onEnglishMonthChange(value):void{
    console.log(value)
    if(!value) return;
    if(this.englishMonths.filter(x=>x.value == value)[0]){
      this.selectedMonth = this.englishMonths.filter(x=>x.value == value)[0].month;
    }
    let englishFirstDayOfMonth =
    this.globalService.transformForDatepickerPreview(
      new Date(new Date().getFullYear(), value - 1, 1),
      this.datePickerConfig.dateInputFormat
    );
  // this.dateFrom = englishFirstDayOfMonth;
  let englishLastDayOfMonth =
    this.globalService.transformForDatepickerPreview(
      new Date(new Date().getFullYear(), value,
        0),
      this.datePickerConfig.dateInputFormat
    );
  // thi
    this.monthlyChartForm.get('date_from').setValue(
      englishFirstDayOfMonth
    );
    this.monthlyChartForm.get('date_to').setValue(
      englishLastDayOfMonth
    );
    this.resetGrid();


  }

  // nepali month change method ends here

  buildForm() {
    const dateType = this.dateSetting.GS_DATE;
    this.monthlyChartForm = this.fb.group({
      client_id: "",
      id: [this.staff_id ? [String(this.staff_id)] : ""],
      date_from: [
        dateType == "E"
          ? this.globalService.transformForDatepickerPreview(
            this.englishFirstDayOfMonth, this.datePickerConfig.dateInputFormat
          )
          : this.nepalifirstDayOfMonth,
        Validators.required,
      ],
      date_to: [
        dateType == "E" ? this.globalService.transformForDatepickerPreview(this.currentDateInenglish,
          this.datePickerConfig.dateInputFormat) : this.currentNepaliDate,
        Validators.required,
      ],
      month: [
        this.datePickerFormat == "E" ? (new Date().getMonth() + 1) : ""
      ]
    });
    // console.log(new Date().getMonth() + 1)
    // console.log(this.monthlyChartForm.value);
    let value = "";
    if (this.datePickerFormat == "N") {
      this.setUpNepaliDates();
      value = this.monthlyChartForm.get('month').value;
    }
    else{
      value = this.monthlyChartForm.get('month').value;
      if(this.englishMonths.filter(x=>x.value == value)[0]){
        this.selectedMonth = this.englishMonths.filter(x=>x.value == value)[0].month;
      }
    }
  }
  // change on nepali month starts here

  onNepaliMonthChange(value: string) {
    console.log(value);
    if(this.nepaliMonths.filter(x=>x.value == value)[0]){
      this.selectedMonth = this.nepaliMonths.filter(x=>x.value == value)[0].month;
    }
    // this.selectedMonth =
    if (this.datePickerConfig.dateInputFormat == "YYYY/MM/DD") {
      let year = this.monthlyChartForm.get("date_from").value.substring(0, 4);
      value = value.length == 1 ? "0" + value : value;
      this.monthlyChartForm.get("date_from").setValue(
        `${year}/${value}/01`
      )
      this.monthlyChartForm.get("date_to").setValue(
        `${year}/${value}/${this.globalService.setNepaliDateFromAndTo(value)}`
      )
    }
    else {
      let year = this.monthlyChartForm.get("date_from").value.substring(6, 10);
      value = value.length == 1 ? "0" + value : value;
      this.monthlyChartForm.get("date_from").setValue(
        `${value}/01/${year}`
      )

      this.monthlyChartForm.get("date_to").setValue(
        `${value}/${this.globalService.setNepaliDateFromAndTo(value)}/${year}`
      )
    }
    this.resetGrid();
  }
  // change on nepali month ends here


  setUpNepaliDates() {
    console.log("returned", this.adbsConvertService.getNepaliFirstDayOfMonth(this.datePickerConfig.dateInputFormat))
    this.monthlyChartForm.get("date_to").setValue(
      this.adbsConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat)
    );
    // this.disableBefore = this.reportForm.get("date_from").value;
    this.monthlyChartForm.get("date_from").setValue(
      this.adbsConvertService.getNepaliFirstDayOfMonth(this.datePickerConfig.dateInputFormat)
    );
    // setTimeout(() => {
    //   this.disableBefore = this.adbsConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat)

    // })
  }

  clientChange(): void {
    this.monthlyChartForm.get("id").setValue("");
  }

  getStaffList() {
    this.user = [];
    this.monthlyReportService
      .getStaffList()
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.staffList = response.data;
          this.returnStaffWithId(response);
          return;
        }
      });
  }

  returnStaffWithId(response) {
    response.data.forEach((item) => {
      if (item.user_id == this.params.id) {
        this.user.push(item);
      }
    });
  }

  // initial value of params.
  params = {
    id: this.staff_id,
    date_from:
      this.dateSetting.GS_DATE == "E"
        ? this.englishFirstDayOfMonth
        : this.bsToAdInString(this.nepaliFirstDayInString),
    date_to:
      this.dateSetting.GS_DATE == "E"
        ? this.currentDateInenglish
        : this.bsToAdInString(this.currentNepaliDateInString),
  };

  reportList: any[] = [];

  absentCount;
  presentCount;
  workingDays;
  weekendCount;
  holidayCount;
  responseCount;
  totalHours;
  totalleaveCount;
  totalDays;
  totalWorkingHours;
  totalLength: [];
  getMonthlyReport(): void {
    console.log("called here in employee");
    if(!(this.monthlyChartForm.get('id').value) || (this.monthlyChartForm.get('id').value).length == 0){
      return;
    }
    this.loading = true;
    let bodyObj = {
      company_id: this.globalService.getCompanyIdFromStorage(),
      type: "",
      user: this.monthlyChartForm.get('id').value,

      // id: this.staff_id,

      date_from: this.globalService.transformFromDatepicker(
        this.datePickerFormat == "E"
          ? this.monthlyChartForm.get('date_from').value
          // this.englishFirstDayOfMonth
          : this.bsToAdInString(this.nepaliFirstDayInString)
      ),
      date_to: this.globalService.transformFromDatepicker(
        this.datePickerFormat == "E"
          ? this.monthlyChartForm.get('date_to').value
          //  this.currentDateInenglish
          : this.bsToAdInString(this.currentNepaliDateInString)
      ),
    };
    if (this.datePickerFormat == "N") {
      bodyObj.date_from = this.adbsConvertService.transformDateForAPI(
        this.monthlyChartForm.value.date_from, this.datePickerConfig.dateInputFormat
      );
      bodyObj.date_to == this.adbsConvertService.transformDateForAPI(
        this.monthlyChartForm.value.date_to, this.datePickerConfig.dateInputFormat
      );
    }
    // console.log("this is bodyObj", bodyObj);
    // this.params
    this.monthlyReportService.getMonthlyReport(bodyObj).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          // console.log("this is response",response)
          // this.reportList = response.data.att_data.attendance;
          // this.setSummaryFormApiResponse(response.data.att_data.summary);
          // console.log("filtered",response.data.alluserclientdata.filter(x=>x.user_id == this.staff_id));
          if (this.isSingleReport == true) {
            // let filteredArr:any[] =response.data.alluserclientdata.filter(x=>x.user_id == this.staff_id);
            // this.reportList = filteredArr ? filteredArr[0].data.attendance:[];
            // this.setSummaryFormApiResponse( filteredArr ? filteredArr[0].data.summary:null)
            // this.reportList = response.data.att_data[0].attendance;
            this.reportList = response.data.att_data;
            this.reportView = { data: this.reportList, total: this.reportList.length };
            this.setSummaryFormApiResponse(response.data.att_data[0].summary)

            // this.totalLength = this.reportList[0].attendance;
            // console.log("this is response",response);
            // this.setSummaryFormApiResponse( response.data.att_data[0].summary)
          }
          else {
            // this.reportList  = response.data.alluserclientdata;
            // console.log("this is response",response);
            // console.log("this is report lis ",this.reportList);
            this.reportList = response.data.att_data;
            this.reportView = { data: this.reportList, total: this.reportList.length };
            this.setSummaryFormApiResponse(response.data.att_data[0].summary)
            let customState: DataStateChangeEvent = {
              filter: {
                filters: [],
                logic: "and"
              },
              group: [],
              skip: 0,
              sort: [],
              take: 10
            }
            this.reportList.length > 10 ? this.dataStateChange(customState) : null;
            // console.log(this.reportList)

          }


          return;
        } else {
          this.reportView = { data: [], total: 0 };
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

  setSummaryFormApiResponse(summary) {
    if (summary == null) {
      return;
    }
    this.absentCount = summary.absent;
    this.totalleaveCount = summary.leavetot;
    this.presentCount = summary.leavetot;
    this.totalDays = summary.totaldays;
    this.totalHours = summary.total;
    this.workingDays = summary.workingdays;
    this.holidayCount = summary.offday;
    this.totalWorkingHours = summary.workinghr;
  }

  // reset method starts here
  resetGrid(){
    // this.reportView = process (data = [],state =null)
    this.reportView = { data: [], total: 0 };
  }
  // reset method ends here

  // addHoursAndMinuteString(response) {
  //   response.forEach((item) => {
  //     let indexOfColon = item.attendance.indexOf(":");
  //     let lengthOfString = item.attendance.length - 1;
  //     let hour = item.attendance.substr(0, indexOfColon);
  //     let minute = item.attendance.substr(indexOfColon + 1, lengthOfString);
  //     if (minute == ":00") {
  //       minute = "0";
  //     }
  //     this.totalHours = this.totalHours + parseInt(hour);
  //     this.totalMinute = this.totalMinute + parseInt(minute);
  //   });
  // }

  // checkCount(response) {
  //   response.forEach((item) => {
  //     if (item.attendance == "00:00" && item.weekend == "") {
  //       this.absentCount = this.absentCount + 1;
  //     } else if (item.attendance !== "00:00" && item.weekend == "") {
  //       this.presentCount = this.presentCount + 1;
  //     }
  //     if (item.weekend == "") {
  //       this.workingDays = this.workingDays + 1;
  //     } else {
  //       this.weekendCount = this.weekendCount + 1;
  //     }
  //     if (item.holiday !== null) {
  //       this.holidayCount = this.holidayCount + 1;
  //     }
  //     this.responseCount = this.responseCount + 1;
  //   });
  // }

  user_id = this.params.id;
  date = "2021/02/01";

  searchReport() {
    this.submitted = true;
    if (this.monthlyChartForm.invalid) return;

    this.params.id = this.monthlyChartForm.value.id;
    if (this.dateSetting.GS_DATE == "E") {
      let dateFrom = this.datePipe.transform(
        this.monthlyChartForm.value.date_from,
        "yyyy-MM-dd"
      );
      let dateTo = this.datePipe.transform(
        this.monthlyChartForm.value.date_to,
        "yyyy-MM-dd"
      );

      this.params.date_from = dateFrom;
      this.params.date_to = dateTo;
    } else {
      // when datetype is in nepali fomate..converting the nepali date into englsh.
      let dateFromInString = `${this.monthlyChartForm.value.date_from.year}/${this.monthlyChartForm.value.date_from.month}/${this.monthlyChartForm.value.date_from.day}`;
      let dateToInString = `${this.monthlyChartForm.value.date_to.year}/${this.monthlyChartForm.value.date_to.month}/${this.monthlyChartForm.value.date_to.day}`;
      let dateFromInAd = this.bsToAdInString(dateFromInString);
      let dateToInAd = this.bsToAdInString(dateToInString);

      this.params.date_from = dateFromInAd;
      this.params.date_to = dateToInAd;
    }
    this.getMonthlyReport();

    // this.getStaffList();
  }

  bsToAdInString(dateInBs) {
    return this.dateConverterService.bsToAdInString(dateInBs);
  }
  adToBsInString(dateInAd) {
    return this.dateConverterService.adToBsInString(dateInAd);
  }
  // date formator for nepali date-picker
  dateFormatter(date) {
    const formatedDate = `${date.year}-${date.month + 1}-${date.day}`;
    return formatedDate;
  }

  // function for checking hours less than 8 hours or not!!
  checkHours(item) {
    let indexOfColon = item.attendance.indexOf(":");
    let lengthOfString = item.attendance.length - 1;
    let hour = item.attendance.substr(0, indexOfColon);
    let minute = item.attendance.substr(indexOfColon + 1, lengthOfString);
    if (minute == ":00") {
      minute = "0";
    }
    if (parseInt(hour) >= 8) {
      return true;
    } else {
      return false;
    }
  }

  public colorCode(item): SafeStyle {
    let result;
    if (item.weekend !== "") {
      //  weekend color
      result = "#9bc4db";
    }
    if (item.attendance !== "00:00" && item.weekend == "") {
      if (this.checkHours(item)) {
        // hours meet color
        result = "rgba(151, 233, 173, 0.68)";
      } else {
        // hour not meet color
        result = "rgb(255, 128, 128)";
      }
    }
    return this.sanitizer.bypassSecurityTrustStyle(result);
  }
  clientList: any[];
  getStaffId(value) { }
  datePickerFormat;
  systemSetting;
  datePickerSettingUserWise;
  dateFormatSetting: any;
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


    if (this.datePickerFormat == "N") {
      this.initSettingsForDatepicker()
    }
  }
  // datePickerConfig: any;
  datePickerConfigForTo: any;
  settingFromCompanyWise: any;
  configUserDateAndTimeSetting() {
    //if no userpreference
    this.settingFromCompanyWise = this.localStorageService.getLocalStorageItem(
      "setting_list"
    )
      ? this.localStorageService.getLocalStorageItem("setting_list")
      : null;
    if (!this.dateFormatSetting || !this.dateFormatSetting.value) {

      let generalDateFormatSetting = this.settingFromCompanyWise.filter(
        (x) => x.code == "GS_DT_FORMAT"
      )[0];
      this.datePickerConfig = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          adaptivePosition: true,
          dateInputFormat:
            (generalDateFormatSetting && generalDateFormatSetting.value == "0")
              || (generalDateFormatSetting && generalDateFormatSetting.value == "2")
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",

        }
      );
      this.datePickerConfigForTo = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          adaptivePosition: true,
          dateInputFormat:
            (generalDateFormatSetting && generalDateFormatSetting.value == "0") ||
              (generalDateFormatSetting && generalDateFormatSetting.value == "2")
              ? "YYYY/MM/DD"
              : "MM/DD/YYYY",
        }
      );
    }
    //if user has userpreference
    else {
      this.datePickerConfig = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          adaptivePosition: true,
          dateInputFormat: this.dateFormatSetting &&
            this.dateFormatSetting.value == "yyyy/mm/dd"
            ? "YYYY/MM/DD"
            : "MM/DD/YYYY",
        }
      );
      this.datePickerConfigForTo = Object.assign(
        {},
        {
          containerClass: "theme-dark-blue",
          showWeekNumbers: false,
          // minMode: 'year',
          adaptivePosition: true,
          dateInputFormat: this.dateFormatSetting &&
            this.dateFormatSetting.value == "yyyy/mm/dd"
            ? "YYYY/MM/DD"
            : "MM/DD/YYYY",
        }
      );
    }
  }

  changeDate(value, type) {
    if (type == "dateFrom") {
      this.disableBefore = value;

    }
  }

  nepaliDatePickerSettingsForDateFrom: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForDateTo: NepaliDatePickerSettings;
  disableBefore
  initSettingsForDatepicker() {
    this.nepaliDatePickerSettingsForDateFrom = {
      language: "english",
      dateFormat: this.datePickerConfig.dateInputFormat,
      ndpMonth: true,
      ndpYear: true
    }
    this.nepaliDatePickerSettingsForDateTo = {
      language: "english",
      dateFormat: this.datePickerConfig.dateInputFormat,
      ndpYear: true,
      disableBefore: "",
      ndpMonth: true,
    }
  }
  onSelectAll() {

    this.monthlyChartForm.get('id').setValue(
      this.staffList.map(x => x.user_id)
    );

  }
  onClearAll() {
    this.monthlyChartForm.get('id').setValue([]);
  }
  skip: number = 0;
  dataStateChange(state: DataStateChangeEvent): void {
    console.log(state)
    this.state = state;
    this.reportView = process(this.reportList, this.state);
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
    // this.skip = event.skip;
    // if (event.skip == 0) {

    //   // this.getBody.page = "1";
    // } else {
    //   // this.skip = event.skip;
    //   const pageNo = event.skip / event.take + 1;

    //   // this.getBody.page = pageNo.toString();
    // }
    // pagination logic ends here

    // if (event.filter) {
    //   if (event.filter.filters[0]) {
    //     const searchTerm = event.filter.filters[0].value;
    //     const searchField = event.filter.filters[0].field;
    //     this.search_value = searchTerm;
    //     this.search_key = searchField;
    //   } else {
    //     this.search_value = "";
    //     this.search_key = "";
    //   }
    // }
    // search logic ends here
    // this.getStaffList(this.getBody);
  }
  public state: State = {
    skip: 0,
    take: 10,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  public reportView: GridDataResult = process(
    this.reportList,
    this.state
  );

  get monthName(){

    if(this.datePickerFormat =="E"){
      console.log(
        this.nepaliMonths[Number[this.monthlyChartForm.get("month").value]]
      )
      return this.englishMonths[Number(this.monthlyChartForm.get("month").value)]
    }
    return this.nepaliMonths[Number[this.monthlyChartForm.get("month").value]]
  }
}
