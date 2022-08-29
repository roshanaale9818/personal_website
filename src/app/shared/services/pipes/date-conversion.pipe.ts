import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

declare var require: any;
var adbs = require("ad-bs-converter");
@Pipe({
  name: "dateConversionPipe",
})
export class DateConversionPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: string, dateType: string) {
    if (dateType == "N") {
      value = this.datePipe.transform(value, "yyyy/MM/dd");
      // console.log(value);
      let dateObject = adbs.ad2bs(value);
      return `${dateObject.en.year}-${dateObject.en.month}-${dateObject.en.day}`;
    } else {
      return value;
    }
  }
}
