import { Component, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { CustomDateTimeLocalPickerSettings } from './modal/datepickerSetting';
import { EventEmitter } from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-custom-datetimelocal-picker',
  templateUrl: './custom-datetimelocal-picker.component.html',
  styleUrls: ['./custom-datetimelocal-picker.component.scss']
})
export class CustomDatetimelocalPickerComponent implements OnInit {

  constructor(private controlContainer: ControlContainer,private cdr: ChangeDetectorRef) {
  }

  @Input()datepickerSetting:CustomDateTimeLocalPickerSettings;

  // Valuechanges is for emiting the value in every change event to the parent
  @Output() valueOnChanges:EventEmitter<any> = new EventEmitter();
  public form: FormGroup;
  //controlName is just a control name of reactiveForm which is string;
  @Input() controlName : string;

   public control : FormControl;

ngOnChanges(changes:SimpleChange){

}
ngAfterViewChecked(){
  //your code to update the model
  this.cdr.detectChanges();
}
  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
    this.control = <FormControl>this.form.get(this.controlName);
    // this.form.get('checkin_datetime').setValue('2021-07-18 19:07'.replace(" ","T"))
  }
  onChange(event){
    //emits the value to the parent
    this.valueOnChanges.emit(event);
  }

}
