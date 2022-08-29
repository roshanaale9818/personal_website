import { HttpClient, HttpParams } from "@angular/common/http";
import { GlobalConstants } from "./constants";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { HttpClientService } from "@app/core/services/http-client/http-client.service";
import { environment } from "@env/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { Country } from "@app/shared/models/country.model";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { CookieService } from "ngx-cookie-service";
import { FormGroup } from "@angular/forms";
import { BsModalService } from "ngx-bootstrap";
import { RolesAccess } from "@app/core/guards/auth/services/rolesaccess";


declare var require: any;
var adbs = require("ad-bs-converter");
@Injectable({
  providedIn: "root",
})
export class GlobalService {
  baseIp = environment.baseIp;
  apiPrefix = environment.apiPrefix;
  accessToken = this.getAccessTokenFromCookie();
  pagelimit = "15";
  pageNumber = "1";
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

  todaysDateInEnglish = new Date();
  currentEnglishMonth = this.todaysDateInEnglish.getMonth() + 1;
  currentenglishDateInString = this.datePipe
    .transform(this.todaysDateInEnglish, "yyyy/MM/dd")
    .toString();
  currentNepaliYearObject = adbs.ad2bs(this.currentenglishDateInString);
  englishFirstDayOfMonth = this.datePipe.transform(
    new Date(
      this.todaysDateInEnglish.getFullYear(),
      this.currentEnglishMonth - 1,
      1
    ),
    "yyyy-MM-dd"
  );
  currentNepaliYear = this.currentNepaliYearObject.en.year;
  currentNepaliMonth = this.currentNepaliYearObject.en.month;
  nepalifirstDayOfMonth = {
    year: this.currentNepaliYear,
    month: this.currentNepaliMonth - 1,
    day: 1,
  };
  nepaliFirstDayInString = `${this.nepalifirstDayOfMonth.year}/${this.nepalifirstDayOfMonth.month + 1
    }/${this.nepalifirstDayOfMonth.day}`;
  currentNepaliDate = {
    year: this.currentNepaliYear,
    month: this.currentNepaliMonth - 1,
    day: this.currentNepaliYearObject.en.day,
  };
  currentNepaliDateInString = `${this.currentNepaliDate.year}/${this.currentNepaliDate.month + 1
    }/${this.currentNepaliDate.day}`;

  constructor(
    private httpClientService: HttpClientService,
    private localStorageService: LocalStorageService,
    private cookieService: CookieService,
    private datePipe: DatePipe,
    private router: Router,
    private modalService: BsModalService,
    private httpClient: HttpClient
  ) {
    // this.getCountryFromStorage();
    if (this.localStorageService.getLocalStorageItem('companyName')) [
      this.companyName.next(this.localStorageService.getLocalStorageItem('companyName'))
    ]
  }

  getAccessLevelFromStorage() {
    const accessLevel = this.cookieService.get("access_level");
    return accessLevel;
  }

  public markAsTouched(formGroup: FormGroup): void {
    formGroup.markAsTouched();
    formGroup.updateValueAndValidity();
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity({ onlySelf: false, emitEvent: true });
      if (control.controls) {
        this.markAsTouched(control);
      }
    });
  }
  getCompanyIdFromStorage() {
    let companyId;
    const userInfo = this.localStorageService.getLocalStorageItem("user_info");
    const changedCompanyId = this.localStorageService.getLocalStorageItem('changedCompanyId');
    if (changedCompanyId) {
      this.changedCompanyId = changedCompanyId;
    }
    if (this.changedCompanyId) {
      companyId = this.changedCompanyId;
    } else {
      companyId = userInfo ? userInfo.company_id : "";
    }
    return companyId;
  }

  changedCompanyId;
  setCompanyId(companyId) {
    this.changedCompanyId = companyId;
  }
  pinChangeUserId;
  setUserIdForPinChange(id) {
    this.pinChangeUserId = id;
  }
  getPinChangeUserId() {
    return this.pinChangeUserId;
  }
  getAccessTokenFromCookie() {
    const accessToken =
      this.localStorageService.getLocalStorageItem("flexYear-token");
    return accessToken;
  }

  // getnameFormat here from localstorage
  getNameFormat(): string {
    const settings = this.localStorageService.getLocalStorageItem("setting_list");
    let nameObj;
    let object = settings.filter(x => x.code == "name_format")[0];
    if (object) {
      nameObj = object;
    }
    return nameObj.value ? nameObj.value:null ;
  }
  // getName shwowing type from storage service
  getNegativeShowingType(): string {
    const settings = this.localStorageService.getLocalStorageItem("setting_list");
    let settingObj;
    let object = settings.filter(x => x.code == "negative_format")[0];
    if (object) {
      settingObj = object;
    }
    return settingObj.value ? settingObj.value:null ;
  }

  getSettingsFromStorage() {
    this.setting.settingList =
      this.localStorageService.getLocalStorageItem("setting_list");
    const emailSetting =
      this.localStorageService.getLocalStorageItem("emailSetting_list");
    if (emailSetting) {
      emailSetting.forEach((item) => {
        this.setting.settingList.push(item);
      });
    }
    //   const companyRuleSetting =
    //   this.localStorageService.getLocalStorageItem("company_rule");
    // if (companyRuleSetting) {
    //   companyRuleSetting.forEach((item) => {
    //     console.log("company_rule",item)
    //     this.setting.settingList.push(item);
    //   });
    // }

    return this.setting;
  }

  // getting date parameter from local storage and setting it to dateSetting object.
  getDateSettingFromStorage() {
    let setting = this.localStorageService.getLocalStorageItem("setting_list");
    if (setting != null && setting) {
      setting.forEach((item) => {
        if (item.code == "GS_DATE") {
          this.dateSetting.GS_DATE = item.value;
        } else if (item.code == "GS_DT_FORMAT") {
          if (item.value == "0") {
            this.dateSetting.GS_DT_FORMAT = "YYYY/MM/DD";
          } else if (item.value == "1") {
            this.dateSetting.GS_DT_FORMAT = "MM/DD/YYYY";
          } else if (item.value == "2") {
            this.dateSetting.GS_DT_FORMAT = "YYYY/MM/DD";
          } else if (item.value == "3") {
            this.dateSetting.GS_DT_FORMAT = "DD/MM/YYYY";
          }
        } else if (item.code == "GS_TIME_ZONE") {
          this.dateSetting.GS_TIME_ZONE = item.value;
        }
      });
    }

    return this.dateSetting;
  }

  getCountryFromStorage() {
    let setting = this.localStorageService.getLocalStorageItem("setting_list");
    setting.forEach((item) => {
      if (item.code == "COMP_COUNTRY") {
        this.countrySetting.COMP_COUINTRY = item.value;
      }
    });

    return this.countrySetting;
  }

  logout() {
    this.cookieService.deleteAll();
    this.localStorageService.clearLocalStorage();
    this.setCompanyId(null);
    this.modalService.hide(1);
    this.companyName.next(null);
    this.router.navigate(["login"]);
  }

  getCountryList(): Observable<Country[]> {
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}settings/country`
    );
  }

  getStateList() {
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}settings/state`
    );
  }

  getEmployeeList(companyId): Observable<any> {
    const params = new HttpParams().set("company_id", companyId);
    return this.httpClientService.get(
      `${this.baseIp}${this.apiPrefix}staff/index`,
      null,
      params
    );
  }

  transformForDatepickerPreview(date, format?: string) {
    if (!format) {
      return this.datePipe.transform(date, "M/d/yy");
    }
    else if (format == "YYYY/MM/DD") {
      return this.datePipe.transform(date, "yyyy/MM/dd")
    }
    else if (format == "YYYY") {
      return this.datePipe.transform(date, "yyyy")
    }
    else {
      return this.datePipe.transform(date, "M/d/yy");
    }
  }

  transformFromDatepicker(date) {
    return this.datePipe.transform(date, "yyyy-MM-dd");
  }

  transformFromTimePicker(dateTime) {
    return this.datePipe.transform(dateTime, "HH:mm:ss");
  }

  countryList = GlobalConstants.countryList;
  timeZone = GlobalConstants.timeZone;

  englishMonth = GlobalConstants.englishMonth;
  nepaliMonth = GlobalConstants.nepaliMonth;
  englishYear = GlobalConstants.englishYear;
  nepaliYear = GlobalConstants.NepaliYear;

  //getting a setting from setting in localstorage
  getValueOfSettingByCode(code: string) {
    // it will return a object which matches the code
    let setting = this.localStorageService.getLocalStorageItem("setting_list");
    let value = setting.filter(x => x.code == code)[0];
    if (value) {
      return value;
    }
    else {
      return {};
    }
  }
  getUserPreferenceSetting(code): any {
    let userPreferenceSetting = this.localStorageService.getLocalStorageItem("userPreferenceSetting");
    if (userPreferenceSetting) {
      let setting = userPreferenceSetting.filter(x => x.code == code)[0];
      if (setting !== undefined || setting !== null) {
        return setting;
      }
      return null;
    }
    else {
      return null;
    }
  }
  public nullToZeroConverter(value) {

    if (
      value === undefined ||
      value == null ||
      value === null ||
      value === '' ||
      value === 'Infinity' ||
      value === 'NaN' ||
      value === NaN ||
      isNaN(parseFloat(value))
    ) {
      return 0;
    }
    return parseFloat(value);
  }
  getCurrentUserId() {
    return  JSON.parse(localStorage.getItem("user_id")) ? JSON.parse(localStorage.getItem("user_id")):null;
  }
  getStaffId() {
    return JSON.parse(localStorage.getItem("staff_id"));
  }

  // buttonTask is edit delete view
  getButtonVisibilityAuth(role: string, buttonTask: string): boolean {
    let visibility: boolean = false;
    if (buttonTask == "view") {
      switch (role) {
        case "Admin":
          visibility = true;
          break;
        case "Super Admin":
          visibility = true;
          break;
        case "HR":
          visibility = RolesAccess.viewAccess.includes("HR");
          break;
        case "Manager":
          visibility = RolesAccess.viewAccess.includes("Manager");;
          break;
        default:
          visibility = false;
          break;
      }
      return visibility;
    }



    if (buttonTask == "edit") {
      switch (role) {
        case "Admin":
          visibility = true;
          break;
        case "Super Admin":
          visibility = true;
          break;
        case "HR":
          visibility = RolesAccess.editAccess.includes("HR");
          break;
        case "Manager":
          visibility = RolesAccess.editAccess.includes("Manager");;
          break;
        default:
          visibility = false;
          break;
      }
      return visibility;
    }


    if (buttonTask == "update") {
      switch (role) {
        case "Admin":
          visibility = true;
          break;
        case "Super Admin":
          visibility = true;
          break;
        case "HR":
          visibility = RolesAccess.editAccess.includes("HR");
          break;
        case "Manager":
          visibility = RolesAccess.editAccess.includes("Manager");;
          break;
        default:
          visibility = false;
          break;
      }
      return visibility;
    }


    if (buttonTask == "delete") {
      switch (role) {
        case "Admin":
          visibility = true;
          break;
        case "Super Admin":
          visibility = true;
          break;
        case "HR":
          visibility = RolesAccess.deleteAccess.includes("HR");
          break;
        case "Manager":
          visibility = RolesAccess.deleteAccess.includes("Manager");;
          break;
        default:
          visibility = false;
          break;
      }
      return visibility;
    }
    if (buttonTask == "add") {
      switch (role) {
        case "Admin":
          visibility = true;
          break;
        case "Super Admin":
          visibility = true;
          break;
        case "HR":
          visibility = RolesAccess.addAccess.includes(role);
          break;
        case "Manager":
          visibility = RolesAccess.addAccess.includes(role);;
          break;
        default:
          visibility = false;
          break;
      }
      return visibility;
    }
  }
  //it receives datetimelocal for comparing two different dates;
  // first bigDate is the biggest date for validation
  dateTimeLocalValidator(bigDate: any, smallDate: any): boolean {
    let value = false;
    if (bigDate < smallDate) {
      value = false;
    }
    else {
      value = true;
    }
    return value;
  }
  public companyName: BehaviorSubject<string> = new BehaviorSubject<string>(this.cookieService.get("company_name"));
  getCompanyName = this.companyName.asObservable();

  //returns the date using the year month and day
  getFullDate(year: number, month: any, day: any): any {
    return new Date(year, month, day);
  }

  //format is input date format
  changeDate(value, format: string, dateInputFormat?: string) {

    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = (value.replace("/", "/")).replace("/", "/");
      var bsDate = adbs.ad2bs(adDate);
      if (dateInputFormat == "YYYY/MM/DD") {
        return (bsDate.en.year + '/' + (bsDate.en.month.toString().length == 1 ? '0' + bsDate.en.month : bsDate.en.month) + '/' +
          (bsDate.en.day.toString().length == 1 ? '0' + bsDate.en.day : bsDate.en.day))
      }
      else {
        return (bsDate.en.day.toString().length == 1 ? '0' + bsDate.en.day : bsDate.en.day) + '/' + (bsDate.en.month.toString().length == 1 ? '0' + bsDate.en.month : bsDate.en.month) + '/' + bsDate.en.year
      }
      //  return ;
    } else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[0] + "/" + datearr[1] + "/" + datearr[2];

      var adDate = adbs.bs2ad(bsDate);

      //  return (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day));
      if (dateInputFormat == "YYYY/MM/DD") {
        return (adDate.year + '/' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '/' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day))
      }
      else {
        return (((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day) + '/' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '/' +
          adDate.year)
      }

    }

  }
  changeBSDateToAd(value) {

    var datearr = value.split('/');
    const bsDate = datearr[0] + "/" + datearr[1] + "/" + datearr[2];
    var adDate = adbs.bs2ad(bsDate);
    return (adDate.year + '-' + ((adDate.month).toString().length == 1 ? '0' + adDate.month : adDate.month) + '-' + ((adDate.day).toString().length == 1 ? '0' + adDate.day : adDate.day))
  }
  isUndefinedOrNull(value): boolean {
    if (value == null || value == undefined) {
      return true;
    }
    else {
      return false;
    }
  }


  inWords(num) {
    let hasDot = num.includes('.');
    let decimalValue = hasDot ? num.split(".") : null;
    if (num == "0.00") {
      return "Zero" + " " + (this.currencyDetail ? this.currencyDetail.name : "");
    }
    console.log("this curre", this.currencyDetail);
    num = parseInt(num);


    var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    var n;
    var str = '';
    if(num < 0){
      // console.log("reached here for minus")
      str ="Minus"
      num = Math.abs(num)
    }
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    // if (!n) return (this.currencyDetail ? this.currencyDetail.name : "") + " " + "Zero";
console.log("STRING HERE ",str)
    str = (this.currencyDetail.name) ? str+" "+this.currencyDetail.name + ' ' : str+'';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    // + this.currencyDetail.name+' only ';
    console.log("decimalValue", decimalValue)
    // str += (n[5] != 0) ? ((str != '') ? 'and ' : '')
    // + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])
    //  + (decimalValue !== null && decimalValue[1] !== "00" ? this.currencyDetail.name+" and  "
    //  + this.decimalInWords(decimalValue[1]) : this.currencyDetail.name+' only ') : ''
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '')
      // +this.currencyDetail.name
      +
      (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])
      + (decimalValue !== null && decimalValue[1] !== "00" ?
        //  this.currencyDetail.name
        //  +
        " and  "
        //  this.currencyDetail.name+
        + this.decimalInWords(decimalValue[1]) : ' only ') : ''
    // console.log("string str",str);
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  decimalInWords(num) {
    num = parseInt(num);
    var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    var n;
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    // str = (this.currencyDetail.penny_unit)?this.currencyDetail.penny_unit:""
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    // str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + this.currencyDetail.penny_unit + ' only ' : '';
    // return str;
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])
      + this.currencyDetail.penny_unit
      + ' only ' : '';
    return str;
  }

  getCurrencyFromSetting() {
    let settingList: any[] = this.localStorageService.getLocalStorageItem('setting_list');
    let currencyObj;
    // let currencyValue;
    if (settingList) {
      currencyObj = settingList.filter(x => x.code == 'CURRENCY')[0];
    }
    else {
      currencyObj = null;
    }
    return currencyObj ? currencyObj : " ";
  }
  public currencyDetail: any;
  _activePageNumber: number | string;
  _activeModule: string;
  getActivePageNumber(module) {
    if (module == this._activeModule) {
      return this._activePageNumber;
    }
    return;
  }
  setActivePageNumber(module: string, n: number | string) {
    this._activeModule = module;
    this._activePageNumber = n;
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
//for showing the confirmation in confirmation component
 public showConfirmBox:BehaviorSubject<boolean> = new BehaviorSubject(false);
 public confirmInputText:BehaviorSubject<string>= new BehaviorSubject(null);
 public confirmationSubmitDisableStatus:BehaviorSubject<boolean> = new BehaviorSubject(false);
public showConfirmationLabel:BehaviorSubject<string>= new BehaviorSubject(null);
resetConfirmationMethods(){
  this.showConfirmBox.next(false);
  this.confirmInputText.next(null);
  this.confirmationSubmitDisableStatus.next(false);
  this.showConfirmationLabel.next(null)
}

}
