export interface NepaliDatePickerSettings{
  //language en || ne for nepali and english date picker
  language?:string;
  //inputFormat is for showing the date like placeholder like YYYY/MM/DD dd/mm/yyyy
  dateFormat?:string;
  defaultValue?:any;
  //showdropdownfornyear
  ndpYear?: boolean;
  //show dropdown for month
  ndpMonth?: boolean;
  //yearcount for showing
  ndpYearCount?: number;
  //for showing triggering button
  ndpTriggerButton?: boolean;
  // supportedBformat is neplai date yyyy-mm-dd for eg 2077-01-25
  disableBefore?: string;
  // supportedBformat is neplai date yyyy-mm-dd for eg 2077-01-25
  disableAfter?: string;
  disableDaysBefore?: number,
  disableDaysAfter?: number,
  unicodeDate?:boolean

}
