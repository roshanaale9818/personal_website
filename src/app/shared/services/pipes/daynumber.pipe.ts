import { DateConverterService } from "./../dateConverter/date-converter.service";
import { Pipe, PipeTransform } from "@angular/core";

declare var require: any;
var adbs = require("ad-bs-converter");
@Pipe({
  name: "dayNumberPipe"
})
export class DayNumberPipe implements PipeTransform {
  constructor(private dateConverterService: DateConverterService) {}
  transform(value: string, dateType: string,twoDigit?:string) {
    // console.log(twoDigit)
    if (dateType == "N") {
      //   value = this.datePipe.transform(value, "yyyy/MM/dd");
      value = this.dateConverterService.dateStringFormater(value);
      // console.log(value);
      let dateObject = adbs.ad2bs(value);
      if(twoDigit){
        // console.log("retuning",dateObject.en.day);
        return dateObject.en.day.toString().length == 1 ? `0${dateObject.en.day}`:dateObject.en.day;
      }
      else{
        return dateObject.en.day;
      }
    } else {
      value = this.dateConverterService.dateStringFormater(value);
      let dateOjectInBs = adbs.ad2bs(value);
      let dateObjectInAd = adbs.bs2ad(
        `${dateOjectInBs.en.year}/${dateOjectInBs.en.month}/${dateOjectInBs.en.day}`
      );
      // console.log( dateObjectInAd.day)
      // console.log(typeof(dateObjectInAd.day));
      // console.log("in string",dateObjectInAd.day.toString())
      if(twoDigit){
       return  dateObjectInAd.day.toString().length == 1 ? `0${dateObjectInAd.day}`:dateObjectInAd.day;
      }

     else{
      return dateObjectInAd.day;
     }
    }
  }
}
