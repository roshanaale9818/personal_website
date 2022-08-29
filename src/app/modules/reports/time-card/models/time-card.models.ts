export interface AttDay {
  category: string;
  in: string;
  out: string;
  totaltime: number;
  totalhr: number;
  regular: number;
  ot1: string;
  ot2: string;
  unpaid: string;
  paidhrs: number;
  gross: number;
}

export interface AttRecord {
  date: string;
  day: string;
  hwl_status: string;
  style: string;
  att_day: AttDay;
}

export interface TimeCardReport {
  user_id: number;
  staff_id: number;
  staff_name: string;
  att_record: AttRecord[];
  grand_gross: number;
  grosshours: number;
  grossreg: number;
  grossot1: number;
  grossot2: number;
  grossunpaid: number;
  grosspaidhrs: number;
}

export interface TimeCardReportRootModel {
  status: boolean;
  data: TimeCardReport[];
}

export interface Users {
  client_staff_id: string;
  company_id: string;
  client_id: string;
  staff_id: string;
  client_department_id: string;
  client_division_id: string;
  client_location_id: string;
  role?: any;
  created_by?: any;
  created_date?: any;
  updated_by?: any;
  updated_date?: any;
  status: string;
  name: string;
  emp_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  dep_name: string;
  div_name: string;
  asloc_name: string;
  username?:string;
}

export interface UserRootObject {
  status: boolean;
  data: Users[];
  count: number;
}

declare module namespace {
  export interface AttDay {
    category: string;
    in: string;
    out: string;
    totaltime: number;
    totalhr: number;
    regular: number;
    ot1: string;
    ot2: string;
    unpaid: string;
    paidhrs: number;
    gross: number;
  }

  export interface AttRecord {
    date: string;
    day: string;
    hwl_status: string;
    style: string;
    att_day: AttDay;
  }

  export interface Datum {
    user_id: number;
    username: string;
    staff_id: number;
    staff_name: string;
    clientstaffdepartment?: any;
    full_name: string;
    emp_id: string;
    att_record: AttRecord[];
    grand_gross: number;
    grosshours: number;
    grossreg: number;
    grossot1: number;
    grossot2: number;
    grossunpaid: number;
    grosspaidhrs: number;
  }

  export interface RootObject {
    status: boolean;
    data: Datum[];
  }
}
