import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { PermissionData } from 'app/components/Permission/constant';

export const hasPermission = (
  permissionData: PermissionData = {
    assets: [],
    documents: [],
    objects: [],
    others: [],
  },
  type: 'documents' | 'objects' | 'assets' | 'others' = 'others',
  key: string | number = '',
  action: string = '',
) => {
  if (!permissionData || !type || !key || !action) return false;
  const permission = permissionData?.[type]?.find(item => item.path === key);

  return permission ? permission[action] : false;
};

export const filterPermission = (
  permissionData: PermissionData = {
    assets: [],
    documents: [],
    objects: [],
    others: [],
  },
  type: 'documents' | 'objects' | 'assets' | 'others' = 'others',
  key: string | number = '',
) => {
  if (!permissionData || !type || !key) return permissionDefault;
  const permission = permissionData?.[type]?.find(
    item => String(item.path) === String(key),
  );

  return permission || permissionDefault;
};
