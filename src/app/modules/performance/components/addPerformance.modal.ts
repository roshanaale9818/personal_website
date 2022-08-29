export interface AddPerformance{
    company_id:number,
    user_id: number,
    from_date:string,
    to_date:string
}

export interface GetPerformanceBody{
    company_id:number,
    limit:number,
    page:number,
    sortno:number,
    sortnane:string,
    search:{
        user_id: string,
        year: string,
        month: string
      }
}
