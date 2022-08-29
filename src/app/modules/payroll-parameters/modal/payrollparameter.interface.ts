export interface PayrollParameter {
    access_token?: string,
    title?: number,
    type?: string,
    month_day?: number,
    week_day?: string,
    select_day?: number,
    select_month?: string,
    user_id?: number,
    company_id?: number,
    parameter_id?:number
}
export interface RemovePayrollParameter {
    access_token: string,
    parameter_id: number

}

export interface SearchPayrollParameter{
    access_token?: string,
    limit?: number,
    page?: number,
    sortnane?: string,
    sortno?: number,
    company_id?: number,
    search?: {
      type: string
    }

}
