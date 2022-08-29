import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'twoDigitNumber'})
export class TwoDigitNumber implements PipeTransform {

  transform(input:number):string {
    // console.log("nub",input)
    if(!input){ input=0}
    if(typeof(input)=="string"){
      input = Number(input);
  }
       return input.toFixed(2);

  }
}
