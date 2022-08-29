import { Pipe, PipeTransform } from '@angular/core';
import { GlobalService } from '@app/shared/services/global/global.service';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {
  constructor(private globalService: GlobalService) { }
  transform(firstname: string, lastname?: string, middlename?: string): any {
    const nameformat = this.globalService.getNameFormat();
    let value;
    switch (nameformat) {
      case "lmf":
        value = `${lastname} ${middlename ? middlename : ''}${firstname}`;
        break;

      case "fml":
        value = `${firstname} ${middlename ? middlename : ''}${lastname}`;
        break;

      default:
        value = `${firstname} ${middlename ? middlename : ''}${lastname}`;
        break;



    }
    return value;
  }

}
