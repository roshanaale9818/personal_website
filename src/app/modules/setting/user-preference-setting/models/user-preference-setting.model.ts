export interface UserPreference {
  id: number;
  title: string;
  code: string;
  value: string;
  description: string;
}

export interface UserPreferenceRootObject {
  status: boolean;
  data: UserPreference[];
  count: number;
}
