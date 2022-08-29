import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

declare var require: any;
var adbs = require("ad-bs-converter");
@Pipe({
  name: "dayPipe",
})
export class DayPipe implements PipeTransform {
  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  constructor(private datePipe: DatePipe) {}
  transform(value: string,type?:string,shortcut?:boolean) {
    value = this.datePipe.transform(value, "yyyy/MM/dd");

    // console.log("shortcut",shortcut)
    if(shortcut && shortcut == true){
      return this.days[adbs.ad2bs(value).en.dayOfWeek].substr(0,3);
    }else{
      return this.days[adbs.ad2bs(value).en.dayOfWeek];
    }

  }
}
