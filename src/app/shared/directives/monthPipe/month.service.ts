import { Injectable } from '@angular/core';
import { GlobalConstants } from '@app/shared/services/global/constants';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  nepaliMonth = GlobalConstants.nepaliMonth;
  englishMonth = GlobalConstants.englishMonth;
  constructor() { }
  // value is month in number
  getMonthInWords(language: string, value: any) {
    let month = null;
    let queryMonthArray
    switch (language) {
      case "eng":
        queryMonthArray = this.englishMonth.filter(x => x.value == value);
        console.log("queryMonthArray",queryMonthArray)
        month = queryMonthArray && queryMonthArray.length>0 ? queryMonthArray[0].month:null;
        break;

      case "nep":
        queryMonthArray = this.nepaliMonth.filter(x => x.value == value);
        month = queryMonthArray&& queryMonthArray.length>0 ? queryMonthArray[0].month:null;
        break;
      default:
        break;
    }
    return month;

  }
}
