export interface CorrectionAttendance {
  attendance_id: number;
  user_id: number;
  checkin_datetime: string;
  checkin_message?: any;
  checkin_status: number;
  checkout_status: number;
  checkout_message?: any;
  checkout_datetime: string;
  checkin_ip: string;
  checkout_ip: string;
  correction_request: number;
  correction_request_message?: any;
  checkin_datetime_request: string;
  checkout_datetime_request: string;
  correction_status: string;
  checked_by: number;
  email_status: string;
  status: string;
  status_out: string;
  company_id: number;
  client_id?: any;
  location?: any;
  department?: any;
  branch?: any;
}

export interface CorrectionAttendanceModel {
  status: boolean;
  data: CorrectionAttendance[];
  count: number;
}
