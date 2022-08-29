export interface SearchPayrollPeriod{
  access_token?: string,
  limit?: number,
  page?: number,
  sortnane?: string,
  sortno?: number,
  company_id?: number,
  search?: {
    group_type: string,
    date_from: string,
    date_to: string
  }
}

export interface AddPayrollPeriod{
    access_token: string,
    group_type: number,
    date_from: string,
    date_to: string,
    date_type: string,
    user_id: number,
    company_id: number,
    period_id?:number
}
