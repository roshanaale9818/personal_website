import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customdateFormat'
})
//it is for transforming date string to userpref setting date format
export class CustomdateFormatPipe implements PipeTransform {
  transform(date: any, format:any): any {
    let convertedDate = ""
    if(format == "YYYY/MM/DD"){
      let dateString = date.replace("-","/").replace("-","/");
      let stringArr = dateString.split("/");
      convertedDate = stringArr[0]+"/"+stringArr[1]+"/"+stringArr[2]
    }
    else{
      let dateString = date.replace("-","/").replace("-","/");
      let stringArr = dateString.split("/");
      convertedDate = stringArr[1]+"/"+stringArr[2]+"/"+stringArr[0]
    }
    return convertedDate;
  }

}
