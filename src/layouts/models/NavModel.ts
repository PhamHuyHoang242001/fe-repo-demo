export interface NavItem {
  name: string;
  url: string;
  isEnable?: boolean;
  isShow?: boolean;
  icon?: JSX.Element | string;
  children?: Array<any>;
  id?: number;
}
