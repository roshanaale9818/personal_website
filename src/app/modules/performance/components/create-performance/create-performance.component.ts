import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '@app/modules/setting/general-setting/services/setting.service';
import { AdBsDateConvertService } from '@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service';
import { NepaliDatePickerSettings } from '@app/shared/components/nepali-date-picker/modals/nepalidatepickersettings.interface';
import { CustomResponse } from '@app/shared/models/custom-response.model';
import { GlobalService } from '@app/shared/services/global/global.service';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { PerformanceService } from '../../services/performance.service';

@Component({
  selector: 'app-create-performance',
  templateUrl: './create-performance.component.html',
  styleUrls: ['./create-performance.component.scss']
})
export class CreatePerformanceComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private generalSettingService: SettingService,
    private globalService: GlobalService,
    private localStorageService: LocalStorageService,
    private adbsdateConvertService: AdBsDateConvertService,
    private datePipe: DatePipe,
    private performanceService: PerformanceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toasterMessageService:ToastrMessageService
  ) {
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    //configure the setting by general and userwise preference
    this.configUserDateAndTimeSetting();
    this.initSettings();
    // this.activatedRoute.url.subscribe((res) => {
    //   console.log("P", res)
    // });
  }

  ngOnInit() {
    this.buildAddPerformanceForm();
    this.getCompanyLogo(this.globalService.getCompanyIdFromStorage());
    this.getCompanyInfo();
    this.setUpMethods();

  }
addPerformanceForm:FormGroup;
  selectedPerformance;
  todaysDateInEnglish = new Date();
  currentDateInenglish = this.datePipe.transform(
    this.todaysDateInEnglish,
    "MM-dd-yyyy"
  );

  detail;
  companyId: number;
  getCompanyLogo(id): void {
    this.generalSettingService
      .getCompanyLogo(id)
      .subscribe((response) => {
        console.log('response', response)
        this.detail = response;
      });
  }
  settingFromCompanyWise: any;
  dateFormatSetting: any;
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
    this.datePickerSettingUserWise = this.globalService.getUserPreferenceSetting('UP_DATE_TYPE');
    if (this.datePickerSettingUserWise !== undefined && this.datePickerSettingUserWise !== null) {
      if (this.datePickerSettingUserWise.value) {
        this.datePickerFormat = this.datePickerSettingUserWise.value == 'BS' ? 'N' : 'E';
      }
    }
  }

  disableBefore: any;
  changeDate(value, type) {
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

  onSavePerformance() {
    if (this.addPerformanceForm.invalid) return;
    console.log("this ", this.addPerformanceForm.value);
    let formValue = this.addPerformanceForm.value;
    if(this.datePickerFormat == "E"){
      formValue.from_date=this.globalService.transformFromDatepicker(formValue.from_date);
      formValue.to_date = this.globalService.transformFromDatepicker(formValue.from_date);
      formValue.s_date = this.globalService.transformFromDatepicker(formValue.s_date);
    }
    if(this.datePickerFormat =="N"){
      formValue.from_date=this.adbsdateConvertService.transformDateForAPI(formValue.from_date,this.datePickerConfig.dateInputFormat);
      formValue.to_date = this.adbsdateConvertService.transformDateForAPI(formValue.from_date,this.datePickerConfig.dateInputFormat);
      formValue.s_date = this.adbsdateConvertService.transformDateForAPI(formValue.s_date,this.datePickerConfig.dateInputFormat);
    }

    this.performanceService.savePerformance(formValue).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toasterMessageService.showSuccess("Performance created successfully.")
      }
      else{
        this.toasterMessageService.showError("Performance creation failed");
      }
    })



  }
  onCancel() { }
  usersList:any[];
  getUsers(){
    // call api here

  }
  buildAddPerformanceForm(){
    this.addPerformanceForm = this.fb.group({
      date_from: [
        {
          value: this.globalService.transformForDatepickerPreview(
            this.globalService.englishFirstDayOfMonth,
            this.datePickerConfig.dateInputFormat
          ),
          disabled: false
        },

        Validators.required,

      ],
      date_to: [
        {
          value: this.globalService.transformForDatepickerPreview(
            this.currentDateInenglish,
            this.datePickerConfig.dateInputFormat
          ),
          disabled: false
        },
        Validators.required
      ],
      date_format: [],
      user_id:["",
        Validators.required
      ]
    })
  }
  onSave(){
    // api call
  }

}
