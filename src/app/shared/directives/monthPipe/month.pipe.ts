import { Pipe, PipeTransform } from '@angular/core';
import { AdBsDateConvertService } from '@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service';
import { MonthService } from './month.service';


@Pipe({
  name: 'monthPipe'
})
export class MonthConverterPipe implements PipeTransform {
  constructor(private  monthService:MonthService) {

  }
  // it receives month in number
  transform(value: any, language?:any): any {
   let month = this.monthService.getMonthInWords(language,value)
    return month;
  }

}
