import { Pipe, PipeTransform } from '@angular/core';
import { GlobalService } from '@app/shared/services/global/global.service';

@Pipe({
  name: 'customPipeForDatePicker',
  pure: true
})
export class CustomPipeForDatePickerPipe implements PipeTransform {
  constructor(public globalService: GlobalService) {

  }
  transform(value: any, dateSetting?:any): any {
    // console.log(value,dateSetting);
    let dateValue = this.globalService.transformForDatepickerPreview(value,dateSetting);
    return dateValue;
  }

}
