export interface PayrollGenerate{
  access_token: string;
  period_id: number;
  limit?: number,
  page?: number,
  sortnane?: string,
  sortno?: number,
  company_id: number
}
