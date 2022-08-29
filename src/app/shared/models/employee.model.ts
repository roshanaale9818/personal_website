export interface Employee {
  null?: string;
  full_name: string;
  user_id: string;
  username: string;
  staff_id: string;
  emp_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  company_id: string;
}

export interface EmployeeRootObject {
  status: boolean;
  data: Employee[];
  count: string;
}
