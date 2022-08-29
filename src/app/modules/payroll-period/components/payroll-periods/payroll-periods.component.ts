import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '@app/shared/services/global/global.service';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AddPayrollPeriod, SearchPayrollPeriod } from '../../modal/payrollperiod.interface';
import { PayrollperiodService } from './../../service/payrollperiod.service';
import { CustomResponse } from '@app/shared/models/custom-response.model';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { PayrollParameter, SearchPayrollParameter } from '@app/modules/payroll-parameters/modal/payrollparameter.interface';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { PayrollGenerate } from '../../modal/payrollgenerate.interface';
import { Router } from '@angular/router';
import { SuggestParameterParams } from '../../modal/suggestparams.interface';
import { NepaliDatePickerSettings } from '@app/shared/components/nepali-date-picker/modals/nepalidatepickersettings.interface';
import { AdBsDateConvertService } from '@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service';


@Component({
  selector: 'app-payroll-periods',
  templateUrl: './payroll-periods.component.html',
  styleUrls: ['./payroll-periods.component.scss'],
  // encapsulation is required for rowCallBack function.
  encapsulation: ViewEncapsulation.None,
})
export class PayrollPeriodsComponent implements OnInit {
  dateFormatSetting:any;
  constructor(
    private globalService:GlobalService,
    private localStorageService:LocalStorageService,
    private payrollPeriodService:PayrollperiodService,
    private modalService: BsModalService,
    private fb:FormBuilder,
    private toasterMessageService:ToastrMessageService,
    private router:Router,
    private adbsConvertService:AdBsDateConvertService
  ) {
    this.dateFormatSetting =
    this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
  //configure the setting by general and userwise preference
  this.configUserDateAndTimeSetting();
  this.initSettings();
  }
  datePickerConfig: any;
  datePickerConfigForTo: any;

  ngOnInit() {
    this.getPayrollPeriodList();
    this.getAllPayrollParameters();

    // if setting has nepali date
    if(this.datePickerFormat =="N"){
      this.initSettingsForDatepicker();
    }
  }
  public gridView: GridDataResult = {
    data:[],
    total:0
  };
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

  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  listLoading:boolean = false;
  pageLimit = parseInt(this.globalService.pagelimit)
  skip = 0;
  // on data state chnage method starts here
  onDataStateChange(event) {
    // sorting logic ends here..
    this.skip = event.skip;
    if (event.skip == 0) {
      this.page = "1";
    } else {
      const pageNo = event.skip / event.take + 1;
      this.page = pageNo.toString();
    }
    this.searchPayrollPeriod.page = +this.page;
    this.getPayrollPeriodList();

  }
  status:boolean = true;
  params = {
    access_token: this.globalService.getAccessTokenFromCookie,
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortnane: "",
    sortno: 1,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      date_from: "",
      date_to: "",
      status: this.status ? "1" : "0",
    }
  }
  // sortDescriptor declaration for kendo grid
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

  // state declaration for kendo grid
  public state: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: "and",
      filters: [],
    },
  };
  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
   backdrop: true,
   ignoreBackdropClick: true,
 };
 payperiodForm:FormGroup;
 openAddModal(template: TemplateRef<any>) {
this.buildPayperiodForm();
  this.modalRef = this.modalService.show(template, this.config);

}

buildPayperiodForm(){
  this.payperiodForm = this.fb.group({
    date_from:["",Validators.required],
    date_to:["",Validators.required],
    type:["",Validators.required],
  })
}
onSave(){
  if(this.payperiodForm.invalid) return;
  let body:AddPayrollPeriod = {
    access_token:this.globalService.getAccessTokenFromCookie(),
    company_id:this.globalService.getCompanyIdFromStorage(),
    group_type:+this.payperiodForm.get('type').value,
    date_type:this.datePickerFormat == "E" ? 'English':"Nepali",
    date_from:this.payperiodForm.get('date_from').value,
    date_to:this.payperiodForm.get('date_to').value,
    user_id:this.globalService.getCurrentUserId()
  }
  if(this.datePickerFormat == "E"){
    body.date_from = this.globalService.transformFromDatepicker(body.date_from),
    body.date_to = this.globalService.transformFromDatepicker(body.date_to)
  }
  if(this.datePickerFormat == "N"){
    body.date_from = this.adbsConvertService.transformDateForAPI(body.date_from, this.datePickerConfig.dateInputFormat);
    body.date_to = this.adbsConvertService.transformDateForAPI(body.date_to, this.datePickerConfig.dateInputFormat);
  }

  this.payrollPeriodService.savePayrollPeriod(body).subscribe((res:CustomResponse)=>{
    if(res.status){
      console.log(res);
      this.toasterMessageService.showSuccess("Payroll Period added successfully.")
      this.modalRef ? this.modalRef.hide():null;
      this.getPayrollPeriodList();
    }
    else{
      this.toasterMessageService.showError(res.data);
    }
  })



}


searchPayrollPeriod:SearchPayrollPeriod ={
  access_token: this.globalService.getAccessTokenFromCookie(),
  limit: +this.globalService.pagelimit,
  page: +this.globalService.pageNumber,
  // sortnane: "",
  // sortno: 1,
  company_id: this.globalService.getCompanyIdFromStorage(),
  // search: {
  //   group_type: "",
  //   date_from: "",
  //   date_to: ""
  // }
}
loading:boolean = false;
getPayrollPeriodList(){
  this.loading = true;
this.payrollPeriodService.searchParametersPeriods(
  this.searchPayrollPeriod
).subscribe((res:CustomResponse)=>{
  if(res.status){
    console.log("RES",res)
    this.gridView = {
      data:res.data,
      total:res.count
    }
    this.loading = false;
  }
  else{
    this.gridView = {
      data:[],
      total: 0
    }
    this.loading = false;
  }
},(err)=>{
  this.loading = false;
})
}

onDateChange(value,type:string){
  console.log("value and type",value,type)
  if(type=="dateFrom"){
    this.datePickerConfigForTo.minDate = new Date(value)
  }
}
parametersList:PayrollParameter[] = [];
getAllPayrollParameters(){
  this.loading= true;
 let params:SearchPayrollParameter = {
    access_token: this.globalService.getAccessTokenFromCookie(),
    limit: null,
    page: Number(this.globalService.pageNumber),
    sortnane: "title",
    sortno: 0,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      type: ""
    }
  }
  this.payrollPeriodService.getPayrollParametersList(params).subscribe((res:any)=>{
    if(res.status){
     this.parametersList = res.data
    }
    else{
      this.parametersList = []
    }
  })

}


  //reset the methods so that it doesn't have effects on other component in destroy
  confirmText:string
  setConfirmationDialogMethods(body){
    console.log("this is body",body)
    this.globalService.showConfirmBox.next(true);
    this.globalService.confirmationSubmitDisableStatus.next(true);
    this.globalService.showConfirmationLabel.next("Enter Group Name");
    this.globalService.confirmInputText.subscribe((res)=>{
      this.confirmText = res;
      this.globalService.confirmationSubmitDisableStatus.next(true);
      if(this.confirmText == body.group_name.trim()){
        this.globalService.confirmationSubmitDisableStatus.next(false);
      }
      else{
        this.globalService.confirmationSubmitDisableStatus.next(true);
      }
    }

    )
  }


  deletePayrollPeriod(body){
    let deleteObj = {
      access_token:this.globalService.getAccessTokenFromCookie(),
      period_id:body.period_id
    }
    this.payrollPeriodService.deletePayrollPeriod(deleteObj).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toasterMessageService.showSuccess("Successfully deleted.")
        this.getPayrollPeriodList();

      }
      else{
        this.toasterMessageService.showError(res.data)
      }
    })

  }

bsModalRef:BsModalRef
  onPayrollGenerateConfimation(event,data){
    console.log("event,",event,data)
    this.globalService.resetConfirmationMethods();
    this.bsModalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.bsModalRef.content.data = data.group_name;
    this.bsModalRef.content.action = "generate payroll for";
    this.bsModalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        // console.log("confirm clicked",confirm)
        this.onPayrollGenerate(data)
      }
    });
  }



  onPayrollGenerate(body:AddPayrollPeriod){
    let payrollGenerateObj:PayrollGenerate = {
      access_token:this.globalService.getAccessTokenFromCookie(),
      period_id:body.period_id,
      company_id:this.globalService.getCompanyIdFromStorage(),
      limit:null,
      sortnane:'',
      page:1,
      sortno:1
    }

    this.payrollPeriodService.onPayrollGenerate(payrollGenerateObj).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toasterMessageService.showSuccess("Payroll successfully generated.");
        // this.getPayrollPeriodList()
        this.onViewClicked(body)
        // this.router.navigate(['/payroll/view'],
        // {
        //   queryParams:body
        // }
        // )
      }
      else{
        this.toasterMessageService.showError(res.data)
      }
    })

  }

  onViewClicked(body){
    console.log("view",body);

    // return;
    this.router.navigate(['/payroll/view'],{
      queryParams:{
        date_from:body.date_from,
        date_to:body.date_to,
        id:body.period_id,
        groupname:body.group_name
      }
    })

  }
  onTypeChange(value){
    if(!value) return;
    let data:SuggestParameterParams = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      company_id:this.globalService.getCompanyIdFromStorage(),
      parameter_id:value,
      date_type:"English"
    }
    this.payrollPeriodService.onPayrollSuggest(
      data
    ).subscribe((res:any)=>{
      console.log(res);
      if(res.status){
        if(this.datePickerFormat=="E"){
          this.payperiodForm.patchValue({
            date_from:this.globalService.transformForDatepickerPreview(res.date_from,this.datePickerConfig.dateInputFormat),
            date_to:this.globalService.transformForDatepickerPreview(res.date_to,this.datePickerConfig.dateInputFormat)
          })
        }
        if(this.datePickerFormat =="N"){
          this.disableBefore =this.adbsConvertService.transformNepaliDatePickerPreview(res.date_from,this.datePickerConfig.dateInputFormat)
          this.payperiodForm.patchValue({
            date_from:this.adbsConvertService.transformNepaliDatePickerPreview(res.date_from,this.datePickerConfig.dateInputFormat),
            date_to:this.adbsConvertService.transformNepaliDatePickerPreview(res.date_to,this.datePickerConfig.dateInputFormat)
          })
        }
      }
      else{
        this.payperiodForm.patchValue({
          date_from:"",
          date_to:""
        })
      }
    })
  }

  disableBefore
  changeDate(value, type) {
    if (type == "dateFrom") {
      this.disableBefore = value;
      let dateToValue = this.payperiodForm.get("date_from").value;
      if (dateToValue && dateToValue < value) {
        this.payperiodForm.get("date_to").setValue("");
      }
      // }
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
      disableBefore: null,
      ndpMonth: true,
    }
  }



  ngOnDestroy(){
    this.globalService.resetConfirmationMethods();
  }

}
