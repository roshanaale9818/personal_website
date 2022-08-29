export interface DownloadPayrollCSV{
  access_token?: string,
  limit?: number,
  page?: number,
  sortnane?: string,
  sortno?: number,
  company_id?: number,
  period_id?: number,
  search?: {
    staff_id?: number,
    status?: number
  }

}
