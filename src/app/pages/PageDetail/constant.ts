export interface EditData {
  id: string | number;
  data: any;
  action: string;
}

export interface EditItem {
  id: string;
  name: string;
  realName: string;
  config: any;
  data: any;
  type: string;
  inherited: boolean;
  inDialogBox: any;
  convertData: any;
}

export interface BlockConfig {
  limit?: number;
  template?: ConfigTemplate;
}

export interface ConfigTemplate {
  editables: EditItem[];
  html: any;
}
