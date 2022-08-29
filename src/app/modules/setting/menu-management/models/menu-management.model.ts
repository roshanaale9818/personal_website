export interface MenuManagement {
  id?: number;
  name: string;
  parent_name?: string;
  route?: string;
  order?: number;
  data: string;
}
