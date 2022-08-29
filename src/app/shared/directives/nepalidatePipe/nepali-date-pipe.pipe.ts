import { Pipe, PipeTransform } from '@angular/core';
import { AdBsDateConvertService } from '@app/shared/components/custom-nepalidatepicker/services/ad-bs-date-convert.service';


@Pipe({
  name: 'nepaliDatePipe'
})
export class NepaliDatePipePipe implements PipeTransform {
  constructor(private adbsConvertService:AdBsDateConvertService) {

  }
  // it receives english date
  transform(value: any, dateSetting?:any,fullDateWithTime?:string): any {
    let dateValue = this.adbsConvertService.transformToNepaliDate(value,dateSetting,fullDateWithTime);
    return dateValue;
  }

}
