export interface SearchAuditLog{
    access_token: string,
    limit: number,
    page: number,
    sortnane: string,
    sortno: number,
    company_id: number,
    search: {
      user_id: string,
      module: string,
      description: string
    }

}
