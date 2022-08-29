export class CompanyModel {
  company_name: string;
  address: string;
  email: string;
  phone: string;
  remarks: string;
  status: string;
  subdomain: string;
}

export interface Data {
  company_name: string;
  address: string;
  email: string;
  phone: string;
  remarks: string;
  created_date: string;
  created_by?: any;
  updated_date: string;
  updated_by?: any;
  status: string;
  subdomain: string;
  company_id: number;
}

export interface AppAccessToken {
  project: string;
  token: number;
  details: string;
  status: string;
  app_access_id: number;
}

export interface RegisterUserModel {
  status: boolean;
  data: Data;
  app_access_token: AppAccessToken;
  staff_id: number;
}

export interface Project {
  app_access_id: number;
  token: string;
  project: string;
  status: string;
  details: string;
}

export interface Comapny {
  company_id: number;
  company_name: string;
  address: string;
  email: string;
  phone: number;
  remarks: string;
  created_by?: any;
  updated_by?: any;
  created_date: string;
  updated_date: string;
  status: number;
  subdomain: string;
}

export interface Logo {
  id: number;
  company_logo: string;
  company_id: number;
  code: string;
}

export interface AppAccessRootModel {
  status: boolean;
  response: string;
  project: Project;
  comapny: Comapny;
  logo: Logo;
}
