import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
declare var require: any;
var adbs = require("ad-bs-converter");
@Pipe({
  name: "showWeekendPipe",
})
export class ShowWeekendPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: string, date: string) {
    date = this.datePipe.transform(date, "yyyy/MM/dd");
    let dateObject = adbs.ad2bs(date);
    // if (dateObject.en.dayOfWeek == 6 || dateObject.en.dayOfWeek == 0) {
    // return "Weekend";
    // } else {
    if (value == "00:00") {
      return "Data Not Found";
    } else {
      return value;
    }
    // }
  }
}
