export interface AuditLog {
  auditlog_id: number;
  company_id: number;
  computer_name: string;
  datetime: string;
  description: string;
  ip_address: string;
  module: string;
  type: string;
  user: string;
  user_id: number;
}
