import { useSelector } from 'react-redux';
import { globalIsAdmin, globalPermissionData } from 'app/slice/selector';
import { hasPermission } from 'app/functions/hasPermission';

const usePermission = (
  type: 'documents' | 'objects' | 'assets' | 'others',
  key: string | number = '',
  action: string = '',
) => {
  const permissionData = useSelector(globalPermissionData);
  const isAdmin = useSelector(globalIsAdmin);

  return isAdmin || hasPermission(permissionData, type, key, action);
};

export default usePermission;
