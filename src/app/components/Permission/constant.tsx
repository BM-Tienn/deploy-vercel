export interface PermissionData {
  assets: PermissionItem[];
  documents: PermissionItem[];
  objects: PermissionItem[];
  others: PermissionItem[];
}

export interface PermissionItem {
  id?: string | number;
  path?: string;
  listing?: boolean;
  view?: boolean;
  save?: boolean;
  publish?: boolean;
  unpublish?: boolean;
  delete?: boolean;
  rename?: boolean;
  create?: boolean;
  setting?: boolean;
  versions?: boolean;
}
