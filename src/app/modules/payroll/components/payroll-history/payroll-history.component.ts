import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '@app/shared/services/global/global.service';
import { GridDataResult, RowClassArgs } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { PayrollService } from '../../services/payroll.service';
import { CustomResponse } from '@app/shared/models/custom-response.model';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { PayrollHistory } from './modal/PayrollHistory.modal';
import { CustomNepaliDatePickerSettings } from './../../../../shared/components/custom-nepalidatepicker/modals/customNepaliDatePicker.modal';
import { AdBsDateConvertService } from '@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service';
import { NepaliDatePickerSettings } from './../../../../shared/components/nepali-date-picker/modals/nepalidatepickersettings.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TemplateRef } from '@angular/core';
// import * as toWords from './js/toWords';
// import { NepaliDatePickerComponent } from '@app/shared/components/nepali-date-picker/nepali-date-picker.component';
import { ToastrMessageService } from './../../../../shared/services/toastr-message/toastr-message.service';
import { ConfirmationDialogComponent } from './../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { environment } from "@env/environment";



@Component({
  selector: 'app-payroll-history',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './payroll-history.component.html',
  styleUrls: ['./payroll-history.component.scss']
})
export class PayrollHistoryComponent implements OnInit {
  companyId = this.globalService.getCompanyIdFromStorage();
  modalRef: BsModalRef;
  listLoading: boolean;
  public gridView: GridDataResult;
  limit = this.globalService.pagelimit;
  page = this.globalService.pageNumber;
  sortno = "2";
  sortnane = "";
  search_key = "";
  search_value = "";
  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);
  monthType = this.globalService.englishMonth;
  nepaliMonths = this.globalService.nepaliMonth;
  skip = 0;
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
  nepaliDatePickerSettingsForDateFrom: NepaliDatePickerSettings;
  nepaliDatePickerSettingsForDateTo: NepaliDatePickerSettings;
  constructor(
    private globalService: GlobalService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private adbsdateConvertService: AdBsDateConvertService,
    private modalService: BsModalService,
    private router: Router,
    private toasterMessageService:ToastrMessageService
  ) {
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    //configure the setting by general and userwise preference
    this.configUserDateAndTimeSetting();
    this.initSettings();
  }
  payrollHistoryForm: FormGroup;

  buildPayrollHistoryForm() {
    this.currentNepaliDate = this.adbsdateConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat);
    this.currentNepaliLastDate = this.adbsdateConvertService.getCurrentLastNepalidate(this.datePickerConfig.dateInputFormat);
    this.currentNepaliFirstDayOfMonth = this.adbsdateConvertService.getNepaliFirstDayOfMonth(this.datePickerConfig.dateInputFormat);
    this.currentNepaliLastDayOfMonth = this.adbsdateConvertService.getLastDayOfNepaliMonth(this.datePickerConfig.dateInputFormat)
    let currentNepaliMonth = this.datePickerConfig.dateInputFormat == "YYYY/MM/DD" ?this.currentNepaliLastDayOfMonth.substring(5,7)
    :
    this.currentNepaliLastDayOfMonth.substring(0,2);
    this.disableBefore = this.currentNepaliFirstDayOfMonth
    currentNepaliMonth = currentNepaliMonth < 9 ?currentNepaliMonth.substring(1,2):currentNepaliMonth;
    this.payrollHistoryForm = this.fb.group({
      // Validators.required
      englishDateFrom: ["",],
      englishDateTo: [''],
      month:[this.datePickerFormat == "N"?currentNepaliMonth:""],
      nepaliDateFrom: [this.currentNepaliFirstDayOfMonth ? this.currentNepaliFirstDayOfMonth : ""],
      nepaliDateTo: [this.currentNepaliLastDayOfMonth ? this.currentNepaliLastDayOfMonth : ""]
    })
  }
  // call back function to apply css to row of a kendo for Daily Report.
  public rowCallBack = (context: RowClassArgs, index) => {
    // checking paid
    if (context.dataItem.status == "1") {
      return {
        paid: true,
      };
    } else {
      return {
        unpaid: true,
      };
    }
  };

  staffId;
  staffName: string;
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((data) => {
      // this._dateFrom = data.date_from;
      // this._dateTo = data.date_to;
      this._id = data.id

      this.staff_name = data.staff_name;
      console.log('subscrid here',data)
    })
    this.configureStaff();
    this.buildPayrollHistoryForm();
    this.setUpMethodsSettingWise();
    this.onSearchHistory();
    this.getCurrencyDetail();
    this.getCompanyLogo();
    this.getCompanyInfo();
  }
  setUpMethodsSettingWise() {
    if (this.datePickerFormat == "E") {
      this.getFirstAndLastDayOfMonth(new Date().getMonth() + 1);
    }
    else {
      this.initSettingsForNepaliDatePicker();
      this.changeDate(this.currentNepaliFirstDayOfMonth, "dateFrom");

    }
  }
  currentNepaliDate;
  currentNepaliLastDate;
  currentNepaliLastDayOfMonth;
  currentNepaliFirstDayOfMonth;
  configureStaff() {
    if (this.activatedRoute.snapshot.params['staffId']) {
      this.staffId = this.activatedRoute.snapshot.params['staffId']
      this.params.search.staff_id = this.staffId;
    }
    if (this.activatedRoute.snapshot.params['staff_name']) {
      this.staff_name = this.activatedRoute.snapshot.params['staff_name']
      // this.params.search.staff_id = this.staffId;

    }
  }
  activeFlatType:any ='flat';
  isFlat;
  onFlatChange(value){
    this.activeFlatType = value;
  }

  datePickerConfig: any;
  datePickerConfigForTo: any;
  dataStateChange(event): void {
    // console.log(event);
    // sorting logic ends here..
    this.skip = event.skip;
    if (event.skip == 0) {
      this.page = "1";
    } else {
      const pageNo = event.skip / event.take + 1;
      this.page = pageNo.toString();
    }
    this.params.page = this.page;
    this.onSearchHistory();
  }
  submitted = false;
  onViewClicked() {
    this.submitted = true;
    this.onSearchHistory();
  }
  params = {
    access_token: this.globalService.getAccessTokenFromCookie,
    limit: this.globalService.pagelimit,
    page: this.globalService.pageNumber,
    sortnane: "start_date",
    sortno: 1,
    company_id: this.globalService.getCompanyIdFromStorage(),
    search: {
      staff_id: "",
      date_from: "",
      date_to: ""
    }
  }


  historyList: PayrollHistory[];
  onSearchHistory() {
    if (this.payrollHistoryForm.invalid) { return }
    if (this.datePickerFormat == 'E') {
      this.params.search.date_from = this.globalService.transformFromDatepicker(this.payrollHistoryForm.get('englishDateFrom').value);
      this.params.search.date_to = this.globalService.transformFromDatepicker(this.payrollHistoryForm.get('englishDateTo').value)
    }
    if (this.datePickerFormat == 'N') {
      this.params.search.date_from = this.adbsdateConvertService.transformDateForAPI(this.payrollHistoryForm.get("nepaliDateFrom").value, this.datePickerConfig.dateInputFormat);
      this.params.search.date_to = this.adbsdateConvertService.transformDateForAPI(this.payrollHistoryForm.get("nepaliDateTo").value, this.datePickerConfig.dateInputFormat)
    }
    // this.params.search.date_from = firstDate;
    // this.params.search.date_to = lastDate;
    this.listLoading = true;
    this.params.search.staff_id = this.staffId;
    this.payrollService.onSearchHistory(this.params).subscribe((res: CustomResponse) => {
      if (res.status) {
        this.historyList = res.data;
        if (res.data) {
          this.staffName = res.data[0].first_name + " " + res.data[0].middle_name + " " + res.data[0].last_name
        }
        this.gridView = {
          data: this.historyList,
          total: res.count
        }
        this.listLoading = false;

      }
      else {
        this.historyList = [];
        this.gridView = {
          data: [],
          total: 0
        }
        this.listLoading = false;
      }
    })
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
    // if (!this.dateFormatSetting || !this.dateFormatSetting.value ) {
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
    // }
    //if user has userpreference
    // else {
      // this.datePickerConfig = Object.assign(
      //   {},
      //   {
      //     containerClass: "theme-dark-blue",
      //     showWeekNumbers: false,
      //     adaptivePosition: true,
      //     dateInputFormat: this.dateFormatSetting &&
      //       this.dateFormatSetting.value == "yyyy/mm/dd"
      //       ? "YYYY/MM/DD"
      //       : "MM/DD/YYYY",
      //   }
      // );
      // this.datePickerConfigForTo = Object.assign(
      //   {},
      //   {
      //     containerClass: "theme-dark-blue",
      //     showWeekNumbers: false,
      //     // minMode: 'year',
      //     adaptivePosition: true,
      //     dateInputFormat: this.dateFormatSetting &&
      //       this.dateFormatSetting.value == "yyyy/mm/dd"
      //       ? "YYYY/MM/DD"
      //       : "MM/DD/YYYY",
      //   }
      // );
    // }
  }
  onDateFromChange(value) {

    this.datePickerConfigForTo.minDate = new Date(value);
    this.payrollHistoryForm.get("month").setValue(new Date(value).getMonth() + 1);
    if (this.globalService.transformForDatepickerPreview(new Date(value), this.datePickerConfig.dateInputFormat) > this.payrollHistoryForm.get("englishDateTo").value) {
      let dateTo = new Date(value).getFullYear();
      let month = new Date(value).getMonth();
      let englishLastDayOfMonth =
        this.globalService.transformForDatepickerPreview(
          new Date(dateTo, month, this.setLastDateOfEnglishMonth(month + 1)),
          this.datePickerConfigForTo.dateInputFormat
        );
      this.payrollHistoryForm.get("englishDateTo").setValue(englishLastDayOfMonth)
      return;
    }
  }
  setLastDateOfEnglishMonth(month) {
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
  dateFrom = String(new Date().getFullYear());
  dateTo = String(new Date().getFullYear() + 1);
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
  customNepaliDatePickerSettingForDateFrom: CustomNepaliDatePickerSettings;
  customNepaliDatePickerSettingForDateTo: CustomNepaliDatePickerSettings;
  initSettingsForNepaliDatePicker() {
    this.patchValueToTheForm();
    if (this.datePickerFormat !== "N") {
      return;
    }
    this.setValidators();
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
      disableBefore: this.currentNepaliFirstDayOfMonth ? this.currentNepaliFirstDayOfMonth :null,
      ndpMonth: true,
    }
  }
  setValidators() {
    if (this.datePickerFormat == "N") {
      this.payrollHistoryForm.get('nepaliDateFrom').setValidators(Validators.required);
      this.payrollHistoryForm.get('nepaliDateTo').setValidators(Validators.required);
      this.payrollHistoryForm.get('englishDateFrom').clearValidators();
      this.payrollHistoryForm.get('englishDateTo').clearValidators();
    }
  }
  patchValueToTheForm() {
    if (this.datePickerFormat == 'E') {
      this.payrollHistoryForm.get('englishDateFrom').setValue(
        this.globalService.transformForDatepickerPreview(
          new Date(
            new Date().getFullYear(), new Date().getMonth(), 1
          )
          , this.datePickerConfig.dateInputFormat
        )
      );
      this.payrollHistoryForm.get('englishDateTo').setValue(
        this.globalService.transformForDatepickerPreview(
          new Date(new Date().getFullYear(), new Date().getMonth(), 30)
          , this.datePickerConfig.dateInputFormat
        )
      );
    }

  }
  ngAfterViewChecked() {
    //your code to update the model
    this.cdr.detectChanges();
  }
  _dateFrom: string;
  _dateTo: string;
  _id: number;
  staff_name;
  disableBefore
  changeDate(value, type) {
    if (type == "dateFrom") {
      // this.nepaliDatePickerSettingsForDateTo.disableBefore = this.adbsdateConvertService.transformDateForAPI(
      //   value, this.datePickerConfig.dateInputFormat
      // );

      this.disableBefore = value;
      let dateToValue = this.payrollHistoryForm.get("nepaliDateTo").value;
      if (dateToValue && dateToValue < value) {
        this.payrollHistoryForm.get("nepaliDateTo").setValue("");
      }

      let currentNepaliMonth = this.datePickerConfig.dateInputFormat == "YYYY/MM/DD" ? value.substring(5, 7)
        :
        value.substring(0, 2);
      currentNepaliMonth = currentNepaliMonth < 9 ? currentNepaliMonth.substring(1, 2) : currentNepaliMonth;
      console.log("current nepali month",currentNepaliMonth)
      if(currentNepaliMonth && currentNepaliMonth[0]=='0'){
        currentNepaliMonth = currentNepaliMonth[1];
      }
      this.payrollHistoryForm.get("month").setValue(currentNepaliMonth);
    }
    // this.disableBefore = value;
    // this.payrollHistoryForm.get('nepaliDateTo').setValue('');
  }


  // modalRef: BsModalRef;
  selectedPaySlip;
  summaryMoney:string;
  selectedFundArray:any ;
  currencyObj  = this.globalService.getCurrencyFromSetting();
  onOpenView(template: TemplateRef<any>, data) {
    if(data.fund !== "Array"){
      this.selectedFundArray = eval(data.fund);
    }
    else{
      this.selectedFundArray = []
    }

    this.selectedPaySlip = data;
    let config = {
    }
    config = Object.assign({}, {
    // modal-lg-preview
      // class: 'modal-lg-xt',
      class:'modal-lg-preview',
      ignoreBackdropClick: true, backdrop: true,
    });
    this.summaryMoney = this.globalService.inWords(data.gross_salary);
    this.modalRef = this.modalService.show(template, config);
  }
  onHideViewModal() {
    this.modalRef.hide();
  }
  currencyDetail:any;
  getCurrencyDetail(){
    // console.log("this.currencyObj",this.currencyObj);
    this.payrollService.getCurrencyDetail(this.currencyObj.value).subscribe((data:CustomResponse)=>{
      if(data.status){
        this.currencyDetail = data.data[0];
        this.globalService.currencyDetail = this.currencyDetail;
      }
      else{
        this.globalService.currencyDetail = "";
      }
    })
  }
  onViewPaySlipDetail(data) {
    this.router.navigate(["/payroll/monthly/payroll-detail", data.payslip_id, {}],)
  }

  // @ViewChild("nepaliFrom",{static:false})nepaliFrom:NepaliDatePickerComponent;
  // @ViewChild("nepalito",{static:false})nepaliTo:NepaliDatePickerComponent
  // checkPicker(){
  //   alert(this.nepaliFrom === this.nepaliTo);
  // }
  yearFrom;
  selectedMonth
  getFirstAndLastDayOfMonth(value) {
    this.yearFrom = new Date().getFullYear();
    this.selectedMonth = value;
    this.dateFrom = this.yearFrom;

    //console.log("CALLED BELOW HERE")
    let englishFirstDayOfMonth =
      this.globalService.transformForDatepickerPreview(
        new Date(this.yearFrom, value - 1, 1),
        this.datePickerConfig.dateInputFormat
      );
    // this.dateFrom = englishFirstDayOfMonth;
    let englishLastDayOfMonth =
      this.globalService.transformForDatepickerPreview(
        new Date(this.yearFrom, value,
          0),
        this.datePickerConfig.dateInputFormat
      );
    this.payrollHistoryForm.get('englishDateFrom').setValue(englishFirstDayOfMonth);
    this.payrollHistoryForm.get("englishDateTo").setValue(englishLastDayOfMonth);
    this.payrollHistoryForm.get("month").setValue(value);
  }
  onNepaliMonthChange(value) {
    // console.log(value)
    if (this.datePickerConfig.dateInputFormat == "YYYY/MM/DD") {
      let year = this.payrollHistoryForm.get("nepaliDateFrom").value.substring(0, 4);
      value = value.length == 1 ? "0" + value : value;
      this.payrollHistoryForm.get("nepaliDateFrom").setValue(
        `${year}/${value}/01`
      )
      this.payrollHistoryForm.get("nepaliDateTo").setValue(
        `${year}/${value}/${this.setNepaliDateFromAndTo(value)}`
      )
      this.disableBefore = `${year}/${value}/${this.setNepaliDateFromAndTo(value)}`;

    }
    else {
      let year = this.payrollHistoryForm.get("nepaliDateFrom").value.substring(6, 10);
      value = value.length == 1 ? "0" + value : value;
      this.payrollHistoryForm.get("nepaliDateFrom").setValue(
        `${value}/01/${year}`
      )

      this.payrollHistoryForm.get("nepaliDateTo").setValue(
        `${value}/${this.setNepaliDateFromAndTo(value)}/${year}`
      )
      this.disableBefore = `${value}/${this.setNepaliDateFromAndTo(value)}/${year}`;

    }

  }
  setNepaliDateFromAndTo(month) {
    month = parseInt(month);
    // month = parseInt(month)
    let value;
    switch (month) {
      case 1:
        value = 31;
        break;
      case 2:
        value = 31;
        break;
      case 3:
        value = 31;
        break;
      case 4:
        value = 32;
        break;
      case 5:
        value = 31;
        break;
      case 6:
        value = 31;
        break;
      case 7:
        value = 30;
        break;
      case 8:
        value = 29;
        break;
      case 9:
        value = 30;
        break;
      case 10:
        value = 29;
        break;
      case 11:
        value = 30;
        break;
      case 12:
        value = 30;
        break;
      default:
        value = 30;
        break;
    }
    return value;



  }
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  onPayConfirmation(paySlip, isPost?: boolean) {
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = paySlip.first_name;
    this.modalRef.content.action = "Pay";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {

        let bodyObj = {
          access_token: this.globalService.getAccessTokenFromCookie(),
          staff_id: paySlip.staff_id,
          date_from: paySlip.start_date,
          date_to: paySlip.end_date,
          bonus_advance: paySlip.bonus_advance,
          status: 1,
          company_id: this.companyId,
          id:paySlip.payslip_id
        }
        // if (this.type == 'non-yearly') {
        //   bodyObj.date_from = this.globalService.transformFromDatepicker(this.nonyearlyDateFrom),
        //     bodyObj.date_to = this.globalService.transformFromDatepicker(this.nonYearlyDateTo)
        // }

          this.onPaidClicked(bodyObj, isPost);


      }
    });

  }
  onPaidClicked(bodyObj, isPost?: boolean) {
    this.payrollService.onEditPayment(bodyObj).subscribe((res: any) => {
      if (res.status) {
        this.toasterMessageService.showSuccess("Payment saved succesfully");
        this.onViewClicked();
      }
      else {
        this.toasterMessageService.showError("Payment  cannot be saved");
      }
    })
  }

  selectedAdvanced;
  advancedTitle: string = "add";
  onOpenAdvancedModal(template: TemplateRef<any>, data, type) {
    this.selectedAdvanced = data;
    this.advancedTitle = type;
    this.buildAdvancedForm();
    this.totalAmt = 0;
    let config = {
    }
    config = Object.assign({}, {
      // class: 'modal-lg',
      class:'modal-lg-xt',
      ignoreBackdropClick: true, backdrop: true,
    });

    if (this.advancedTitle == 'add') {
      this.addAdvancedFormArray(true);
    }
    else {
      this.addAdvancedFormArray(false)
    }
    this.getPaySlipPayOrDeductDetail(type)

    this.modalRef = this.modalService.show(template, config);

  }
  onHideAdvancedModal() {
    this.modalRef.hide();
  }
  advancedForm: FormGroup;
  buildAdvancedForm() {
    this.advancedForm = this.fb.group({
      advancedFormArray: this.fb.array([]),
    });
  }
  totalAmt: number = 0;
  addAdvancedFormArray(isRemove?: boolean, value?: any,type?:any) {
    const addBreak = this.advancedForm.get("advancedFormArray") as FormArray;
    addBreak.push(this.addAdvancedFormGroup(isRemove, value,type));
  }
  addAdvancedFormGroup(isRemove?: boolean, value?: any,type?:any) {
    console.log("Deduct",type);
    return this.fb.group({
      id: [value ? value.add_deduct_id : ''],
      is_remove: [],
      type: [isRemove ? 1 : 0],
      amount: [
        type&&type == 'deduct'?(value.amount_deduct) :( value ? value.amount : ''),
        Validators.required],
      title: [value ? value.title : '', Validators.required],
      details: [
        value ? value.details : ''
      ],
      isFlat:["flat"],
      addType:["additional"],
      amount_percent:['0']
    });
  }
  removeAdvanced(index, advancedSlip,type): void {
    if (advancedSlip.value.id) {
      this.openDeleteConfirm(advancedSlip.value, index,type);
    }
    else {
      (<FormArray>this.advancedForm.get("advancedFormArray")).removeAt(index);
      this.onAmountChange();
    }
    // this.removeBreak.push({ is_remove: "1", id: breakList.get("id").value });
  }
  confirmRef: BsModalRef;
  openDeleteConfirm(advancedSlip,index,type) {
    this.confirmRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    let body = {
      id:  advancedSlip.id,
      is_remove: 1,
      type: type=='add'?1:0,
      amount: advancedSlip.amount,
      title: advancedSlip.title,
      details:  advancedSlip.details
    }
    let bodyObj  =  {
      access_token: this.globalService.getAccessTokenFromCookie(),
      company_id: this.globalService.getCompanyIdFromStorage(),
      payslip_id: this.selectedAdvanced.payslip_id,
      paydata: [body]
    }


    this.confirmRef.content.data = advancedSlip.title;
    this.confirmRef.content.action = "delete";
    this.confirmRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.onRemovePayOrDeduct(bodyObj,index);
      }
    });
  }
  onMultipleAdvanceSave() {
    if (this.advancedForm.invalid) {
      return }
    const body = this.advancedForm.get("advancedFormArray").value;
    console.log('savePressed',
      body
    )
    let bodyObj = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      company_id: this.globalService.getCompanyIdFromStorage(),
      payslip_id: this.selectedAdvanced.payslip_id,
      paydata: body
    }
    this.saving = true;
    this.payrollService.editMultipleAdvance(bodyObj).subscribe((data: CustomResponse) => {
      if (data.status) {
        this.toasterMessageService.showSuccess("Successfully updated");
        this.modalRef.hide();
        this.saving = false;
        this.onViewClicked();
      }
      else {
        this.toasterMessageService.showError("Cannot update the payslip.")
      }
    })
  }
  totalAddition:number = 0;
  totalDeduction:number = 0;
  saving:boolean = false;
  onAmountChange() {
    const formArr: any[] = this.advancedForm.get("advancedFormArray").value;
    console.log("this", formArr)
    // this.totalAmt = 0;
    this.totalAddition = 0;
    this.totalDeduction = 0;
    // this.totalDeduction = this.totalDeduction;
    if (formArr.length > 0) {
      this.totalAmt = Number(this.selectedAdvanced.working_salary);
      formArr.forEach(x => {
        if (x.addType == 'additional') {
          // console.log("added value",Number(x.amount))
          // console.log("this is totalAMt",this.totalAmt);


          x.amount ? (this.totalAmt = this.totalAmt + Number(x.amount)) :
            this.totalAmt = this.totalAmt + 0;
          // console.log("numbering",Number(this.totalAmt));
          // this.totalAmt = Number(this.totalAmt)
          this.totalAddition = this.totalAddition + Number(x.amount);
          this.totalAddition = Number(this.totalAddition)
        }
        else if (x.addType == "deduction") {
          Number(x.amount) ? this.totalAmt = this.totalAmt - Number(x.amount) :
            this.totalAmt = this.totalAmt - 0;
          // this.totalAmt = Number(this.totalAmt);
          this.totalDeduction = this.totalDeduction + Number(x.amount);
          this.totalDeduction = Number(this.totalDeduction)
        }
        // calculate with fund
        if (x.id == "fund"){
          console.log("x is fund",x.fund_amount)
          this.totalAmt = this.totalAmt - x.fund_amount;
          this.totalDeduction =this.totalDeduction + x.fund_amount
        }

      })
      // this.totalAmt = this.totalAmt + this.totalAddition - this.totalDeduction;
    }
    else {
      this.totalAmt = 0;
    }
  }
  getPaySlipPayOrDeductDetail(type) {
    const Type = type == 'add'?1:0;
    this.payrollService.getPaySlipAddDeduct(this.selectedAdvanced.payslip_id,Type).subscribe((res: CustomResponse) => {
      if (res.status) {
        console.log("status", res);
        this.buildAdvancedForm();
        res.data.forEach(x => {
          (type == 'add' ?
            this.addAdvancedFormArray(true, x)
            :
            this.addAdvancedFormArray(false, x,'deduct')
          )
        })
        // this.onAmountChange();
      }
      else {

      }
    }, err => {

    }, () => {

      this.onAmountChange();
    }
    )
  }
  onRemovePayOrDeduct(body,index){
    this.payrollService.editMultipleAdvance(body).subscribe((res:CustomResponse)=>{
      if(res.status){
        this.toasterMessageService.showSuccess("Sucessfully deleted payslip additional");
        (<FormArray>this.advancedForm.get("advancedFormArray")).removeAt(index);
        this.onViewClicked();
        this.onAmountChange()
      }
      else{
        this.toasterMessageService.showError(
          "Cannot delete additional"
        );
      }
    })
  }

  companyLogoObj:any;
  imageUrl = environment.baseImageUrl;
  getCompanyLogo(){
    this.payrollService.getCompanyLogo(
      this.globalService.getCompanyIdFromStorage()
    ).subscribe((res:any)=>{

        this.companyLogoObj = res;

    })
  }
  companyInfo:any;
  getCompanyInfo(){
    this.payrollService.getCompanyInfo(this.globalService.getCompanyIdFromStorage()).subscribe((res:any)=>{
      console.log("res is respsn",res);
      if(res.status){
        this.companyInfo= res.data?res.data:"";
        console.log("this is coas",this.companyInfo)
      }
    })
  }
  percent:number = 0;
  amount:number = 0;
  recalculateAmount(index,data,type,event:KeyboardEvent,value){
    // console.log("value",value)
    console.log("type",type);
    // console.log("event event",event)

    // if(!event.code.startsWith("D")){
    //   event.preventDefault();
    //   return;
    // }
    // console.log("[assed")

    // return;
    // console.log("typeadasdasd",type)
    // console.log("log",index);
    // console.log("data",data.value);
    this.percent = 0;
    this.amount  = 0;
    console.log("type",type);
    // (<FormArray>this.advancedForm.get("advancedFormArray")).at(index).get("amount_percent").setValue(data.value.amount_percent);
   switch(type){
     case "percentage":
      let percentage = Number(value);
      // console.log("percentty",typeof(percentage));
      // console.log('percent',percentage);
      // console.log("receiveing data",data);
      // (<FormArray>this.advancedForm.get("advancedFormArray")).at(index).get("amount_percent").setValue(data.value.amount_percent);
      // console.log("percentage babu",data.value.amount_percent)
      // console.log("realted fb",  (<FormArray>this.advancedForm.get("advancedFormArray")).at(index));
      (<FormArray>this.advancedForm.get("advancedFormArray")).at(index).get("amount").patchValue(
        ((percentage/100)*this.selectedAdvanced.working_salary).toFixed(2)
      );
      // console.log("working slaayr",this.selectedAdvanced.working_salary)
      // console.log("Percentage amt",(percentage/100)*this.selectedAdvanced.working_salary)
      break;
      case "amount":
        (<FormArray>this.advancedForm.get("advancedFormArray")).at(index).get("amount_percent").patchValue(
          ((data.value.amount/this.selectedAdvanced.working_salary)*100).toFixed(2)
          )
          break;
       default:
         break;

   }

   this.onAmountChange();

  }


  patchFunds(data){
    if(!data) return;
    if(data.total_tax){
      let totalTaxObj ={
        title:"Tax",
        percent_deducted_amount:Number(data.total_tax),
        fund_percent:null
      }
      this.addFundsArray(totalTaxObj);
    }
    if (data.fund !== "Array" && data.fund) {
      console.log("eval", eval(data.fund));
      let deductionsArray = eval(data.fund);
      if (deductionsArray) {
        this.totalDeduction = 0;
        deductionsArray.forEach(x => {
          this.addFundsArray(x);
          // this.totalDeduction = this.totalDeduction + x.percent_deducted_amount;
        })
      }

    }

  }


  addFundsArray(data) {
    const addBreak = this.advancedForm.get("advancedFormArray") as FormArray;
    let fb = this.addFundFormGroup(data);
    addBreak.push(fb);
  }

  addFundFormGroup(value): FormGroup {
    //set id for fund to hide in template the delete button
    return this.fb.group({
      id: ["fund"],
      is_remove: [],
      type: [],
      fund_amount:[value.percent_deducted_amount],
      amount: [
        {
          value: value ? value.percent_deducted_amount : '',
          disabled: true
        },
        Validators.required],
      title: [
        {
          value: value ? value.title : "",
          disabled: true,
        },
        Validators.required,
      ],
      details: [
        {
          value: "",
          disabled: true
        }
      ],
      isFlat: ["flat"],
      addType: [
        {
          value: "deduction",
          disabled: true
        }],
      percentage: [{
        value: value ? value.fund_percent : '',
        disabled: true
      }]
    });
  }






}
