import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomResponse } from '@app/shared/models/custom-response.model';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GlobalService } from '@app/shared/services/global/global.service';
import { Router } from '@angular/router';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PerformanceService } from '../../services/performance.service';
import { GetPerformanceBody } from '../addPerformance.modal';
import { Pagination } from '@app/shared/models/pagination.modal';
import { AdBsDateConvertService } from '@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { NepaliDatePickerSettings } from '@app/shared/components/nepali-date-picker/modals/nepalidatepickersettings.interface';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-performance-list',
  templateUrl: './performance-list.component.html',
  styleUrls: ['./performance-list.component.scss']
})
export class PerformanceListComponent implements OnInit {

  staffList: any;
  modalRef: BsModalRef;
  userCredentialsForm: FormGroup;
  searchForm: FormGroup;

  limit = this.globalService.pagelimit;
  userList: GridDataResult;

  submitted: boolean;
  skip = 0;
  listLoading: boolean;
  editMode: boolean;
  modalTitle: any;
  selectedUser: any;
  archiveUserToggle: boolean;
  public checked: boolean = true;
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

  constructor(
    private modalService: BsModalService,
    private toasterMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private performanceService: PerformanceService,
    private adbsdateConvertService: AdBsDateConvertService,
    private localStroageService: LocalStorageService,
    private datePipe: DatePipe
  ) {

    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    //configure the setting by general and userwise preference
    this.configUserDateAndTimeSetting();
    this.initSettings();
  }
  companyId = this.globalService.getCompanyIdFromStorage();
  randomNumber: number;
  getPerformanceBody: GetPerformanceBody = {
    company_id: this.globalService.getCompanyIdFromStorage(),
    limit: +this.globalService.pagelimit,
    page: +this.globalService.pageNumber,
    sortno: 1,
    sortnane: "",
    search: {
      user_id: this.globalService.getCurrentUserId(),
      month: "",
      year: ""

    }
  };

  ngOnInit() {
    this.buildSearchForm();
    this.getPerformanceList();
    this.setUpMethods();
    this.getStaffList();
  }
  performanceList: Pagination;
  getPerformanceList() {
    this.performanceService.searchPerformance(this.getPerformanceBody).subscribe((res) => {
      if (res.status) {
        // console.log('res', res)
        this.performanceList = { data: res.data, total: res.count };
      } else {
        this.performanceList = { data: [], total: 0 };
      }
    })
  }



  collapseButton: any;
  isCollapsed: boolean = true;
  collapsed(): void {
    this.collapseButton = "Search Employee";
  }

  expanded(): void {
    this.collapseButton = "Hide Search Bar";
  }

  buildSearchForm() {
    this.searchForm = this.fb.group({
      staff_id: "",
      username: "",
    });
  }

  getBody = {
    company_id: this.companyId,
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortno: 1,
    sortnane: "username",
    search: {
      staff_id: "",
      username: "",
      status: "Active",
    },
  };

  onSearchStaff(): void {
    this.getBody.search.staff_id = this.searchForm.value.staff_id;
    this.getBody.search.username = this.searchForm.value.username;
    // this.getUserList(this.getBody);
  }

  onCancel(): void {
    const getBody = {
      company_id: this.companyId,
      limit: this.globalService.pagelimit,
      page: this.globalService.pageNumber,
      sortno: 1,
      sortnane: "username",
      search: {
        staff_id: "",
        username: "",
        status: "Active",
      },
    };
    this.state.skip = 0;
    this.skip = 0;
    this.isCollapsed = true;
    this.buildSearchForm();

  }
  isOpen: false;

  staffLists;
  userLists:any;
  //gives ths stafflist under the current user id
  getStaffList() {
    this.performanceService.getStaffUnderManager(
      this.globalService.getCurrentUserId()
    ).subscribe((response) => {
      if (response.status) {
        this.staffList = response.data;
      } else {
        this.staffList = [];
        this.toasterMessageService.showWarning("There are no any staffs under current userid.");
      }
    });
  }
  changeEmp(){

  }




  selectedData;
  setData(data): void {
    this.selectedData = data;
  }







  dataStateChange(event): void {
    // if (event.sort[0]) {
    //   this.sort = event.sort;
    //   if (event.sort[0].dir === "asc") {
    //     this.getBody.sortno = 2;
    //   } else {
    //     this.getBody.sortno = 1;
    //   }
    //   if (event.sort[0].field != "") {
    //     this.getBody.sortnane = event.sort[0].field;
    //   }
    // }

    // sorting logic ends here..

    if (event.skip == 0) {
      this.skip = event.skip;

      this.getBody.page = "1";
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;

      this.getBody.page = pageNo.toString();
    }

    // pagination logic ends here
    if (event.filter) {
      if (event.filter.filters[0]) {
        if (event.filter.filters[0].field == "staff_id") {
          this.getBody.search.staff_id = event.filter.filters[0].value;
        }
        if (event.filter.filters[0].field == "username") {
          this.getBody.search.username = event.filter.filters[0].value;
        }
      } else {
        this.getBody.search.staff_id = "";
        this.getBody.search.username = "";
      }

    //  call perfromance get here
    }
    // search logic ends here
  }








  // modal config
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  refresh() {
    const getBody = {
      company_id: this.companyId,
      limit: this.globalService.pagelimit,
      page: this.globalService.pageNumber,
      sortno: 1,
      sortnane: "username",
      search: {
        staff_id: "",
        username: "",
        status: "Active",
      },
    };
    // this.getUserList(getBody);
  }



  pageLimit = parseInt(this.getBody.limit);
  settingFromCompanyWise: any;
  dateFormatSetting: any;
  configUserDateAndTimeSetting() {
    //if no userpreference
    this.settingFromCompanyWise = this.localStroageService.getLocalStorageItem(
      "setting_list"
    )
      ? this.localStroageService.getLocalStorageItem("setting_list")
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

  timeFormat;
  datePickerConfig: any;
  datePickerConfigForTo: any;
  datePickerFormat;
  systemSetting;
  datePickerSettingUserWise;
  initSettings() {
    this.systemSetting = this.globalService.getDateSettingFromStorage();
    //init the system date picker setting
    if (this.systemSetting !== null && this.systemSetting !== undefined) {
      this.datePickerFormat = this.systemSetting.GS_DATE;
    }
    // this.datePickerSettingUserWise = this.globalService.getUserPreferenceSetting('UP_DATE_TYPE');
    // if (this.datePickerSettingUserWise !== undefined && this.datePickerSettingUserWise !== null) {
    //   if (this.datePickerSettingUserWise.value) {
    //     this.datePickerFormat = this.datePickerSettingUserWise.value == 'BS' ? 'N' : 'E';
    //   }
    // }
  }

  disableBefore: any;
  changeDate(value, type) {
    if(!this.addPerformanceForm){
      return
    }
    if (type == "dateFrom") {
      this.disableBefore = value;
      let dateToValue = this.addPerformanceForm.get("date_to").value;
      if (dateToValue && dateToValue < value) {
        this.addPerformanceForm.get("date_from").setValue("");
      }
    }
  }
  nepaliDatePickerSettingsForDateFrom: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForDateTo: NepaliDatePickerSettings;
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
      disableBefore: this.currentNepaliFirstDayOfMonth,
      ndpMonth: true,
    }
  }


  currentNepaliDate: any;
  currentNepaliLastDate: any;
  currentNepaliFirstDayOfMonth: any;
  currentNepaliLastDayOfMonth: any;
  setUpMethods() {
    if (this.datePickerFormat == 'N') {
      this.currentNepaliDate = this.adbsdateConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat);
      this.currentNepaliLastDate = this.adbsdateConvertService.getCurrentLastNepalidate(this.datePickerConfig.dateInputFormat);
      this.currentNepaliFirstDayOfMonth = this.adbsdateConvertService.getNepaliFirstDayOfMonth(this.datePickerConfig.dateInputFormat);
      this.currentNepaliLastDayOfMonth = this.adbsdateConvertService.getLastDayOfNepaliMonth(this.datePickerConfig.dateInputFormat)
      this.disableBefore = this.currentNepaliFirstDayOfMonth
      this.initSettingsForDatepicker();
      this.changeDate(this.currentNepaliFirstDayOfMonth, "dateFrom");
    }
    else if (this.datePickerFormat == "E") {
      // this.currentMonth = new Date().getMonth() + 1;
      // this.onYearChange(new Date())
      // this.getFirstAndLastDayOfMonth(new Date().getMonth() + 1);
      // this.initDates();
    }
  }
  companyInfo: any;
  getCompanyInfo() {
    this.performanceService.getCompanyInfo(this.globalService.getCompanyIdFromStorage()).subscribe((res: CustomResponse) => {
      this.companyInfo = res.data[0];
    })
  }
  addPerformanceForm: FormGroup;
  disabled: boolean = false;
  onSavePerformance() {
    if (this.addPerformanceForm.invalid) return;
    // console.log("this ", this.addPerformanceForm.value);
    let formValue = this.addPerformanceForm.value;
    if (this.datePickerFormat == "E") {
      formValue.from_date = this.globalService.transformFromDatepicker(formValue.from_date);
      formValue.to_date = this.globalService.transformFromDatepicker(formValue.to_date);
      // formValue.s_date = this.globalService.transformFromDatepicker(formValue.s_date);
    }
    if (this.datePickerFormat == "N") {
      formValue.from_date = this.adbsdateConvertService.transformDateForAPI(formValue.from_date, this.datePickerConfig.dateInputFormat);
      formValue.to_date = this.adbsdateConvertService.transformDateForAPI(formValue.from_date, this.datePickerConfig.dateInputFormat);
      // formValue.s_date = this.adbsdateConvertService.transformDateForAPI(formValue.s_date,this.datePickerConfig.dateInputFormat);
    }
    if (this.disabled) { return }
    this.disabled = true;

    this.performanceService.savePerformance(formValue).subscribe((res: CustomResponse) => {
      if (res.status) {
        console.log("res hererere", res);
        this.toasterMessageService.showSuccess("Performance created successfully.")
        this.modalRef.hide();
        this.disabled = false;
        this.router.navigate(['/performance/update'],
          {
            queryParams: {
              id: res.data.performance_id
            }
          }
        )
      }
      else {
        this.disabled = false;
        this.toasterMessageService.showError(res.data);
      }
    })
  }
  onAddCancel() { }
  usersList: any[];
  getUsers() {
    // call api here
  }
  buildAddPerformanceForm() {
    this.addPerformanceForm = this.fb.group({
      from_date: [
        {
          value: this.globalService.transformForDatepickerPreview(
            this.globalService.englishFirstDayOfMonth,
            this.datePickerConfig.dateInputFormat
          ),
          disabled: false
        },

        Validators.required,

      ],
      to_date: [
        {
          value: this.globalService.transformForDatepickerPreview(
            this.currentDateInenglish,
            this.datePickerConfig.dateInputFormat
          ),
          disabled: false
        },
        Validators.required
      ],
      date_format: [
        this.datePickerFormat == "N" ? "nepali" :
          "english"
      ],
      user_id: ["",
        Validators.required
      ],
      company_id: [
        this.globalService.getCompanyIdFromStorage()
      ]
    })
    this.disabled = false;

  }
  // onCreatePerformance(){
  //   // api call
  //   if(this.addPerformanceForm.invalid)return;
  //   let body = this.addPerformanceForm.value;
  //   if(this.datePickerFormat =="E"){
  //     body.date_from = this.globalService.transformFromDatepicker(body.date_from),
  //     body.date_to = this.globalService.transformFromDatepicker(body.date_to)
  //   }
  //   if(this.datePickerFormat=="N"){
  //     body.date_from = this.adbsdateConvertService.transformDateForAPI(
  //       body.date_from,this.datePickerConfig.dateInputFormat
  //     )
  //     body.date_to = this.adbsdateConvertService.transformDateForAPI(
  //       body.date_to,this.datePickerConfig.date_to
  //     )
  //   }
  // }
  todaysDateInEnglish = new Date();
  currentDateInenglish = this.datePipe.transform(
    this.todaysDateInEnglish,
    "MM-dd-yyyy"
  );
  onCreateModalShow(template: TemplateRef<any>) {
    this.buildAddPerformanceForm();
    this.modalRef = this.modalService.show(
      template, this.config
    )
  }




}
