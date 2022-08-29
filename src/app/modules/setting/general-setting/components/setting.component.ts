import { Router } from "@angular/router";
import { ToastrMessageService } from "@app/shared/services/toastr-message/toastr-message.service";
import { CustomResponse } from "@app/shared/models/custom-response.model";
import { LocalStorageService } from "@app/shared/services/local-storage/local-storage.service";
import { ValidationMessageService } from "@app/shared/services/validation-message/validation-message.service";
import { GlobalService } from "@app/shared/services/global/global.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SettingResponse } from "./../model/settingResponse.model";
import { SettingService } from "./../services/setting.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { TabsetComponent, TabDirective } from "ngx-bootstrap/tabs";
import { RegexConst } from "@app/shared/constants/regex.constant";
@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"],
})
export class SettingComponent implements OnInit {
  @ViewChild("tabset", { static: false }) tabset: TabsetComponent;
  settingForm: FormGroup;
  settingsparams = this.globalService.getSettingsFromStorage();
  companyId = this.globalService.getCompanyIdFromStorage();
  settingBody = this.settingService.settingBody;
  submitted: boolean;
  language: any;
  settingParams = this.globalService.getSettingsFromStorage();
  countriesList = this.globalService.countryList;
  timeZone = this.globalService.timeZone;
  nepaliMonth = this.globalService.nepaliMonth;
  englishMonth = this.globalService.englishMonth;
  type: string = "E";

  regexConst = RegexConst;
  DateParams = this.globalService.getDateSettingFromStorage();
  monthType: any;

  constructor(
    private settingService: SettingService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private validationMessageService: ValidationMessageService,
    private localStorageService: LocalStorageService,
    private toasterMessageService: ToastrMessageService,
    private router: Router
  ) {
    this.getSettingConfig();
    this.getCurrrencyList();

  }
  getSettingConfig(){
    if(this.globalService.getCompanyIdFromStorage()){
      this.getSettingsAfterLogin(this.globalService.getCompanyIdFromStorage());
    }
  }

  dateSetting = {
    GS_DATE: "",
    GS_DT_FORMAT: "",
    GS_TIME_ZONE: "",
  };
  countrySetting = {
    COMP_COUINTRY: "",
  };
  setting = {
    settingList: [],
    emailSettingList: [],
  };
  getCountryFromStorage() {
    let setting = this.localStorageService.getLocalStorageItem("setting_list");
    setting.forEach((item) => {

      if (item.code == "COMP_COUNTRY") {
        this.countrySetting.COMP_COUINTRY = item.value;
      }
    });

    return this.countrySetting;
  }
  ngOnInit() {
    this.buildSettingForm();
    this.getDateFormatList();
    this.getMonthSelect();
    this.getDateFormatLists();
    this.getCountriesDropdownList();
    this.settingForm.valueChanges.subscribe((data) => {
      this.logValidationErrors();
      this.monthType;
    });
    this.setDecimisionPrecision();

    this.monthType =
      this.DateParams.GS_DATE === "E" ? this.englishMonth : this.nepaliMonth;
  }

  buildSettingForm() {
    this.settingForm = this.fb.group({
      company_id: [this.companyId ? this.companyId : ""],
      GE_MAIL_TYPE: [
        this.settingService.getControlValue("GE_MAIL_TYPE")
          ? this.settingService.getControlValue("GE_MAIL_TYPE")
          : "",
      ],
      GE_RELOAD_INTERVAL: [
        this.settingService.getControlValue("GE_RELOAD_INTERVAL")
          ? this.settingService.getControlValue("GE_RELOAD_INTERVAL")
          : "",
        [Validators.required, Validators.pattern(this.regexConst.PHONE_NO)],
      ],
      GE_MAIL_NO: [
        this.settingService.getControlValue("GE_MAIL_NO")
          ? this.settingService.getControlValue("GE_MAIL_NO")
          : "",
        [Validators.required, Validators.pattern(this.regexConst.PHONE_NO)],
      ],
      GE_MAIL_ENCODE_BIT: [
        this.settingService.getControlValue("GE_MAIL_ENCODE_BIT")
          ? this.settingService.getControlValue("GE_MAIL_ENCODE_BIT")
          : "",
        [
          Validators.required,
          Validators.pattern(this.regexConst.MAIL_ENCODING),
        ],
      ],
      // admin email
      GE_PHP_RETURN_PATH: [
        this.settingService.getControlValue("GE_PHP_RETURN_PATH")
          ? this.settingService.getControlValue("GE_PHP_RETURN_PATH")
          : "",
        Validators.required,
      ],
      // manager email
      GE_PHP_ALTERNATIVE_PATH: [
        this.settingService.getControlValue("GE_PHP_ALTERNATIVE_PATH")
          ? this.settingService.getControlValue("GE_PHP_ALTERNATIVE_PATH")
          : "",
        Validators.required,
      ],
      GE_SERVER_HOST: [
        this.settingService.getControlValue("GE_SERVER_HOST")
          ? this.settingService.getControlValue("GE_SERVER_HOST")
          : "",
        Validators.required,
      ],
      GE_SERVER_USERNAME: [
        this.settingService.getControlValue("GE_SERVER_USERNAME")
          ? this.settingService.getControlValue("GE_SERVER_USERNAME")
          : "",
        Validators.required,
      ],
      GE_SENDER_NAME: [
        this.settingService.getControlValue("GE_SENDER_NAME")
          ? this.settingService.getControlValue("GE_SENDER_NAME")
          : "",
        Validators.required,
      ],
      GE_SERVER_ENC_TYPE: [
        this.settingService.getControlValue("GE_SERVER_ENC_TYPE")
          ? this.settingService.getControlValue("GE_SERVER_ENC_TYPE")
          : "",
        Validators.required,
      ],
      GE_SERVER_PORT: [
        this.settingService.getControlValue("GE_SERVER_PORT")
          ? this.settingService.getControlValue("GE_SERVER_PORT")
          : "",
        [Validators.required, Validators.pattern(this.regexConst.PHONE_NO)],
      ],
      GE_SERVER_PASSWORD: ["", [Validators.required]],
      GE_PHP_FROM: [
        this.settingService.getControlValue("GE_PHP_FROM")
          ? this.settingService.getControlValue("GE_PHP_FROM")
          : "",
        Validators.required,
      ],
      GE_PHP_REPLY_TO: [
        this.settingService.getControlValue("GE_PHP_REPLY_TO")
          ? this.settingService.getControlValue("GE_PHP_REPLY_TO")
          : "",
        Validators.required,
      ],
      GS_SEND_ATTN_EMAIL: [
        this.settingService.getControlValue("GS_SEND_ATTN_EMAIL") == "1"
          ? true
          : false,
      ],
      GS_LATE_ATTENDANCE_EMAIL: [
        this.settingService.getControlValue("GS_LATE_ATTENDANCE_EMAIL") == "1"
          ? true
          : false,
      ],
      GS_SEND_LEAVE_RQ_MAIL: [
        this.settingService.getControlValue("GS_SEND_LEAVE_RQ_MAIL") == "1"
          ? true
          : false,
      ],
      GS_SEND_ATTN_CORR_RQ_MAIL: [
        this.settingService.getControlValue("GS_SEND_ATTN_CORR_RQ_MAIL") == "1"
          ? true
          : false,
      ],
      GS_SEND_ATTN_EMAIL_MANAGER: [
        this.settingService.getControlValue("GS_SEND_ATTN_EMAIL_MANAGER") == "1"
          ? true
          : false,
      ],
      GS_MANAGER_LATE_ATTENDANCE_EMAIL: [
        this.settingService.getControlValue(
          "GS_MANAGER_LATE_ATTENDANCE_EMAIL"
        ) == "1"
          ? true
          : false,
      ],
      GS_SEND_LEAVE_RQ_MAIL_MANAGER: [
        this.settingService.getControlValue("GS_SEND_LEAVE_RQ_MAIL_MANAGER") ==
        "1"
          ? true
          : false,
      ],
      GS_SEND_ATTN_CORR_RQ_MAIL_MANAGER: [
        this.settingService.getControlValue(
          "GS_SEND_ATTN_CORR_RQ_MAIL_MANAGER"
        ) == "1"
          ? true
          : false,
      ],
      // end of mail setting controls
      COMP_NAME: [
        this.settingService.getControlValue("COMP_NAME")
          ? this.settingService.getControlValue("COMP_NAME")
          : "",
        Validators.required,
      ],
      COMP_ADDR: [
        this.settingService.getControlValue("COMP_ADDR")
          ? this.settingService.getControlValue("COMP_ADDR")
          : "",
        Validators.required,
      ],
      COMP_COUNTRY: [
        this.settingService.getControlValue("COMP_COUNTRY")
          ? +this.settingService.getControlValue("COMP_COUNTRY")
          : "",
      ],
      COMP_PHONE: [
        this.settingService.getControlValue("COMP_PHONE")
          ? this.settingService.getControlValue("COMP_PHONE")
          : "",
        [Validators.required, Validators.pattern(this.regexConst.PHONE_NO)],
      ],
      // end of company Information controls
      GS_DATE: [
        this.settingService.getControlValue("GS_DATE")
          ? this.settingService.getControlValue("GS_DATE")
          : "",
      ],
      GS_DT_FORMAT: [
        this.settingService.getControlValue("GS_DT_FORMAT")
          ? this.settingService.getControlValue("GS_DT_FORMAT")
          : "",
      ],
      GS_TIME_ZONE: [
        this.settingService.getControlValue("GS_TIME_ZONE")
          ? this.settingService.getControlValue("GS_TIME_ZONE")
          : "",
      ],
      GS_LEAVE_REVIEW_MONTH: [
        this.settingService.getControlValue("GS_LEAVE_REVIEW_MONTH")
          ? this.settingService.getControlValue("GS_LEAVE_REVIEW_MONTH")
          : "",
      ],
      GM_STAFF_PRESENT: [
        this.settingService.getControlValue("GM_STAFF_PRESENT") == "1"
          ? true
          : false,
      ],
      GM_ATT_ALERT: [
        this.settingService.getControlValue("GM_ATT_ALERT") == "1"
          ? true
          : false,
      ],
      GS_LATE: [
        this.settingService.getControlValue("GS_LATE") == "1" ? true : false,
      ],
      GS_IP: [
        this.settingService.getControlValue("GS_IP") == "1" ? true : false,
      ],
      CURRENCY: [
        this.settingService.getControlValue("CURRENCY")
          ? this.settingService.getControlValue("CURRENCY")
          : "",
      ],
      DEC_POINT:[
        this.settingService.getControlValue("DEC_POINT")
        ? this.settingService.getControlValue("DEC_POINT")
        : "",
      ],
      OT_Allow: [
        this.settingService.getControlValue("OT_Allow") == "1"
          ? true
          : false,
      ],
      name_format:[
        this.settingService.getControlValue("name_format")
        ? this.settingService.getControlValue("name_format")
        : "",
      ],
      negative_format:[
        this.settingService.getControlValue("negative_format")
        ? this.settingService.getControlValue("negative_format")
        : "",
      ],

      // company rule starts here

      CR_WHPD:[
        this.companyrule?
        this.companyrule["CR_WHPD"]
      :''],
      CR_OT1:[
        this.companyrule?
        this.companyrule["CR_OT1"]
        :''],
      CR_OT2:[ this.companyrule?
        this.companyrule["CR_OT2"]
        :''],
      CR_LHU:[this.companyrule?
        this.companyrule["CR_LHU"]
        :''],

      //check box starts here
      CR_LAAW:[(this.companyrule &&
      this.companyrule["CR_LAAW"] &&
      this.companyrule["CR_LAAW"] == "1" )?
        true
        :false],
      CR_BREAK_PAID:[(this.companyrule &&
        this.companyrule["CR_BREAK_PAID"] &&
        this.companyrule["CR_BREAK_PAID"] == "1" )?
        true
        :false],
      CR_LUNCH_PAID:[(this.companyrule &&
        this.companyrule["CR_LUNCH_PAID"] &&
        this.companyrule["CR_LUNCH_PAID"] == "1" ) ?
        true
        :false],
      CR_LABW:[(this.companyrule &&
        this.companyrule["CR_LABW"] &&
        this.companyrule["CR_LABW"] == "1" )?
        true
        :false],
      CR_PUBLIC_PAID:[(this.companyrule &&
        this.companyrule["CR_PUBLIC_PAID"] &&
        this.companyrule["CR_PUBLIC_PAID"] == "1" ) ?
        true
        :false]

      // companyRule ends here


    });
  }
  get OtAllow(){
    return this.settingForm.get('OT_Allow').value;
  }
  get lunchPaid(){
    return this.settingForm.get('CR_LUNCH_PAID').value;
  }

  countryList;
  getCountriesDropdownList(): void {
    this.globalService.getCountryList().subscribe((response) => {
      this.countryList = response;
    });
  }

  monthSelectList;
  getMonthSelect(): void {
    this.monthSelectList = [
      {
        name: "English Date",
        value: "E",
      },
      {
        name: "Nepali Date",
        value: "N",
      },
    ];
  }

  dateFormatList;
  getDateFormatList(): void {
    this.dateFormatList = [
      {
        name: "YYYY/MM/DD",
        value: "0",
      },
      {
        name: "MM/DD/YYYY",
        value: "1",
      },
    ];
  }

  dateFormatLists;
  getDateFormatLists(): void {
    this.dateFormatLists = [
      {
        name: "YYYY/MM/DD",
        value: "2",
      },
      {
        name: "DD/MM/YYYY",
        value: "3",
      },
    ];
  }

  // dynamic form validation section
  validationMessages = {
    enUS: {
      GE_RELOAD_INTERVAL: {
        required: "This Field is Required",
        pattern: "This Field must be an Integer",
      },
      GE_MAIL_NO: {
        required: "This Field is Required",
        pattern: "This Field must be an Integer",
      },
      GE_MAIL_ENCODE_BIT: {
        required: "This Field is Required",
        pattern: "Input must be in Format '8-bit'",
      },
      GE_PHP_RETURN_PATH: {
        required: "This Field is Required",
      },
      GE_PHP_ALTERNATIVE_PATH: {
        required: "This Field is Required",
      },
      GE_SERVER_HOST: {
        required: "This Field is Required",
      },
      GE_SERVER_USERNAME: {
        required: "This Field is Required",
      },
      GE_SENDER_NAME: {
        required: "This Field is Required",
      },
      GE_SERVER_ENC_TYPE: {
        required: "This Field is Required",
      },
      GE_SERVER_PORT: {
        required: "This Field is Required",
        pattern: "This Field must be an Integer",
      },
      GE_SERVER_PASSWORD: {
        required: "This Field is Required",
      },
      GE_PHP_FROM: {
        required: "This Field is Required",
      },
      GE_PHP_REPLY_TO: {
        required: "This Field is Required",
      },
      COMP_NAME: {
        required: "This Field is Required",
      },
      COMP_ADDR: {
        required: "This Field is Required",
      },
      COMP_PHONE: {
        required: "This Field is Required",
        pattern: "This Field must be an Integer",
      },
    },
  };
  // object for saving error message when validation fails
  formErrors = {
    GE_RELOAD_INTERVAL: "",
    GE_MAIL_NO: "",
    GE_MAIL_ENCODE_BIT: "",
    GE_PHP_RETURN_PATH: "",
    GE_PHP_ALTERNATIVE_PATH: "",
    GE_SERVER_HOST: "",
    GE_SERVER_USERNAME: "",
    GE_SENDER_NAME: "",
    GE_SERVER_ENC_TYPE: "",
    GE_SERVER_PORT: "",
    GE_SERVER_PASSWORD: "",
    GE_PHP_FROM: "",
    GE_PHP_REPLY_TO: "",
    COMP_NAME: "",
    COMP_ADDR: "",
    COMP_PHONE: "",
  };
  /**
   * adds validation message to the form control on violation
   */
  logValidationErrors(): void {
    if (!this.submitted) return;
    this.formErrors = this.validationMessageService.getFormErrors(
      this.settingForm,
      this.formErrors,
      this.validationMessages,
      this.language
    );
  }

  switchMonthType(event) {
    this.monthType = event;
    // this.type = event; //to change the value of date format according to Date Type
    this.monthType = event == "E" ? this.englishMonth : this.nepaliMonth;
  }

  setFormValuesToSettingBody() {
    const settingFormValue = this.settingForm.value;
    this.settingBody.company_id = this.globalService.getCompanyIdFromStorage();
    this.settingBody.setting.COMP_NAME = settingFormValue.COMP_NAME;
    this.settingBody.setting.COMP_ADDR = settingFormValue.COMP_ADDR;
    this.settingBody.setting.COMP_COUNTRY = settingFormValue.COMP_COUNTRY;
    this.settingBody.setting.COMP_PHONE = settingFormValue.COMP_PHONE;
    this.settingBody.setting.GS_DATE = settingFormValue.GS_DATE;
    this.settingBody.setting.GS_DT_FORMAT = settingFormValue.GS_DT_FORMAT;
    this.settingBody.setting.GS_TIME_ZONE = settingFormValue.GS_TIME_ZONE;
    this.settingBody.setting.GS_SEND_ATTN_EMAIL =
      settingFormValue.GS_SEND_ATTN_EMAIL == true ? "1" : "0";
    this.settingBody.setting.GS_SEND_LEAVE_RQ_MAIL =
      settingFormValue.GS_SEND_LEAVE_RQ_MAIL == true ? "1" : "0";
    this.settingBody.setting.GS_SEND_ATTN_CORR_RQ_MAIL =
      settingFormValue.GS_SEND_ATTN_CORR_RQ_MAIL == true ? "1" : "0";
    this.settingBody.setting.GM_STAFF_PRESENT =
      settingFormValue.GM_STAFF_PRESENT == true ? "1" : "0";
    this.settingBody.setting.GM_ATT_ALERT =
      settingFormValue.GM_ATT_ALERT == true ? "1" : "0";
    this.settingBody.setting.GS_LEAVE_REVIEW_MONTH =
      settingFormValue.GS_LEAVE_REVIEW_MONTH;
    this.settingBody.setting.GS_LATE =
      settingFormValue.GS_LATE == true ? "1" : "0";
    this.settingBody.setting.GS_SEND_ATTN_EMAIL_MANAGER =
      settingFormValue.GS_SEND_ATTN_EMAIL_MANAGER == true ? "1" : "0";
    this.settingBody.setting.GS_SEND_LEAVE_RQ_MAIL_MANAGER =
      settingFormValue.GS_SEND_LEAVE_RQ_MAIL_MANAGER == true ? "1" : "0";
    this.settingBody.setting.GS_SEND_ATTN_CORR_RQ_MAIL_MANAGER =
      settingFormValue.GS_SEND_ATTN_CORR_RQ_MAIL_MANAGER == true ? "1" : "0";
    this.settingBody.setting.GS_MANAGER_LATE_ATTENDANCE_EMAIL =
      settingFormValue.GS_MANAGER_LATE_ATTENDANCE_EMAIL == true ? "1" : "0";
    this.settingBody.setting.GS_LATE_ATTENDANCE_EMAIL =
      settingFormValue.GS_LATE_ATTENDANCE_EMAIL == true ? "1" : "0";
    this.settingBody.setting.GS_IP = settingFormValue.GS_IP == true ? "1" : "0";
    this.settingBody.setting.OT_Allow = settingFormValue.OT_Allow == true ? "1" : "0";
    this.settingBody.setting.DEC_POINT = settingFormValue.DEC_POINT;
    this.settingBody.setting.CURRENCY = settingFormValue.CURRENCY;
    this.settingBody.setting.name_format = settingFormValue.name_format;
    this.settingBody.setting.negative_format = settingFormValue.negative_format;
    // emailsetting part
    this.settingBody.emailsetting.GE_MAIL_TYPE = settingFormValue.GE_MAIL_TYPE;
    this.settingBody.emailsetting.GE_RELOAD_INTERVAL =
      settingFormValue.GE_RELOAD_INTERVAL;
    this.settingBody.emailsetting.GE_MAIL_NO = settingFormValue.GE_MAIL_NO;
    this.settingBody.emailsetting.GE_MAIL_ENCODE_BIT =
      settingFormValue.GE_MAIL_ENCODE_BIT;
    this.settingBody.emailsetting.GE_SERVER_HOST =
      settingFormValue.GE_SERVER_HOST;
    this.settingBody.emailsetting.GE_SERVER_USERNAME =
      settingFormValue.GE_SERVER_USERNAME;
    this.settingBody.emailsetting.GE_SERVER_PASSWORD =
      settingFormValue.GE_SERVER_PASSWORD;
    this.settingBody.emailsetting.GE_SERVER_ENC_TYPE =
      settingFormValue.GE_SERVER_ENC_TYPE;
    this.settingBody.emailsetting.GE_SERVER_PORT =
      settingFormValue.GE_SERVER_PORT;
    this.settingBody.emailsetting.GE_PHP_FROM = settingFormValue.GE_PHP_FROM;
    this.settingBody.emailsetting.GE_PHP_REPLY_TO =
      settingFormValue.GE_PHP_REPLY_TO;
    this.settingBody.emailsetting.GE_SENDER_NAME =
      settingFormValue.GE_SENDER_NAME;
    this.settingBody.emailsetting.GE_PHP_ALTERNATIVE_PATH =
      settingFormValue.GE_PHP_ALTERNATIVE_PATH;
    this.settingBody.emailsetting.GE_PHP_RETURN_PATH =
      settingFormValue.GE_PHP_RETURN_PATH;

      // company rule starts here
      this.settingBody.rules.CR_WHPD =
      settingFormValue.CR_WHPD;
      this.settingBody.rules.CR_OT1 =
      settingFormValue.CR_OT1;
      this.settingBody.rules.CR_OT2 =
      settingFormValue.CR_OT2;
      this.settingBody.rules.CR_LHU =
      settingFormValue.CR_LHU;
      //check box starts here
      this.settingBody.rules.CR_LAAW = settingFormValue.CR_LAAW == true ? "1" : "0";
      this.settingBody.rules.CR_BREAK_PAID = settingFormValue.CR_BREAK_PAID == true ? "1" : "0";
      this.settingBody.rules.CR_LUNCH_PAID = settingFormValue.CR_LUNCH_PAID == true ? "1" : "0";
      this.settingBody.rules.CR_LABW = settingFormValue.CR_LABW == true ? "1" : "0";
      this.settingBody.rules.CR_PUBLIC_PAID = settingFormValue.CR_PUBLIC_PAID == true ? "1" : "0";




      // rules ends here
  }

  getSettingsListAfterEdit() {
    this.settingService.getSettings().subscribe((response: SettingResponse) => {
      if (response.status) {
        // append local storage after edit..
        this.localStorageService.removeLocalStorageItem("setting_list");
        this.localStorageService.removeLocalStorageItem("emailSetting_list");

        this.localStorageService.setLocalStorageItem(
          "setting_list",
          response.setting
        );
        this.localStorageService.setLocalStorageItem(
          "emailSetting_list",
          response.emailsetting
        );
      }
    });
  }

  // edit method
  editSettings(body): void {
    this.settingService.editSettings(body).subscribe(
      (response) => {
        if (response.status) {
          this.toasterMessageService.showSuccess(
            "Settings edited successfully"
          );

          this.getSettingsListAfterEdit();
        }
      },
      (error) => {
        this.toasterMessageService.showError(error);
      }
    );
    this.reloadPage();
  }
  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }
  OnSave() {
    // this.submitted = true;
    // this.logValidationErrors();
    // if (this.settingForm.invalid) {
    //   this.toasterMessageService.showError("Password is required ");
    //   return;
    // }
    this.setFormValuesToSettingBody();
    this.editSettings(this.settingBody);
  }

  companyrule:any;

   //passed the companyId from login
   async getSettingsAfterLogin(id) {
   await this.settingService.getSettingsForCompanyChange(id).toPromise().then((response) => {
      if (response.status) {

        // this.loginService.setSettingsParametersOnStorage(
        //   response.setting,
        //   response.emailsetting
        this.localStorageService.setLocalStorageItem(
          "setting_list",
          response.setting
        );
        this.localStorageService.setLocalStorageItem(
          "emailSetting_list",
          response.emailsetting
        );
        this.localStorageService.setLocalStorageItem(
          "company_rule",
          response.companyrule
        );

        this.companyrule = response.companyrule;

        this.companyrule =  this.companyrule.reduce(
          (obj, item) => Object.assign(obj, { [item.code]: item.value }), {});


        // return;
        // this.buildSettingForm();
      }
    });
    this.buildSettingForm();

  }
  currencyList:any[];
  getCurrrencyList(): void {

    let body = {
      access_token: this.globalService.getAccessTokenFromCookie(),
      limit: this.globalService.pagelimit,
      page: this.globalService.pageNumber,
      sortnane: "name",
      sortno: 1,
      company_id: this.globalService.getCompanyIdFromStorage(),
      search: {
        name: "",
        status: ""
      }
    }

    this.settingService.getCurrenyList(body).subscribe(
      (response: CustomResponse) => {
        if (response.status) {
          this.currencyList = response.data;

          return;
        } else {
          this.currencyList  = [];
        }
      },
      (error) => {

      },

    );
  }
  decimalPrecision:any[]=[];
  setDecimisionPrecision(){
    this.decimalPrecision = [];
    for(let i = 1;i<=10;i++){
      this.decimalPrecision.push({
        value:String(i)
      })
    }
  }
  getCurrencyDetail(value){
    return this.currencyList.filter(x=> x.currency_id == value)[0] ? this.currencyList.filter(x=> x.currency_id == value)[0]['name']:"Nepalese Rupees";
  }

}
