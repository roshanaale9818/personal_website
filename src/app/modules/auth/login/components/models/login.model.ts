export interface Staff {
  staff_id: number;
  first_name: string;
  last_name: string;
  staff_photo: string;
  mobile: string;
  phone: string;
  email_address: string;
  temporary_address_id: number;
  permanent_address_id: number;
  citizenship_no: string;
  gender: string;
  marital_status: string;
  hire_date: string;
  expiry_date: string;
  employee_type: string;
  salary_period: string;
  payment_type: string;
  designation_id: number;
  department_id: number;
  manager_id: number;
  normal_salary_rate: number;
  overtime_salary_rate: number;
  mobile_code: number;
  phone_code: number;
  remarks: string;
  status?: any;
  salary_duration: string;
  middle_name: string;
  cit: number;
  tax_included: string;
  remaining_leave_days: string;
  emp_id: string;
  checkinRestrictiontime: string;
  dob: string;
  location?: any;
  division?: any;
  company_id: number;
  pf: number;
}

export interface Staffaddressper {
  address_id: string;
  country_id: string;
  state: string;
  address_line1: string;
  address_line2: string;
  company_id: string;
  city: string;
  zip_code: string;
  iso: string;
  name: string;
  country_name: string;
  iso3: string;
  numcode: string;
  phone_code: string;
}

export interface Client {
  client_id: string;
  company_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country_id?: any;
  post_code: string;
  created_by?: any;
  created_date: string;
  updated_by?: any;
  updated_date: string;
  status?: any;
  client_branch_id: string;
  client_location_id: string;
  client_staff_id: string;
  staff_id: string;
  client_department_id: string;
  client_division_id?: any;
  role: string;
}

export interface Timezone {
  id: number;
  title: string;
  code: string;
  value: string;
  description?: any;
  company_id: number;
}

export interface Dateformat {
  id: number;
  title: string;
  code: string;
  value: string;
  description?: any;
  company_id: number;
}

export interface Login {
  staff: Staff;
  staffaddressper: Staffaddressper[];
  staffaddresstmp: any[];
  designation?: any;
  client: Client[];
  access_token: string;
  id: number;
  access_level: number;
  timezone: Timezone;
  dateformat: Dateformat;
  identity: string;
}
