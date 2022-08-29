import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridDataResult, RowClassArgs } from '@progress/kendo-angular-grid';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GlobalService } from '@app/shared/services/global/global.service';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { CustomResponse } from './../../../../shared/models/custom-response.model';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { ShiftList } from '@app/modules/utilities/shift/modal/shiftList.modal';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { PayrollService } from '../../services/payroll.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { NepaliDatePickerSettings } from './../../../../shared/components/nepali-date-picker/modals/nepalidatepickersettings.interface';
import { AdBsDateConvertService } from '@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service';
import { RegexConst } from './../../../../shared/constants/regex.constant';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { environment } from "@env/environment";
import { PdfDownloadComponent } from '../pdf-download/pdf-download.component';




@Component({
  selector: 'app-monthly-payroll',
  // encapsulation is required for rowCallBack function.
  encapsulation: ViewEncapsulation.None,
  templateUrl: './monthly-payroll.component.html',
  styleUrls: ['./monthly-payroll.component.scss']
})
export class MonthlyPayrollComponent implements OnInit {
  payrollForm: FormGroup;
  searchForm: FormGroup;
  selectedPayroll: any;
  modalRef: BsModalRef;
  submitted: boolean;
  editMode: boolean;
  paginationMode = true;
  advanceForm: FormGroup;

  submitButton: string;
  modalTitle: string;
  companyId = this.globalService.getCompanyIdFromStorage();
  listLoading: boolean;
  public gridView: GridDataResult;
  public gridViewForSearch: GridDataResult;
  skip = 0;
  currentDate: Date = new Date();
  monthType = this.globalService.englishMonth;
  nepaliMonths = this.globalService.nepaliMonth;
  dateFormatSetting: any;
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private toasterMessageService: ToastrMessageService,
    private localStorageService: LocalStorageService,
    private payrollService: PayrollService,
    private router: Router,
    private adbsdateConvertService: AdBsDateConvertService,
    private activatedRoute:ActivatedRoute
  ) {
    this.dateFormatSetting =
      this.globalService.getUserPreferenceSetting("UP_DATE_FORMAT");
    //configure the setting by general and userwise preference
    this.configUserDateAndTimeSetting();
    this.initSettings();
    // this.configUserDateSetting();
    // console.log()
    // this.activatedRoute.queryParams.subscribe((res)=>{
    //   console.log(res)
    //   if(res){
    //     this.page = res.page;
    //     console.log("this is page",this.page)
    //     this.params.page = String(this.page);
    //   }
    // })
  }
  buildSearchForm() {
    this.searchForm = this.fb.group({
      dateFrom: ["", [Validators.required]],
      dateTo: ["", [Validators.required]]
    })
  }
  buildPayrollForm() {
    this.payrollForm = this.fb.group({
      dateFrom: ["", [Validators.required]],
      dateTo: ["", [Validators.required]]
    })
  }
  buildAdvanceForm() {
    this.advanceForm = this.fb.group({
      dateFrom: ["", [Validators.required]],
      dateTo: ["", [Validators.required]],
      amount: ['', Validators.required],
      status: ['', Validators.required]
    })
  }
  onAdvanceSave() {
    if (this.advanceForm.invalid) { return }

  }
  buildNepaliDateForm() {

    let currentNepaliMonth = this.datePickerConfig.dateInputFormat == "YYYY/MM/DD" ? this.currentNepaliLastDayOfMonth.substring(5, 7)
      :
      this.currentNepaliLastDayOfMonth.substring(0, 2);
    currentNepaliMonth = currentNepaliMonth < 9 ? currentNepaliMonth.substring(1, 2) : currentNepaliMonth;

    this.nepaliDateForm = this.fb.group({
      month: [currentNepaliMonth],
      nepaliDateFrom: [this.currentNepaliFirstDayOfMonth ? this.currentNepaliFirstDayOfMonth : "", [Validators.required]],
      nepaliDateTo: [this.currentNepaliLastDayOfMonth ? this.currentNepaliLastDayOfMonth : "", [Validators.required]]
    })
  }


  currentMonth;
  ngOnInit() {
    this.getCompanyInfo();
    this.buildStaffSearchForm();
    this.getEmployeeTypeList();
    this.getdepartmentList();
    this.getDesignationList();
    this.setUpMethods();
    this.getStaffList();
    this.getCurrencyDetail();

    this.onViewClicked();
    this.getCompanyLogo();

    // this.yearFrom = this.globalService.transformForDatepickerPreview(new Date(),"YYYY");
  }
  currentNepaliDate;
  currentNepaliLastDate;
  currentNepaliFirstDayOfMonth;
  currentNepaliLastDayOfMonth;
  setUpMethods() {
    if (this.datePickerFormat == 'N') {
      this.currentNepaliDate = this.adbsdateConvertService.getCurrentNepaliDate(this.datePickerConfig.dateInputFormat);
      this.currentNepaliLastDate = this.adbsdateConvertService.getCurrentLastNepalidate(this.datePickerConfig.dateInputFormat);
      this.currentNepaliFirstDayOfMonth = this.adbsdateConvertService.getNepaliFirstDayOfMonth(this.datePickerConfig.dateInputFormat);
      this.currentNepaliLastDayOfMonth = this.adbsdateConvertService.getLastDayOfNepaliMonth(this.datePickerConfig.dateInputFormat)
      this.disableBefore = this.currentNepaliFirstDayOfMonth
      this.initSettingsForDatepicker();
      this.buildNepaliDateForm();
      this.changeDate(this.currentNepaliFirstDayOfMonth, "dateFrom");
    }
    else if (this.datePickerFormat == "E") {
      this.currentMonth = new Date().getMonth() + 1;
      this.onYearChange(new Date())
      this.getFirstAndLastDayOfMonth(new Date().getMonth() + 1);
      this.initDates();
    }
  }
  status: boolean = false;
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
  nepaliDateForm: FormGroup;
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
      disableBefore: this.currentNepaliFirstDayOfMonth,
      ndpMonth: true,
    }
  }

  changeDate(value, type) {
    if (type == "dateFrom") {
      this.disableBefore = value;
      let dateToValue = this.nepaliDateForm.get("nepaliDateTo").value;
      if (dateToValue && dateToValue < value) {
        this.nepaliDateForm.get("nepaliDateTo").setValue("");
      }
      if (value > this.currentNepaliLastDayOfMonth) {
        this.isGenerate = true;
        this.isGenerateDisabled = true;
      }
      else {
        this.isGenerateDisabled = false;
        this.isGenerate = false;
      }
      if (this.inRange(
        value,
        this.currentNepaliFirstDayOfMonth,
        this.currentNepaliLastDayOfMonth)) {
        this.isGenerate = true;
        this.isGenerateDisabled = false;
      };
      let currentNepaliMonth = this.datePickerConfig.dateInputFormat == "YYYY/MM/DD" ? value.substring(5, 7)
        :
        value.substring(0, 2);
      currentNepaliMonth = currentNepaliMonth < 9 ? currentNepaliMonth.substring(1, 2) : currentNepaliMonth;
      this.nepaliDateForm.get("month").setValue(currentNepaliMonth);
      // if(this.datePickerConfig.dateInputFormat == "YYYY/MM/DD"){
      //   console.log("Jestha",value)
      // }
      // else{
      //   console.log("Jestha2",value)

      // }
    }
  }
  onViewClicked() {
    if (this.datePickerFormat == "E") {
      this.params.search.date_from = this.globalService.transformFromDatepicker(this.nonyearlyDateFrom);
      this.params.search.date_to = this.globalService.transformFromDatepicker(this.nonYearlyDateTo);
    }
    if (this.datePickerFormat == "N") {
      this.params.sortnane = "payslip_id";
      this.params.search.date_from = this.adbsdateConvertService.transformDateForAPI(this.nepaliDateForm.get("nepaliDateFrom").value, this.datePickerConfig.dateInputFormat);
      this.params.search.date_to = this.adbsdateConvertService.transformDateForAPI(this.nepaliDateForm.get("nepaliDateTo").value, this.datePickerConfig.dateInputFormat);
    }
    if (!this.params.search.date_to || this.params.search.date_to.split("-").includes("NaN")) {
      return;
    }
    this.params.search.status = this.status ? "1" : "0";
    // this.params.page = this.page.toString()
    this.listLoading = true;
    this.payrollService.onSearchPayRoll(this.params).subscribe((data: CustomResponse) => {
      if (data.status) {
        this.listLoading = false;
        this.gridView = { data: data.data, total: data.count ? data.count : data.data.length };

      }
      else {
        this.listLoading = false;
        this.gridView = {
          data: [],
          total: 0
        }
      }
    }, (err) => {
      this.listLoading = false;
    },
      () => {
        this.listLoading = false;
      })
  }
  onStatusChange() {
    this.onViewClicked();
  }





  limit = this.globalService.pagelimit;
  page = this.globalService.getActivePageNumber("payroll")?
  this.globalService.getActivePageNumber("payroll"):
  this.globalService.pageNumber;
  sortno = "2";
  sortnane = "";
  search_key = "";
  search_value = "";
  // converting limit to string to use in template...
  pageLimit = parseInt(this.limit);




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



  //change queryparams of router
  changeQueryParams(){
    this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: {
page:this.page
    }});
  }

  onPageChange(value){
    console.log(value);
    // this.
  }

  onSearchdataStateChange(event) {
    // sorting logic ends here..
    this.skip = event.skip;
    if (event.skip == 0) {
      this.page = "1";
    } else {
      const pageNo = event.skip / event.take + 1;
      this.page = pageNo.toString();
      this.globalService.setActivePageNumber("payroll",pageNo.toString())
    }
    if (this.isGenerate) {
      this.onGenerateClicked()
    }
    else {
      this.params.page = this.page;
      this.onViewClicked();
    }
    // this.changeQueryParams();
  }

  dataStateChange(event): void {
    // console.log(event);
    if (event.sort[0]) {
      this.sort = event.sort;
      if (event.sort[0].dir === "asc") {
        this.sortno = "2";
      } else {
        this.sortno = "1";
      }
      this.sortnane = event.sort[0].field;
    }

    // sorting logic ends here..
    this.skip = event.skip;
    if (event.skip == 0) {
      this.page = "1";
    } else {
      const pageNo = event.skip / event.take + 1;
      this.page = pageNo.toString();
    }

    // pagination logic ends here
    if (event.filter) {
      if (event.filter.filters[0]) {
        // search api call

        const searchTerm = event.filter.filters[0].value;
        const searchField = event.filter.filters[0].field;
        this.search_value = searchTerm;
        this.search_key = searchField;
      } else {
        // normal api call

        this.search_value = "";
        this.search_key = "";
      }
    }
    // search logic ends here

  }

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  openAddModal(template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = false;
    this.submitButton = "Create";
    this.modalTitle = "Add Shift";
    this.selectedPayroll = null;


    this.modalRef = this.modalService.show(template, this.config);
  }


  openEditBonusAdvance(template: TemplateRef<any>, data): void {
    this.submitted = false;
    // this.editMode = false;
    // this.selectedPayroll = null;
    this.buildPayrollForm();
    this.modalRef = this.modalService.show(template, this.config);
  }


  // edit modal
  openEditModel(shift: ShiftList, template: TemplateRef<any>): void {
    this.submitted = false;
    this.editMode = true;
    this.submitButton = "Update";
    this.modalTitle = "Edit Shift";
    this.selectedPayroll = shift;
    this.modalRef = this.modalService.show(template, this.config);
  }

  onReset() {
    this.gridView = {
      data: [],
      total: 0
    }
  }
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

  timeFormat;
  datePickerConfig: any;
  datePickerConfigForTo: any;

  dateFrom: any;
  dateTo: any
  setDateTo(event) {
    this.onDateFromChange(event);
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
  onDateFromChange(value) {
    this.datePickerConfigForTo.minDate = new Date(value);
    let dateTo = new Date(value).getFullYear();
    let month = new Date(value).getMonth();
    this.currentMonth = month + 1;
    let englishLastDayOfMonth =
      this.globalService.transformForDatepickerPreview(
        new Date(dateTo, month, this.setLastDayOfMonth(month + 1)),
        this.datePickerConfigForTo.dateInputFormat
      );
    this.nonYearlyDateTo = englishLastDayOfMonth;
    let date = this.globalService.transformFromDatepicker(
      new Date(dateTo, month, 30)
    )
    let convertedDate = this.globalService.transformFromDatepicker(value);
    if ((new Date().getFullYear() == dateTo && String(new Date().getMonth() + 1) == String(month + 1))
      || date > this.currentFullDate
    )
    //  ||
    //  (new Date().getFullYear() == dateTo && String(new Date().getMonth()) == String(parseInt(this.currentMonth))
    // )
    {
      this.isGenerate = true;

      if (convertedDate > this.currentFullDate) {
        this.isGenerateDisabled = true;
      }
      else {

        this.isGenerateDisabled = false;
      }

    }
    else {

      this.isGenerate = false;
    }
  }



  onDateToChange(value) {
    let dateTo = new Date(value).getFullYear();
    let month = new Date(value).getMonth();
    this.currentMonth = month + 1;
    let date = this.globalService.transformFromDatepicker(
      new Date(dateTo)
    )
    let convertedDate = this.globalService.transformFromDatepicker(value);
    if ((new Date().getFullYear() == dateTo && String(new Date().getMonth() + 1) == String(month))
      || date > this.currentFullDate ||
      (new Date().getFullYear() == dateTo && String(new Date().getMonth()) == String(parseInt(this.currentMonth)))
    ) {
      this.isGenerate = true;;
      if (convertedDate > this.currentFullDate) {
        this.isGenerateDisabled = true;
      }
      else {
        this.isGenerateDisabled = false;
      }

    }
    else {
      this.isGenerate = false;
    }
  }
  onHistoryClicked(value) {
    this.router.navigate(['/payroll/monthly/history', { staffId: value.staff_id, returnUrl: this.router.url }]);
  }

  todaysDateInEnglish = new Date();
  selectedMonth: any;
  isGenerate: boolean = false;
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
    // this.dateTo = englishLastDayOfMonth;
    this.nonyearlyDateFrom = englishFirstDayOfMonth;
    this.nonYearlyDateTo = englishLastDayOfMonth;
    // allows to generate if current year or future date or previous month
    if ((new Date().getFullYear() == this.yearFrom && String(new Date().getMonth() + 1) == value)
      || this.dateFrom > this.currentFullDate ||
      (new Date().getFullYear() == this.yearFrom && String(new Date().getMonth()) == String(parseInt(this.selectedMonth)))
    ) {

      this.isGenerate = true;
    }
    else {
      this.isGenerate = false;
    }


    if (this.yearFrom == new Date().getFullYear() && this.currentMonth == new Date().getMonth() + 1) {
      this.isGenerate = true;
    }
    if (this.nonyearlyDateFrom) {
      this.setDateTo(this.nonyearlyDateFrom)
    }
    this.resetData();
  }
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
  resetData() {
    this.gridView = {
      data: [],
      total: 0
    };
    this.gridViewForSearch = {
      data: [],
      total: 0
    };
  }


  onBonusAdvancedClicked(data, modal) {
    this.buildAdvanceForm();
    this.openEditBonusAdvance(modal, data);
  }
  onCancel() {
    this.modalRef.hide();
  }
  sign: string = "0";
  updateAdvancedForm: FormGroup;
  buildupdateAdvancedForm(data?: any) {
    this.updateAdvancedForm = this.fb.group({
      bonus_advance: [data ? data.bonus : "0", [Validators.required]],
      sign: ["1", [Validators.required]]
    })
  }
  selectedUpdateAdvancedSlipObj: any;
  onUpdatePaySlip(template: TemplateRef<any>, data) {
    this.submitted = false;
    this.buildupdateAdvancedForm(data);
    this.selectedUpdateAdvancedSlipObj = data;
    let config = {
    }
    config = Object.assign({}, {
      class: 'modal-ex-sm',
      ignoreBackdropClick: true, backdrop: true,
    })
    this.modalRef = this.modalService.show(template, config);
  }
  onSaveAdvanced() {
    if (this.updateAdvancedForm.invalid) return;

    else {
      // return;
      let bodyObj = {
        id: this.selectedUpdateAdvancedSlipObj.payslip_id,
        access_token: this.globalService.getAccessTokenFromCookie(),
        staff_id: this.selectedUpdateAdvancedSlipObj.staff_id,
        date_from: this.selectedUpdateAdvancedSlipObj.start_date,
        date_to: this.selectedUpdateAdvancedSlipObj.end_date,
        bonus_advance: this.updateAdvancedForm.value.sign === '1' ? this.updateAdvancedForm.value.bonus_advance : -Math.abs(this.updateAdvancedForm.value.bonus_advance),
        status: this.selectedUpdateAdvancedSlipObj.status,
        company_id: this.companyId
      }
      this.onCancel();
      this.payrollService.onEditPayment(bodyObj).subscribe((res: CustomResponse) => {
        if (res.status) {

          this.toasterMessageService.showSuccess("Advanced Saved succesfully.");
          this.refresh();
        }
        else {
          this.toasterMessageService.showError("Cannot save advanced");
        }
      })

    }
  }
  refresh() {
    this.onViewClicked();
  }
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
          id: paySlip.payslip_id
        }
        // if (this.type == 'non-yearly') {
        //   bodyObj.date_from = this.globalService.transformFromDatepicker(this.nonyearlyDateFrom),
        //     bodyObj.date_to = this.globalService.transformFromDatepicker(this.nonYearlyDateTo)
        // }
        if (isPost) {
          this.onPaidClicked(bodyObj, isPost);
        }
        else {
          this.onPaidClicked(bodyObj);
        }
      }
    });
  }
  onBulkPayConfirmation() {
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "on bulk"
    this.modalRef.content.action = "Pay";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.onBulkPay();
      }
    });
  }
  onPaidClicked(bodyObj, isPost?: boolean) {
    this.payrollService.onEditPayment(bodyObj).subscribe((res: any) => {
      if (res.status) {
        this.toasterMessageService.showSuccess("Payment saved succesfully");
        if (this.isGenerate) {
          this.onGenerateClicked()
        }
        else {
          this.onViewClicked();
        }
      }
      else {
        this.toasterMessageService.showError("Payment  cannot be saved");
      }
    })
  }

  yearFrom;
  // currentDate= new Date();
  currentFullDate = this.globalService.transformFromDatepicker(
    this.currentDate
  )
  isGenerateDisabled: boolean;
  onYearChange(value) {
    let year = new Date(
      value
    ).getFullYear();
    let dateObj = new Date(
      year, 0, 30
    )
    this.yearFrom = this.globalService.transformForDatepickerPreview(
      dateObj,
      this.datePickerConfig.dateInputFormat
    );
    if (this.selectedMonth) {
      let englishFirstDayOfMonth =
        this.globalService.transformFromDatepicker(
          new Date(this.yearFrom, parseInt(this.selectedMonth) - 1, 1),
          // this.datePickerConfig.dateInputFormat
        );
      this.dateFrom = englishFirstDayOfMonth;
      let englishLastDayOfMonth =
        this.globalService.transformFromDatepicker(
          new Date(this.yearFrom, this.selectedMonth, 0),
          // this.datePickerConfig.dateInputFormat
        );
      this.dateTo = englishLastDayOfMonth;
      let convertedDate = this.globalService.transformFromDatepicker(value)
      // allows to generate if current year or future date or previous month
      if ((new Date().getFullYear() == this.yearFrom && String(new Date().getMonth() + 1) == this.selectedMonth)
        || (new Date().getFullYear() == this.yearFrom && String(new Date().getMonth()) == String(parseInt(this.selectedMonth)))
        || this.dateFrom > this.currentFullDate
      ) {
        this.isGenerate = true;

        if (convertedDate > this.currentFullDate) {
          this.isGenerateDisabled = true;
        }
        else {
          this.isGenerateDisabled = false;
        }

      }
      else {
        this.isGenerate = false;

      }

    }
    this.resetData();
  }
  onGenerateClicked() {
    if (this.isGenerateDisabled) {

      return;
    }
    this.listLoading = true;
    if (this.searchForm.get("emp_id").value && (this.searchForm.get("emp_id").value !== [])) {
      ;
      // return;
      this.generatePayrollForStaff();
    }
    else {

      // return;
      this.generatePayRollForAll();
    }

  }
  onChange() {
    this.searchForm.get("emp_id").setValue([]);
    this.getStaffList();
  }
  generatePayRollForAll() {
    let bodyObj = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      date_from: this.dateFrom,
      date_to: this.dateTo,
      company_id: this.globalService.getCompanyIdFromStorage(),
      limit: this.params.limit,
      page: this.page,
      sortnane: "payslip_id",
      sortno: 1
    }
    if (this.type == 'non-yearly') {
      bodyObj.date_from = this.datePickerFormat == "N" ?
        this.adbsdateConvertService.transformDateForAPI(this.nepaliDateForm.get("nepaliDateFrom").value, this.datePickerConfig.dateInputFormat) : this.globalService.transformFromDatepicker(this.nonyearlyDateFrom),
        bodyObj.date_to = this.datePickerFormat == "N" ?
          this.adbsdateConvertService.transformDateForAPI(this.nepaliDateForm.get("nepaliDateTo").value, this.datePickerConfig.dateInputFormat) : this.globalService.transformFromDatepicker(this.nonYearlyDateTo)
    }
    this.payrollService.generatePayroll(bodyObj).subscribe((data: CustomResponse) => {
      // console.log(data)
      if (data.status) {
        this.listLoading = false;
        this.gridView = { data: data.data, total: data.count ? data.count : data.data.length };
      }
      else {
        this.listLoading = false;
        this.gridView = {
          data: [],
          total: 0
        }
      }
    }, (err) => {
      this.listLoading = false;
    },
      () => {
        this.listLoading = false;
      })
  }
  generatePayrollForStaff() {
    let body = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      date_from: this.datePickerFormat == "N" ?
        this.adbsdateConvertService.transformDateForAPI(this.nepaliDateForm.get("nepaliDateFrom").value, this.datePickerConfig.dateInputFormat) :
        this.globalService.transformFromDatepicker(this.nonyearlyDateFrom),
      date_to: this.datePickerFormat == "N" ?
        this.adbsdateConvertService.transformDateForAPI(this.nepaliDateForm.get("nepaliDateTo").value, this.datePickerConfig.dateInputFormat) : this.globalService.transformFromDatepicker(this.nonYearlyDateTo),
      limit: this.limit,
      page: this.page,
      sortnane: "",
      sortno: 1,
      company_id: this.globalService.getCompanyIdFromStorage(),
      staff: this.searchForm.get('emp_id').value

    }
    if (body.staff == []) {
      const selected = this.staffList.map((item) => item.staff_id);
      body.staff = selected;
    }
    this.payrollService.generatePayrollForStaff(body).subscribe((res: CustomResponse) => {
      if (res.status) {
        this.toasterMessageService.showSuccess("Pay roll generate sucessfull");

        this.listLoading = false;
        this.gridView = {
          data: res.data,
          total: res.count
        }
      }
      else {
        this.toasterMessageService.showError("Pay roll generate failed");

      }
    })
  }

  // call back function to apply css to row of a kendo for Daily Report.
  public rowCallBack = (context: RowClassArgs, index) => {
    // checking paid
    if (context.dataItem.status == "1") {
      return {
        paid: true,
        // 'k-state-disabled':true
      };
    } else {
      return {
        unpaid: true,
      };
    }
  };


  type: string = "non-yearly";
  nonyearlyDateFrom;
  nonYearlyDateTo;
  initDates() {
    this.nonYearlyDateTo = this.globalService.transformForDatepickerPreview(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      this.datePickerConfig.dateInputFormat
    )
    this.nonyearlyDateFrom = this.globalService.transformForDatepickerPreview(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      this.datePickerConfig.dateInputFormat
    )
  }


  selectedPaySlips: any[];
  onGenerateSelectionChange(value) {

    this.selectedPaySlips
  }

  searchSelectedPaySlip: any[];
  onSearchSelectionChange(value) {

    this.searchSelectedPaySlip;
    if (value.selectedRows) {
      value.selectedRows.forEach(x => {

        let exist = this.bulkpayarray.filter(y => y == x.dataItem.payslip_id);

        if (exist != null && exist !== undefined && exist.length !== 0) {

          return;
        }
        else {
          if (x.dataItem.status == 0 || x.dataItem.status == "0") {
            this.bulkpayarray.push(x.dataItem.payslip_id)
          }
        }
      })
    }
    if (value.deselectedRows) {
      value.deselectedRows.forEach(x => {

        this.bulkpayarray.splice(this.bulkpayarray.indexOf(x.dataItem.payslip_id), 1)

      })

    }
  }

  isCollapsed: boolean = true;
  collapseButton
  regexConst = RegexConst;
  buildStaffSearchForm() {
    this.searchForm = this.fb.group({
      designation_id: [""],
      department_id: [""],
      emp_id: ["", Validators.required],
      employee_type: [""],
    });
  }
  collapsed(): void {
    // this.searchForm.reset();
    // this.getStaffList(this.getBody);
    this.collapseButton = "Select Employees";
  }
  expanded(): void {
    this.collapseButton = "Hide Select";
  }
  staffList: any;
  getStaffList() {
    this.staffList = [];
    let bodyObj = {
      company_id: this.globalService.getCompanyIdFromStorage(),
      limit: "",
      page: "",
      sortno: 1,
      sortnane: "full_name",
      search: {
        first_name: "",
        last_name: "",
        middle_name: "",
        mobile: "",
        phone: "",
        email_address: "",
        citizenship_no: "",
        gender: "",
        marital_status: "",
        employee_type: this.searchForm.get("employee_type").value,
        department_id: this.searchForm.get("department_id").value,
        designation_id: this.searchForm.get("designation_id").value,
        emp_id: "",
        dob: ""
      }
    }
    this.payrollService
      .getStaffList(bodyObj)
      .subscribe((response: CustomResponse) => {
        if (response.status) {
          this.staffList = response.data;
        } else {
          this.staffList = [];
        }
      });
  }
  bulkpayarray: any[] = [];
  onBulkPay() {
    if (!this.bulkpayarray || this.bulkpayarray.length == 0) {
      return;
    }
    else {
      let bodyObj = {
        access_token: this.globalService.getAccessTokenFromCookie(),
        status: 1,
        company_id: this.companyId,
        payrolls: this.bulkpayarray
      }
      this.payrollService.onBulkPay(bodyObj).subscribe((data: CustomResponse) => {
        if (data.status) {
          this.toasterMessageService.showSuccess("Payment made sucessfully");
          this.bulkpayarray = [];
          this.onViewClicked();
        }
        else {
          this.toasterMessageService.showError("Bulk payment failed");
        }
      })
    }


  }
  onSelectedAll() {
    const selected = this.staffList.map((item) => item.staff_id);

    this.searchForm.get("emp_id").patchValue(selected);
  }
  // to clear all users at once....
  public onClearableAll() {
    this.searchForm.get("emp_id").patchValue([]);
  }
  onResetForm() {
    this.searchForm.reset();
  }


  employeeTypeList: any = [];
  getEmployeeTypeList(): void {
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };

    this.payrollService.getEmployeeTypeList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.employeeTypeList = response.data;
        } else {
          this.employeeTypeList = [];
        }
      }
    );
  }

  departmentList: any = [];
  getdepartmentList(): void {
    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };

    this.payrollService.getDepartmentList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.departmentList = response.data;
        } else {
          this.departmentList = [];
        }
      },
    );
  }
  designationList: any = [];
  getDesignationList(): void {

    const params = {
      limit: this.limit,
      page: this.page,
      sortno: this.sortno,
      sortnane: this.sortnane,
      search_key: this.search_key,
      search_value: this.search_value,
    };

    this.payrollService.getDesignationList(params).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.designationList = response.data
        } else {
          this.designationList = []
        }
      },
    );
  }

  inRange(x, min, max) {
    return (x < max && x > min) || (x == min || x == max);
  }
  tableView = []
  selectedPaySlip: any;
  onViewPaySlip(selectedPaySlip, template: TemplateRef<any>) {
    this.selectedPaySlip = selectedPaySlip;
    this.tableView = [];
    this.tableView.push(this.selectedPaySlip)
    this.modalRef = this.modalService.show(template, Object.assign({}, {
      class: 'modal-lg',
      ignoreBackdropClick: true, backdrop: true,
    }));
  }
  onHideView() {
    this.modalRef.hide()
  }
  onNepaliMonthChange(value) {
    // console.log(value)
    if (this.datePickerConfig.dateInputFormat == "YYYY/MM/DD") {
      let year = this.nepaliDateForm.get("nepaliDateFrom").value.substring(0, 4);
      value = value.length == 1 ? "0" + value : value;
      this.nepaliDateForm.get("nepaliDateFrom").setValue(
        `${year}/${value}/01`
      )
      this.nepaliDateForm.get("nepaliDateTo").setValue(
        `${year}/${value}/${this.setNepaliDateFromAndTo(value)}`
      )
      this.disableBefore = `${year}/${value}/${this.setNepaliDateFromAndTo(value)}`;
      this.disableGenerateButton("nepali");
    }
    else {
      let year = this.nepaliDateForm.get("nepaliDateFrom").value.substring(6, 10);
      value = value.length == 1 ? "0" + value : value;
      this.nepaliDateForm.get("nepaliDateFrom").setValue(
        `${value}/01/${year}`
      )

      this.nepaliDateForm.get("nepaliDateTo").setValue(
        `${value}/${this.setNepaliDateFromAndTo(value)}/${year}`
      )
      this.disableBefore = `${value}/${this.setNepaliDateFromAndTo(value)}/${year}`;
      this.disableGenerateButton("nepali");
    }
    this.onReset()
  }
  setNepaliDateFromAndTo(month) :Number{
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
  disableGenerateButton(dateType: string) {
    switch (dateType) {
      case "nepali":
        let nepaliDateFrom = this.nepaliDateForm.get("nepaliDateFrom").value;

        if (nepaliDateFrom > this.currentNepaliFirstDayOfMonth || nepaliDateFrom == this.currentNepaliFirstDayOfMonth) {
          this.isGenerate = true;
          this.isGenerateDisabled = false;
          if (nepaliDateFrom > this.currentNepaliLastDayOfMonth) {
            this.isGenerateDisabled = true;
          }
        }
        else {
          this.isGenerate = false;
        }
        break;
      default:
        break
    }
  }
  // modalRef: BsModalRef;

  summaryMoney: string;
  selectedFundArray: any;
  onOpenView(template: TemplateRef<any>, data) {
    if (data.fund !== "Array") {
      this.selectedFundArray = eval(data.fund);

    }
    else {
      this.selectedFundArray = []
    }

    this.selectedPaySlip = data;


    let config = {
    }
    config = Object.assign({}, {
      class: 'modal-lg-xt',
      ignoreBackdropClick: true, backdrop: true,
    });
    this.summaryMoney = this.globalService.inWords(data.gross_salary);
    this.modalRef = this.modalService.show(template, config);
  }
  onHideViewModal() {
    this.modalRef.hide();
  }
  currencyObj = this.globalService.getCurrencyFromSetting();
  currencyDetail: any;
  getCurrencyDetail() {
    // console.log("this.currencyObj",this.currencyObj);
    this.payrollService.getCurrencyDetail(this.currencyObj.value).subscribe((data: CustomResponse) => {
      if (data.status) {
        this.currencyDetail = data.data[0];
        this.globalService.currencyDetail = this.currencyDetail;
      }
      else {
        this.globalService.currencyDetail = "";
      }
    })
  }

  selectedAdvanced;
  advancedTitle: string = "add";
  onOpenAdvancedModal(template: TemplateRef<any>, data, type) {
    console.log("data",data);
    this.selectedAdvanced = data;

    this.advancedTitle = type;
    this.buildAdvancedForm();
    this.totalAmt = 0;
    this.totalAmt = Number(data.working_salary);
    // console.log("sdsad",this.totalAmt)
    // ;
    // return;
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
    let fb = this.addAdvancedFormGroup(isRemove, value,type);
    addBreak.push(fb);
    // fb.get('percentage').valueChanges.subscribe((res)=>{
    //   console.log("res",1);
    //   console.log("this is index",addBreak.)
    // });

    // fb.get('amount').valueChanges.subscribe((res)=>{
    //   console.log("res",1);
    // });


  }
  addAdvancedFormGroup(isRemove?: boolean, value?: any,type?:any) {
    return this.fb.group({
      id: [value ? value.add_deduct_id : ''],
      is_remove: [],
      type: [isRemove ? 1 : 0],
      amount: [
        value&&value.type == 0?(value.amount_deduct) :( value ? value.amount : ''),
        Validators.required],
      title: [value ? value.title : '', Validators.required],
      details: [
        value ? value.details : ''
      ],
      isFlat:["flat"],
      addType:[value && value.type == 1 ? "additional":"deduction"],
      percentage:[value?value.percentage:'']
    });
  }
  activeFlatType:any ='flat';
  isFlat;
  onFlatChange(value){
    this.activeFlatType = value;
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
  onAmountChange() {
    // const formArr: any[] = this.advancedForm.get("advancedFormArray").value;
    // this.totalAmt = 0;
    // if (formArr.length > 0) {
    //   formArr.forEach(x => {
    //     x.amount ? this.totalAmt = this.totalAmt + x.amount :
    //       this.totalAmt = this.totalAmt + 0;
    //   })
    // }
    // else {
    //   this.totalAmt = 0;
    // }

    const formArr: any[] = this.advancedForm.get("advancedFormArray").value;
    // this.totalAmt = 0;
    this.totalAddition = 0;
    this.totalDeduction = 0;
    if (formArr.length > 0) {
      this.totalAmt = Number(this.selectedAdvanced.working_salary);
      formArr.forEach(x => {
        if(x.addType=='additional'){
          // console.log("added value",Number(x.amount))
          // console.log("this is totalAMt",this.totalAmt);


          x.amount ?( this.totalAmt = this.totalAmt + Number(x.amount)) :
          this.totalAmt = this.totalAmt + 0;
          // console.log("numbering",Number(this.totalAmt));
          // this.totalAmt = Number(this.totalAmt)
          this.totalAddition = this.totalAddition + Number(x.amount);
          this.totalAddition =Number(this.totalAddition)
        }
        else if(x.addType =="deduction"){
          Number(x.amount) ? this.totalAmt = this.totalAmt - Number(x.amount) :
          this.totalAmt = this.totalAmt - 0;
          // this.totalAmt = Number(this.totalAmt);
          this.totalDeduction = this.totalDeduction + Number(x.amount);
          this.totalDeduction = Number(this.totalDeduction)
        }

      })
      // this.totalAmt = this.totalAmt + this.totalAddition - this.totalDeduction;
    }
    else {
      this.totalAmt = 0;
    }
  }
  additionTotal:number = 0;
  deductionTotal:number = 0;

  getPaySlipPayOrDeductDetail(type) {
    const Type = type == 'add'?1:0;
    this.payrollService.getPaySlipAddDeduct(this.selectedAdvanced.payslip_id,Type).subscribe((res: CustomResponse) => {
      if (res.status) {
        this.buildAdvancedForm();
        res.data.assignments.forEach(x => {
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
  saving= false;
  companyInfo:any;
  getCompanyInfo(){
    this.payrollService.getCompanyInfo(this.globalService.getCompanyIdFromStorage()).subscribe((res:any)=>{

      if(res.status){
        this.companyInfo= res.data?res.data:"";

      }
    })
  }
  activeRowPayroll:any;
  activeDeductType:string;
  setActiveRowPayroll(data,type){
    // console.log("data",data);
    // console.log("type",type);
    this.activeRowPayroll = data;
    this.activeDeductType = type;
  }
  resetGridIndex(){
    this.activeRowPayroll = null;
    this.activeDeductType =null;
  }
  percent:number = 0;
  amount:number = 0;
  recalculateAmount(index,data,type,value){
    // console.log("value",value)
    // console.log("type",type);
    // console.log("event event",event)

    // if(!event.code.startsWith("D")){
    //   event.preventDefault();
    //   return;
    // }
    this.percent = 0;
    this.amount  = 0;

    // (<FormArray>this.advancedForm.get("advancedFormArray")).at(index).get("percentage").setValue(data.value.percentage);
   switch(type){
     case "percentage":
      let percentage = Number(value);
      // console.log("percentty",typeof(percentage));
      // console.log('percent',percentage);
      // console.log("receiveing data",data);
      // (<FormArray>this.advancedForm.get("advancedFormArray")).at(index).get("percentage").setValue(data.value.percentage);
      // console.log("percentage babu",data.value.percentage)
      // console.log("realted fb",  (<FormArray>this.advancedForm.get("advancedFormArray")).at(index));
      (<FormArray>this.advancedForm.get("advancedFormArray")).at(index).get("amount").patchValue(
        ((percentage/100)*this.selectedAdvanced.working_salary).toFixed(2)
      );
      // console.log("working slaayr",this.selectedAdvanced.working_salary)
      // console.log("Percentage amt",(percentage/100)*this.selectedAdvanced.working_salary)
      break;
      case "amount":
        (<FormArray>this.advancedForm.get("advancedFormArray")).at(index).get("percentage").patchValue(
          ((data.value.amount/this.selectedAdvanced.working_salary)*100).toFixed(2)
          )
          break;
       default:
         break;

   }

   this.onAmountChange();

  }
  @ViewChild('pdfDownload',{
    static:false
  })pdfDownload:PdfDownloadComponent;

  showPdf:boolean = false;
  @ViewChild('pdfwrap',{
    static:false
  })pdfwrap:TemplateRef<any>;
download(){
  this.showPdf = true;
  // console.log("pdfwrap",this.pdfwrap);
  // this.pdfDownload.downloadPdf();
  // pdf.saveAs('payroll.pdf');
}
printPage(){
  // let printContents, popupWin;
  //   printContents = document.getElementById('print-section').innerHTML;
  //   popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  //   popupWin.document.open();
  //   popupWin.document.write(`
  //     <html>
  //       <head>
  //         <title>Print tab</title>
  //         <style>
  //         //........Customized style.......
  //         </style>
  //       </head>
  //   <body >${printContents}</body>
  //     </html>`
  //   );
  //   // onload="window.print();window.close()"
  //   popupWin.document.close();
  // window.print();

}




}
