export interface ObjectDataType {
  bodyStyle?: string;
  border?: boolean;
  children?: ObjectDataType[]; // Mảng các phần tử con
  collapsed?: boolean;
  collapsible?: boolean;
  datatype?: string;
  fieldtype: string;
  height?: string;
  locked?: boolean;
  mandatory?: boolean;
  name?: string;
  region?: string; // Có thể là null
  tabPosition?: string;
  title?: string;
  type?: string; // Có thể là null
  width?: string;
  supportedTypes?: string[];
  api_options?: {
    value: { class: string; id: string } | undefined;
    class: string;
    id: string;
  };
  layouts?: { [key: string]: ObjectDataType };
}
export interface ObjectLayout extends ObjectDataType {
  icon?: string; // Có thể là chuỗi hoặc null
  labelAlign?: 'left' | 'right' | 'center'; // labelAlign có thể có giá trị là "left", "right" hoặc "center"
  labelWidth?: number; // labelWidth là một số nguyên (thường đại diện cho độ rộng tính bằng pixel)
  layout?: string; // layout có thể là chuỗi hoặc null
}
export interface SideBarData {
  creationDate?: string;
  id: number;
  key?: string;
  modificationDate?: string;
  path?: string;
  published?: string;
  languages?: Language[];
}

export interface Language {
  key: string;
  value: string;
  selected: boolean;
}
