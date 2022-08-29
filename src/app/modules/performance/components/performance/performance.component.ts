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
import { environment } from "@env/environment";
// import { filter } from 'rxjs/operators';
import { PerformanceService } from '../../services/performance.service';
// import { Performance } from './../modal/performance.modal';
// import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit {
  imageUrl = environment.baseImageUrl;
  currentUrl: string;
  userid:string;
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
    this.activatedRoute.url.subscribe((res) => {
      console.log("P", res)
    });
    // console.log("this is ", this.activatedRoute);
    this.activatedRoute.queryParams.subscribe(params => {
      console.log("these are params", params);
      this.userid = params?params.user_id:null;
      this.performance_id = params?params.id:null;
    })
    this.currentUrl = this.router.url;
    console.log("this is currentUrl", this.currentUrl);


  }
  performance_id:any;

  ngOnInit() {
    this.getCompanyLogo(this.globalService.getCompanyIdFromStorage());
    this.getCompanyInfo();
    this.buildPerformanceForm();
    this.setUpMethods();
    this.getPerformanceById();
  }
  performanceForm: FormGroup;
  buildPerformanceForm(data?:any) {
    this.performanceForm = this.fb.group({
      access_token: [this.globalService.getAccessTokenFromCookie()],
      user_id: [
        data?data.user_id
        :"", Validators.required],
      from_date: [
        {
          value: this.globalService.transformForDatepickerPreview(
            data?data.from:this.globalService.englishFirstDayOfMonth,
            this.datePickerConfig.dateInputFormat
          ),
          disabled: this.currentUrl.includes("view")
        },

        Validators.required,

      ],
      to_date: [
        {
          value: this.globalService.transformForDatepickerPreview(
            data?data.to_date:this.currentDateInenglish,
            this.datePickerConfig.dateInputFormat
          ),
          disabled: this.currentUrl.includes("view")
        }
      ],
      date_format: [],
      employee_type: [],
      job_know: [
        {
          value:data?String(data.job_know): "",
          disabled: this.currentUrl.includes("view")
        }
      ],
      job_know_commrnt: [
        {
          value: data?data.job_know_commrnt:"",
          disabled: this.currentUrl.includes("view")
        }
      ],
      quality: [{
        value: data?String(data.quality):"",
        disabled: this.currentUrl.includes("view")
      }],
      quality_comment: [
        {
          value: data?data.quality_comment:"",
          disabled: this.currentUrl.includes("view")
        }
      ],
      punctuality: [{
        value: data?String(data.punctuality):"",
        disabled: this.currentUrl.includes("view")
      }],
      punctuality_comment: [
        {
          value: data?data.punctuality_comment:"",
          disabled: this.currentUrl.includes("view")
        }
      ],
      productivity: [{
        value: data?String(data.productivity):"",
        disabled: this.currentUrl.includes("view")
      }],
      productivity_comment: [
        {
          value: data?data.productivity_comment:"",
          disabled: this.currentUrl.includes("view")
        }
      ],
      communication: [{
        value: data?String(data.communication):"",
        disabled: this.currentUrl.includes("view")
      }],
      communication_comment: [
        {
          value:data?data. communication_comment:"",
          disabled: this.currentUrl.includes("view")
        }
      ],
      dependability: [{
        value: data?String(data.dependability):"",
        disabled: this.currentUrl.includes("view")
      }],
      dependability_comment: [{
        value: data?data.dependability_comment:"",
        disabled: this.currentUrl.includes("view")
      }],
      additional_comment: [
        {
          value:data?data.additional_comment:"",
          disabled:this.currentUrl.includes("view")
        }
      ],
      goal_comment: [
        {
          value:data?data.goal_comment:"",
          disabled:this.currentUrl.includes("view")
        }
      ],
      e_name: [
        data?data.e_name:""
      ],
      e_date: [
        data?
        this.globalService.transformForDatepickerPreview(
          data.e_date,
          this.datePickerConfig.dateInputFormat
        ):""
      ],
      s_name: [
        {
          value:data?data.s_name:"",
          disabled:this.currentUrl.includes("view")
        }
      ],
      s_date: [
        {
          value: data?
          this.globalService.transformForDatepickerPreview(
            data.s_date,
            this.datePickerConfig.dateInputFormat
          ):"",
          disabled:this.currentUrl.includes("view")
        }
      ],
      company_id: [data?data.company_id:this.globalService.getCompanyIdFromStorage()],
      id: [data ? data.performance_id : ""],
      month:[
        data?data.month:""
      ]
    })

  }
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
      let dateToValue = this.performanceForm.get("date_to").value;
      if (dateToValue && dateToValue < value) {
        this.performanceForm.get("date_from").setValue("");
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
    if (this.performanceForm.invalid) return;
    console.log("this ", this.performanceForm.value);
    let formValue = this.performanceForm.value;
    if(this.datePickerFormat == "E"){
      formValue.from_date=this.globalService.transformFromDatepicker(formValue.from_date);
      formValue.to_date = this.globalService.transformFromDatepicker(formValue.to_date);
      formValue.s_date = this.globalService.transformFromDatepicker(formValue.s_date);
    }
    if(this.datePickerFormat =="N"){
      formValue.from_date=this.adbsdateConvertService.transformDateForAPI(formValue.from_date,this.datePickerConfig.dateInputFormat);
      formValue.to_date = this.adbsdateConvertService.transformDateForAPI(formValue.to_date,this.datePickerConfig.dateInputFormat);
      formValue.s_date = this.adbsdateConvertService.transformDateForAPI(formValue.s_date,this.datePickerConfig.dateInputFormat);
    }

    this.performanceService.editPerformance(formValue).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toasterMessageService.showSuccess("Performance saved successfully.")
      }
      else{
        this.toasterMessageService.showError("Performance saving failed");
      }
    })



  }
  onCancel() {
    this.getPerformanceById();
  }
performanceDetail:any;
  getPerformanceById(){
    this.performanceService.getPerformanceDetailById(
      this.datePickerFormat =="E"?"English": "Nepali",
      this.performance_id,
      this.globalService.getCompanyIdFromStorage()
    ).subscribe((res:CustomResponse)=>{
      if(res.status){
        console.log("Res",res);
        this.performanceDetail = res.data;
        this.buildPerformanceForm(res.data.model);
        console.log("builded",this.performanceForm.value)
      }
      else{
        this.performanceDetail = null;
        console.log(res);
      }
    })
  }
}
