import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "hoursAndMinutesPipe",
})
export class HoursAndMinutesPipe implements PipeTransform {
  transform(value: string,splitValue?:string) {
    if (value) {
      let indexOfColon = splitValue =="dot" ? value.indexOf("."):value.indexOf(":");
      let lengthOfString = value.length - 1;
      let hour = value.substr(0, indexOfColon);
      let minute = value.substr(indexOfColon + 1, lengthOfString);
      if (minute == ":00" || minute == ".00") {
        minute = "0";
      }
      return hour + " " + "Hours" + " " + minute + " " + "Minutes";
    }
  }
}
