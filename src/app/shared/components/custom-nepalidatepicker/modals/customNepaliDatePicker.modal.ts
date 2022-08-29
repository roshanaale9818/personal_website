import { CustomNepaliDatePickerInput } from './customNepaliDatePickerInput.modal';
export interface CustomNepaliDatePickerSettings{
  //language en || ne for nepali and english date picker
  language?:string;
  // class like form-control css class
  inputClass?:string;
  //inputFormat is for showing the date like placeholder like YYYY/MM/DD dd/mm/yyyy
  inputFormat?:string;
  //pass the defaultValue as english date object for default value eg.
  // {
  //   year:new Date().getFullYear(),
  //   month:new Date().getMonth()+1,
  //   day:new Date().getDate()
  // }
  defaultValue?:CustomNepaliDatePickerInput
}
