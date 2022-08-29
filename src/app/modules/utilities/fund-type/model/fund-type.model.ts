export interface FundType {
  fund_id: number;
  title: string;
  details: string;
  status: string;
  company_id: number;
}

export interface FundTypeRootObject {
  status: boolean;
  data: FundType[];
  detail: string;
  count: number;
}
