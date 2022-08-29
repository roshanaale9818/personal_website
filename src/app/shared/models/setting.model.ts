export interface Settings {
  setting: Setting[];
  emailsetting: EmailSetting[];
  companyrule: CompanyRule[];
}

export interface EmailSetting {
  company_id: number;
  setting_code: string;
  setting_name: string;
  setting_value: string;
}

export interface Setting {
  code: string;
  company_id: number;
  description: string;
  id: number;
  title: string;
  value: number;
}

export interface CompanyRule {
  code: string;
  company_id: number;
  rule_id: number;
  title: string;
  value: string;
}
