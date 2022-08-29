import { Injectable } from '@angular/core';
import { GlobalService } from '@app/shared/services/global/global.service';
import { CustomNepaliDatePickerInput } from '../modals/customNepaliDatePickerInput.modal';
declare var require: any;
var adbs = require("ad-bs-converter");
@Injectable({
  providedIn: 'root'
})

export class AdBsDateConvertService {

  constructor(
    private globalService:GlobalService
  ) { }

  convertEnglishDateForNepaliDatePicker(englishDate: CustomNepaliDatePickerInput, dateRangeType?: string): CustomNepaliDatePickerInput {
    let customNepaliDateObj: CustomNepaliDatePickerInput = <CustomNepaliDatePickerInput>{
    };
    if (englishDate) {
      let englishDateInString = englishDate.year.toString() + "/" + this.getTwoDigitString(englishDate.month) + "/" + this.getTwoDigitString(englishDate.day);
      let changedData = this.changeDate(englishDateInString, "AD");
      customNepaliDateObj = {
        year: changedData.en.year,
        month: parseInt(this.getTwoDigitString(changedData.en.month)),
        day: parseInt(this.getTwoDigitString(changedData.en.day))
      }
    }

    return customNepaliDateObj;
  }
  getTwoDigitString(value: number): string {
    //returns two digit for single digit date
    if (value.toString().length == 1) {
      return "0" + value.toString();
    }
    else {
      return value.toString();
    }
  }
  //format is input date format
  changeDate(value, format: string) {
    var adbs = require("ad-bs-converter");
    if (format == "AD") {
      var adDate = value;
      var bsDate = adbs.ad2bs(adDate);
      return bsDate;
    } else if (format == "BS") {
      var datearr = value.split('/');
      const bsDate = datearr[0] + "/" + datearr[1] + "/" + datearr[2];
      var adDate = adbs.bs2ad(bsDate);
      return adDate;
    }
  }
  changeDateForSendingToApi(date: CustomNepaliDatePickerInput){
    date.month = date.month+1;
    // date.month = date.month;
    let stringdate = date.year + "/" + date.month + "/" + date.day;
    const adDate = adbs.bs2ad(stringdate);
    return adDate.year + "-"+this.getTwoDigitString(adDate.month)+"-"+this.getTwoDigitString(adDate.day);
  }
  transformDateForAPI(value:string,format:string){
    let convertedDate = "";
    if(format == "MM/DD/YYYY"){
      let datearr = value.split('/');
      let stringDate =  datearr[2]+"/"+ datearr[0] + "/" + datearr[1];
    const adDate = adbs.bs2ad(stringDate);
    return adDate.year + "-"+this.getTwoDigitString(adDate.month)+"-"+this.getTwoDigitString(adDate.day);
    }
    else{
      let datearr = value.split('/');
      let stringDate =  datearr[0]+"/"+ datearr[1] + "/" + datearr[2];
      const adDate = adbs.bs2ad(stringDate);
      return adDate.year + "-"+this.getTwoDigitString(adDate.month)+"-"+this.getTwoDigitString(adDate.day);
    }

  }
  transformForNepaliDatepicker(englishDate:string,format:string){
    if(format == "MM/DD/YYYY"){
      var adDate = englishDate;
      var bsDate = adbs.ad2bs(adDate);
    return this.getTwoDigitString(bsDate.en.month)+ "/"+this.getTwoDigitString(bsDate.en.day)+"/"+bsDate.en.year;
    }
    else{
      var adDate = englishDate;
      var bsDate = adbs.ad2bs(adDate);
      return bsDate.en.year + "/"+this.getTwoDigitString(bsDate.en.month)+"/"+this.getTwoDigitString(bsDate.en.day);
    }
  }


  // use this method for nepali date picker patch

  transformNepaliDatePickerPreview(englishDate:string,format:string){
    if(format == "MM/DD/YYYY"){
      var adDate = englishDate.replace("-","/").replace("-","/");
      var bsDate = adbs.ad2bs(adDate);
    return this.getTwoDigitString(bsDate.en.month)+ "/"+this.getTwoDigitString(bsDate.en.day)+"/"+bsDate.en.year;
    }
    else{
      var adDate = englishDate.replace("-","/").replace("-","/");
      var bsDate = adbs.ad2bs(adDate);
      return bsDate.en.year + "/"+this.getTwoDigitString(bsDate.en.month)+"/"+this.getTwoDigitString(bsDate.en.day);
    }
  }






  transformToNepaliDate(englishDate:string,format:string,fullDateWithTime){
if(fullDateWithTime && fullDateWithTime =="fullDate"){
  if(format == "MM/DD/YYYY"){
    let data = englishDate.substr(0,10).replace("-","/").replace("-","/");
    var adDate =data;
    var bsDate = adbs.ad2bs(adDate);
  return this.getTwoDigitString(bsDate.en.month)+ "/"+this.getTwoDigitString(bsDate.en.day)+"/"+bsDate.en.year;
  }
  else{
    let data = englishDate.substr(0,10).replace("-","/").replace("-","/");
    var adDate =data;
    var bsDate = adbs.ad2bs(adDate);
    return bsDate.en.year + "/"+this.getTwoDigitString(bsDate.en.month)+"/"+this.getTwoDigitString(bsDate.en.day);
  }
}
else{
  if(format == "MM/DD/YYYY"){
    let data = englishDate.replace("-","/").replace("-","/");
    var adDate =data;
    var bsDate = adbs.ad2bs(adDate);
  return this.getTwoDigitString(bsDate.en.month)+ "/"+this.getTwoDigitString(bsDate.en.day)+"/"+bsDate.en.year;
  }
  else{
    let data = englishDate.replace("-","/").replace("-","/");
    var adDate =data;
    var bsDate = adbs.ad2bs(adDate);
    return bsDate.en.year + "/"+this.getTwoDigitString(bsDate.en.month)+"/"+this.getTwoDigitString(bsDate.en.day);
  }
}
  }
  getCurrentNepaliDate(format:string):string{
    let currentEnglishDate = this.globalService.transformFromDatepicker(new Date());

    let stringDate = currentEnglishDate.replace("-","/").replace("-","/");
    if(format == "MM/DD/YYYY"){
      var bsDate = adbs.ad2bs(stringDate);
    return this.getTwoDigitString(bsDate.en.month)+ "/"+this.getTwoDigitString(bsDate.en.day)+"/"+bsDate.en.year;
    }
    else{
      var bsDate = adbs.ad2bs(stringDate);
    return bsDate.en.year + "/"+this.getTwoDigitString(bsDate.en.month)+"/"+this.getTwoDigitString(bsDate.en.day);
    }
    // return currentEnglishDate;

  }
  getCurrentLastNepalidate(format:string):string{
    let currentEnglishDate = this.globalService.transformFromDatepicker(new Date());
    let stringDate = currentEnglishDate.replace("-","/").replace("-","/");
    if(format == "MM/DD/YYYY"){
      var bsDate = adbs.ad2bs(stringDate);
    return this.getTwoDigitString(bsDate.en.month)+ "/"+this.getTwoDigitString(bsDate.en.totalDaysInMonth)+"/"+bsDate.en.year;
    }
    else{
      var bsDate = adbs.ad2bs(stringDate);
    return bsDate.en.year + "/"+this.getTwoDigitString(bsDate.en.month)+"/"+this.getTwoDigitString(bsDate.en.totalDaysInMonth);
    }
    // return currentEnglishDate;

  }

  //returns first of nepali month
  getNepaliFirstDayOfMonth(format:string):string{
    let currentEnglishDate = this.globalService.transformFromDatepicker(new Date());

    let stringDate = currentEnglishDate.replace("-","/").replace("-","/");
    if(format == "MM/DD/YYYY"){
      var bsDate = adbs.ad2bs(stringDate);

    return this.getTwoDigitString(bsDate.en.month)+ "/"+"01"+"/"+bsDate.en.year;
    }
    else{
      var bsDate = adbs.ad2bs(stringDate);

    return bsDate.en.year + "/"+this.getTwoDigitString(bsDate.en.month)+"/"+"01";
    }
    // return currentEnglishDate;

  }
  // returns last day of month
  getLastDayOfNepaliMonth(format:string){
    let currentEnglishDate = this.globalService.transformFromDatepicker(new Date());
    let stringDate = currentEnglishDate.replace("-","/").replace("-","/");
    if(format == "MM/DD/YYYY"){
      let bsDate = adbs.ad2bs(stringDate);
      console.log("called",bsDate);
    return this.getTwoDigitString(bsDate.en.month)+ "/"+String(bsDate.en.totalDaysInMonth)+"/"+bsDate.en.year;
    }
    else{
      let bsDate = adbs.ad2bs(stringDate);
      console.log("called",bsDate);
    return bsDate.en.year + "/"+this.getTwoDigitString(bsDate.en.month)+"/"+String(bsDate.en.totalDaysInMonth);
    }
  }
  getLastdateOfNepaliMonth(month) {
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

 getPreviousSevenDaysDate(format){
  let currentEnglishDate = this.globalService.transformFromDatepicker(new Date());

  let stringDate = currentEnglishDate.replace("-","/").replace("-","/");
  if(format == "MM/DD/YYYY"){
    var bsDate = adbs.ad2bs(stringDate);
  return this.getTwoDigitString(bsDate.en.month)+ "/"+this.getTwoDigitString(bsDate.en.day - 7)+"/"+bsDate.en.year;
  }
  else{
    var bsDate = adbs.ad2bs(stringDate);
  return bsDate.en.year + "/"+this.getTwoDigitString(bsDate.en.month)+"/"+this.getTwoDigitString(bsDate.en.day - 7);
  }
 }
}
