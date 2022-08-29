export interface Summary {
  user_id: number;
  clientstaffdepartment?: any;
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
  holiday: string;
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

export interface UserwiseMonthlyReport {
  summary: Summary;
  attendance: Attendance[];
}

export interface HideShow {
  staff_id: string;
  add_attendance: string;
  force_change: string;
  request_chnage: string;
}

export interface MonthlyReportRootObject {
  status: boolean;
  user_id: string;
  data: UserwiseMonthlyReport;
  hide_show: HideShow;
}
