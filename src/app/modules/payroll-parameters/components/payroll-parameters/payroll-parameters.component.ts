import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '@app/shared/services/global/global.service';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PayrollParameter, SearchPayrollParameter } from '../../modal/payrollparameter.interface';
import { PayrollParameterService } from '../../service/payroll-parameter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { Observable } from 'rxjs';
import { CustomResponse } from '@app/shared/models/custom-response.model';

@Component({
  selector: 'app-payroll-parameters',
  templateUrl: './payroll-parameters.component.html',
  styleUrls: ['./payroll-parameters.component.scss']
})
export class PayrollParametersComponent implements OnInit {
  dateFormatSetting:any;
  constructor(
    private globalService:GlobalService,
    private localStorageService:LocalStorageService,
    private payrollParameterService:PayrollParameterService,
    private modalService: BsModalService,
    private fb:FormBuilder,
    private toasterMessageService:ToastrMessageService,
    private cdref:ChangeDetectorRef

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

    this.month = this.datePickerFormat == "E" ? this.globalService.englishMonth:null;
    if(this.datePickerFormat=="N"){
     this.month =  this.globalService.nepaliMonth
    }
    this.getAllPayrollParameters();
    //assign the month days
    this.assignMonthDays();
    //get department list here and pass the list to child
    this.getDepartmentList();
    this.getShiftList();
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
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
      this.params.page = 1;
    } else {
      const pageNo = event.skip / event.take + 1;
      this.page = pageNo.toString();
      this.params.page = pageNo;
      // this.globalService.setActivePageNumber("payroll",pageNo.toString())

    }
    this.getAllPayrollParameters()

  }
  status:boolean = true;
  // params = {
  //   access_token: this.globalService.getAccessTokenFromCookie,
  //   limit: this.globalService.pagelimit,
  //   page: this.globalService.pageNumber,
  //   sortnane: "",
  //   sortno: 1,
  //   company_id: this.globalService.getCompanyIdFromStorage(),
  //   search: {
  //     date_from: "",
  //     date_to: "",
  //     status: this.status ? "1" : "0",
  //   }
  // }
  params:SearchPayrollParameter = {
    access_token: this.globalService.getAccessTokenFromCookie(),
    limit: Number(this.globalService.pagelimit),
    page: Number(this.globalService.pageNumber),
    sortnane: "title",
    sortno: 0,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      type: ""
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

  selectedPayrollParameter:PayrollParameter

  openAddModal(template: TemplateRef<any>,popupformType:string,dataItem?:PayrollParameter,mode?:string) {
    if(mode){
      this.mode = mode;
    }
    else{
      this.mode = null;
    }
    if(popupformType == "parameter"){
      this.buildParameterForm(dataItem);
      this.modalRef = this.modalService.show(template, this.config);
    }
    else if(popupformType =="assignEmployees"){
      this.selectedPayrollParameter = dataItem
      let config = {
      }
      config = Object.assign({}, {
        class: 'modal-lg-xt',
        ignoreBackdropClick: true, backdrop: true,
      });
      this.buildAssignEmployeesForm();
      this.modalRef = this.modalService.show(template, config);
    }

  }
  modalRef: BsModalRef;
   // modal config to unhide modal when clicked outside
   config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  mode:string;
  //build form here
  parameterForm:FormGroup;
  buildParameterForm(data?:PayrollParameter){
    // if(data){
    //   this.mode = "edit"
    // }
    // else{
    //   this.mode="new"
    // }
    this.parameterForm = this.fb.group({
      parameter_id:[data?data.parameter_id:''],
      title:[{
        value:data ? data.title:'',
        disabled:this.mode && this.mode == "view"
      },Validators.required],
      type:[
       {
         value: data?data.type:'',
         disabled:this.mode && this.mode == "view"
       },
      Validators.required],
      access_token:[this.globalService.getAccessTokenFromCookie()],
      month_day:[{
        value:data?data.month_day:"",
        disabled:this.mode && this.mode == "view"
      }],
      week_day:[
        {
          value:data?data.week_day:"",
          disabled:this.mode && this.mode == "view"
        }
      ],
      select_day:[
        {value:data?data.select_day:"",
        disabled:this.mode && this.mode == "view"}
      ],
      select_month:[
        {value:data?data.select_month:'',
        disabled:this.mode && this.mode == "view"}],
      user_id:[this.globalService.getCurrentUserId()],
      company_id:[this.globalService.getCompanyIdFromStorage()],
      year_day:[{value:data?data.select_day:'',disabled:this.mode && this.mode == "view"}],
      year_month:[{value:data?data.select_month:'',
      disabled:this.mode && this.mode == "view"}]
    })
  }
  parameterValue:Observable<any>;
  currentValue = new Subject();
onSave(){
  if (this.parameterForm.invalid) return;
  // this.parameterValue =
  //  this.currentValue.next(this.parameterForm.value);
if(this.parameterForm.get('type').value == 'monthly' && Number(this.parameterForm.get('month_day').value) > 31){
  this.toasterMessageService.showError("Day cannot be greater than 31");
  return;
}
if(this.parameterForm.get('type').value == 'monthly' && !Number(this.parameterForm.get('month_day').value)){
  this.toasterMessageService.showError("Day cannot be null or 0");
  return;
}

if(this.parameterForm.get('type').value == 'yearly' && !Number(this.parameterForm.get('year_day').value)){
  this.toasterMessageService.showError("Day cannot be null or 0");
  return;
}
if(this.parameterForm.get('type').value == 'weekly' && !Number(this.parameterForm.get('week_day').value)){
  this.toasterMessageService.showError("Day cannot be null or 0");
  return;
}
  if(this.mode =="edit"){
    this.onEditPayrollParameter(this.parameterForm.value)
  }
  else{
    this.onSavePayrollParameter(this.parameterForm.value)
  }
}





assignEmployeesForm:FormGroup;
buildAssignEmployeesForm(){
  this.assignEmployeesForm = this.fb.group({
    users:[]
  })
}
staffList:any[];
onSelectAll(){

}
onCancelAll(){

}


get type(){
  return this.parameterForm.get('type').value

}
weekDays = [
  { day: "Sunday",value:1},
  { day: "Monday",value:2},
  { day: "Tuesday",value:3},
  { day: "Wednesday",value:4},
  { day: "Thrusday",value:5},
  { day: "Friday",value:6},
  { day: "Saturday",value:7},
]
month:any[]=[];
loading:boolean= false;
ngDestroy:Subject<boolean> = new Subject()
// getAllPayrollParameters search
getAllPayrollParameters(){
  this.loading= true;
  this.payrollParameterService.searchParameters(this.params).pipe(
    takeUntil(this.ngDestroy)
  ).subscribe((res:any)=>{

    if(res.status){
      this.gridView = res;
      // console.log("GRIDVIEW",this.gridView)
      this.gridView = {
        total:res.count,
        data:res.data

      }
      this.loading = false;

    }
    else{
      this.loading = false;
    }
  })

}


onSavePayrollParameter(body){
  let bodyObj = body;
  if(this.parameterForm.get('type').value == "yearly"){
    bodyObj.select_month = body.year_month;
    bodyObj.select_day = body.year_day;
  }
  this.payrollParameterService.saveParameters(bodyObj)
 .subscribe((res:any)=>{
    if(res.status){
      this.toasterMessageService.showSuccess(res.response);
      this.getAllPayrollParameters();
      if(this.modalRef){
        this.modalRef.hide();
      }
    }
    else{
      this.toasterMessageService.showError(res.response)
    }

  })

}
onEditPayrollParameter(body){
  let bodyObj = body;
  if(this.parameterForm.get('type').value == "yearly"){
    bodyObj.select_month = body.year_month;
    bodyObj.select_day = body.year_day;
  }
  this.payrollParameterService.editParameters(bodyObj)
 .subscribe((res:any)=>{
    if(res.status){
      this.toasterMessageService.showSuccess(res.response);
      this.getAllPayrollParameters();
      if(this.modalRef){
        this.modalRef.hide();
      }
    }
    else{
      this.toasterMessageService.showError(res.response)
    }

  })
}

onParameterTypeChange(value:string){
  // console.log("value is",value)
  if(!value) return;
  switch(value){
    case "monthly":
      this.parameterForm.patchValue({
        year_day:null,
        year_month:null,
        week_day:null
      }


      )
      break;
      case "weekly":
        this.parameterForm.patchValue({
          year_day:null,
          year_month:null,
          month_day:null
        }
        )
        break;
        case "yearly":
          this.parameterForm.patchValue({
            week_day:null,
            month_day:null
          }
          )
          break;

      default:
        break;

  }

}

//english last day of month
setLastDayOfMonth(month) {
  month = parseInt(month)
  let value;
  switch (month) {
    case 1:
      value = 31;
      break;
    case 2:
      value = 28;
      break;
    case 3:
      value = 31;
      break;
    case 4:
      value = 30;
      break;
    case 5:
      value = 31;
      break;
    case 6:
      value = 30;
      break;
    case 7:
      value = 31;
      break;
    case 8:
      value = 31;
      break;
    case 9:
      value = 30;
      break;
    case 10:
      value = 31;
      break;
    case 11:
      value = 30;
      break;
    case 12:
      value = 31;
      break;
    default:
      value = 30;
      break;
  }
  return value;
}

englishLastDay = this.setLastDayOfMonth(new Date().getMonth()+1);
monthDays:any[];


ngOnDestroy() {
  this.ngDestroy.next(true);
  if (this.modalRef) {
    this.modalRef.hide();
  }
  // you have to reset it or the confirmation will show the input fields to others
  this.globalService.resetConfirmationMethods();
}
assignMonthDays(){
  this.monthDays = [];
  for(let i= 1;i<=this.englishLastDay;i++){
    this.monthDays.push(
      {
        day:i
      }
    )

  }
}
//assignh new days to months
onMonthChange(value:string){
  let day = this.parameterForm.get('year_day').value;
  let month = +value;
  this.englishLastDay = this.setLastDayOfMonth(month);
  if(day > this.englishLastDay){
    this.parameterForm.get('year_day').setValue(null)
  }
  this.assignMonthDays();



}





  //reset the methods so that it doesn't have effects on other component in destroy
  confirmText:string
  setConfirmationDialogMethods(body){
    console.log("this is body",body)
    this.globalService.showConfirmBox.next(true);
    this.globalService.confirmationSubmitDisableStatus.next(true);
    this.globalService.showConfirmationLabel.next("Enter Title");
    this.globalService.confirmInputText.subscribe((res)=>{
      this.confirmText = res;
      this.globalService.confirmationSubmitDisableStatus.next(true);
      if(this.confirmText == body.title.trim()){
        this.globalService.confirmationSubmitDisableStatus.next(false);
      }
      else{
        this.globalService.confirmationSubmitDisableStatus.next(true);
      }
    }

    )
  }

  deleteParameter(param){
    let body = {
      access_token:this.globalService.getAccessTokenFromCookie(),
      parameter_id:param.parameter_id
    }
    this.payrollParameterService.deleteParameter(body).pipe(
      takeUntil(this.ngDestroy)
    ).subscribe((res:CustomResponse)=>{

      if(res.status){
        this.toasterMessageService.showSuccess("Successfully deleted.")
        this.getAllPayrollParameters();
      }
      else{
        this.toasterMessageService.showError("Parameter cannot be deleted.")
      }
    })

  }


  // getDepartment list here
  departmentList:any[]=[]
  getDepartmentList(){
    let body =    {
         access_token: this.globalService.getAccessTokenFromCookie(),
         limit: this.globalService.pagelimit,
         page: 1,
         sortnane: "",
         sortno: 1,
         company_id: this.globalService.getCompanyIdFromStorage(),
         search: {
           department_name: "",
           description: ""
         }
       }


       this.payrollParameterService.getDepartmentList(body).pipe(
         takeUntil(this.ngDestroy)
       ).subscribe((res:CustomResponse)=>{
       if(res.status){
         this.departmentList = res.data
       }
       else{
         this.departmentList = []
       }
       })
     }
shiftList = []
     getShiftList(){
     let body =  {
        access_token: this.globalService.getAccessTokenFromCookie(),
        limit: this.globalService.pagelimit,
        page: 1,
        sortnane: "",
        sortno: 0,
        company_id: 0,
        search: {
          name: "",
          shift_from: "",
          shift_to: "",
          sunday: "",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          late_warn_time: "",
          check_in_restriction: "",
          break_time: ""
        }
      }

      this.payrollParameterService.getShiftList(body).pipe(
        takeUntil(this.ngDestroy)
      ).subscribe((res:CustomResponse)=>{
        if(res.status){
        this.shiftList = res.data

        }
        else{
          this.shiftList = []
        }
      })
     }



}


