import { ChangeDetectorRef, Component, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { DateFormatter } from '../../../../../projects/nepali-datepicker/src/lib/models/types.model';
import { CustomNepaliDatePickerSettings } from './modals/customNepaliDatePicker.modal';
import { FormControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { CustomNepaliDatePickerInput } from './modals/customNepaliDatePickerInput.modal';
import { AdBsDateConvertService } from './services/ad-bs-date-convert.service';

@Component({
  selector: 'app-custom-nepalidatepicker',
  templateUrl: './custom-nepalidatepicker.component.html',
  // providers:[AdBsDateConvertService],
  styleUrls: ['./custom-nepalidatepicker.component.scss']
})
export class CustomNepalidatepickerComponent implements OnInit {
  public form: FormGroup;

  constructor(private controlContainer: ControlContainer,
    private cdr: ChangeDetectorRef,
    private adBsConvertService:AdBsDateConvertService
    ) {
  }
  public control : FormControl;
  @Input()customNepaliDatePickerSetting:CustomNepaliDatePickerSettings;
  @Input() controlName:string;
  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
    this.control = <FormControl>this.form.get(this.controlName);
    if(this.customNepaliDatePickerSetting && this.customNepaliDatePickerSetting.defaultValue){
      this.control.setValue(this.adBsConvertService.convertEnglishDateForNepaliDatePicker(
        this.customNepaliDatePickerSetting.defaultValue
      ));
      if(this.customNepaliDatePickerSetting.defaultValue){
        console.log("%c changing calling",'background: #222; color: #bada55')
        this.onChange(this.adBsConvertService.convertEnglishDateForNepaliDatePicker(
          this.customNepaliDatePickerSetting.defaultValue
        ))
      }
    }
  }
  ngAfterContentInit(){

  }
  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
  }
  formatter: DateFormatter= (date) => {
    // console.log("date formatting here",date);
    // date.month = date.month+1;
      console.log("date formatting here",date);
    if(this.customNepaliDatePickerSetting && this.customNepaliDatePickerSetting.inputFormat && this.customNepaliDatePickerSetting.inputFormat =="YYYY/MM/DD"){
      console.log("Returningdasd",`${date.year}/${(date.month).toString().length == 1 ?("0"+date.month):(date.month) }/${(date.day).toString().length == 1 ? ("0"+date.day):(date.day)}`)
      return  `${date.year}/${(date.month).toString().length == 1 ?("0"+date.month):(date.month) }/${(date.day).toString().length == 1 ? ("0"+date.day):(date.day)}`;
    }
    else{
      // MM/DD/YYYY
      console.log("Returning formatter", `${(date.month).toString().length == 1 ?("0"+date.month):(date.month) }/${(date.day).toString().length == 1 ? ("0"+date.day):(date.day)}/${date.year}`)
      return  `${(date.month).toString().length == 1 ?("0"+date.month):(date.month) }/${(date.day).toString().length == 1 ? ("0"+date.day):(date.day)}/${date.year}`;
    }

  }
  onChange(event:CustomNepaliDatePickerInput){
    console.log(event);
  //  this.valueOnChanges.emit(event);
    let englishDate =  this.adBsConvertService.changeDateForSendingToApi(event);
    this.valueOnChanges.emit(englishDate);
    console.log("emitted",englishDate);
  }
    // Valuechanges is for emiting the value in every change event to the parent
    // it will give yyyy-mm-dd date to the parent
    @Output() valueOnChanges:EventEmitter<any> = new EventEmitter();


    dateTest
    changeDate(value,type){
      console.log(value,type)
      console.log("THis is test",this.dateTest);
    }
    // [disableProperty]="this._trnMainService.disableNepali"


}
