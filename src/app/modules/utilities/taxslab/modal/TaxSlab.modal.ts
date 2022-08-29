export class TaxSlab{
  access_token: string;
  tax_slab_id: string | number;
  annual_income: string;
  type: string;
  married: string;
  tax_rate:number;
  valid_from: string;
  valid_to: string;
  company_id: number;
  employee_group_id:number | string;
  employee_group_name:string;
}
