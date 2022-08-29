// export interface Attendance {
//   date: string;
//   nepali_date: string;
//   attendance: string;
//   in: string;
//   out: string;
//   fv: string;
//   holiday: string;
//   leave: string;
//   weekend: string;
// }

// export interface Summary {
//   total: string;
//   leavetot: number;
//   present: number;
//   offday: number;
//   totaldays: number;
//   absent: number;
//   workinghr: number;
//   workingdays: number;
// }

// export interface AttData {
//   attendance: Attendance[];
//   summary: Summary;
// }

// export interface HideShow {
//   client_id: string;
//   staff_id: string;
// }

// export interface MonthlyReports {
//   client_name: string;
//   user_id: string;
//   att_data: AttData;
//   hide_show: HideShow;
// }

// export interface MonthlyReportsRootObject {
//   status: boolean;
//   data: MonthlyReports;
// }

export interface Summary {
  user_id: number;
  clientstaffdepartment: string;
  staff_id: number;
  username: string;
  staff_name: string;
  full_name: string;
  emp_id: string;
  total: string;
  leavetot: number;
  present: number;
  offday: number;
  totaldays: number;
  absent: number;
  workinghr: string;
  workingdays: number;
}

export interface Attendance {
  date: string;
  nepali_date: string;
  user: number;
  attendance: string;
  in: string;
  out: string;
  fv: string;
  holiday?: any;
  leave: string;
  weekend: string;
  category?: any;
  lunch_out: string;
  lunch_in: string;
  total_lunch: string;
  break_in: string;
  break_out: string;
  break_hr: string;
  extra_regular_in: string;
  extra_regular_out: string;
  extra_regular_hr: string;
  grand_total: string;
}

export interface AttData {
  summary: Summary;
  attendance: Attendance[];
}

export interface HideShow {
  client_id: string;
  staff_id: string;
}

export interface MonthlyReports {
  client_name: string;
  user_id: string;
  att_data: AttData[];
  hide_show: HideShow;
}

export interface MonthlyRootObject {
  status: boolean;
  data: MonthlyReports;
}

export interface TableHeading {
  department: string;
  emp_id: string;
  name: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  total: string;
}

export interface WeeklyReports {
  department: string;
  emp_id: string;
  name: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  workinghr: string;
}

export interface DailyTotalHr {
  grand_total_mon: string;
  grand_total_tue: string;
  grand_total_wed: string;
  grand_total_thu: string;
  grand_total_fri: string;
  grand_total_sat: string;
  grand_total_sun: string;
}

export interface DailyHeadCount {
  head_mon: number;
  head_tue: number;
  head_wed: number;
  head_thu: number;
  head_fri: number;
  head_sat: number;
  head_sun: number;
  grand_total: string;
}

export interface Summary {
  daily_total_hr: DailyTotalHr;
  daily_head_count: DailyHeadCount;
}

export interface WeeklyRootObject {
  status: boolean;
  table_heading: TableHeading;
  data: WeeklyReports[];
  summary: Summary;
  count: number;
}
