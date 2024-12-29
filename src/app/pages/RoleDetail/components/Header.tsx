import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton, Flex } from 'antd';
import { CheckmarkCircle04Icon, ArrowLeft01Icon } from 'hugeicons-react';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import QueryString from 'qs';
import { useSelector } from 'react-redux';
import { roleDelete, rolePostDetailApi } from 'services/roleApi';
import {
  permissionsDocuments,
  permissionsAssets,
  permissionsObjects,
  permissionsOthers,
} from 'app/components/Permission/slice/selector';
import usePermission from 'utils/hooks/usePermission';
import { useTranslation } from 'react-i18next';

export interface HeaderProps {
  id: string | null;
  loading: boolean;
  dataParent: any;
}

export function Header({ id, loading, dataParent }: HeaderProps) {
  const navigate = useNavigate();
  const corepulseRoot = process.env.REACT_APP_SUB_DIR;
  const [name] = useState<string>(dataParent?.name);
  const documents = useSelector(permissionsDocuments);
  const assets = useSelector(permissionsAssets);
  const objects = useSelector(permissionsObjects);
  const others = useSelector(permissionsOthers);
  const isSave = usePermission('others', 'role', 'save');
  const isDelete = usePermission('others', 'role', 'delete');
  const { t } = useTranslation();

  const save = async () => {
    try {
      const formData = new FormData();

      if (documents?.length)
        formData.append('documents', JSON.stringify(documents));
      if (assets?.length) formData.append('assets', JSON.stringify(assets));
      if (objects?.length) formData.append('objects', JSON.stringify(objects));
      if (others?.length) formData.append('others', JSON.stringify(others));
      if (dataParent) formData.append('setting', JSON.stringify(dataParent));

      const { data } = await rolePostDetailApi(id, formData);
      getMessage(data);
    } catch (response) {
      getMessage(response.data);
    }
  };

  return (
    <Flex align="center" justify="space-between" className="px-5 py-2 w-full">
      {loading ? (
        <Flex vertical gap={2} className="h-[89px]">
          <Flex gap={2} className="w-[130px]">
            <Skeleton.Button active size="small" block shape="round" />{' '}
            <Skeleton.Button active size="small" block shape="round" />
          </Flex>
          <Skeleton.Button active size="small" block shape="round" />
          <Skeleton.Button active size="small" block shape="round" />
        </Flex>
      ) : (
        <Flex align="center" gap={8}>
          <Flex align="center" gap={8}>
            <Button
              onClick={() => navigate(`${corepulseRoot}/role`)}
              type="text"
              icon={<ArrowLeft01Icon size={16} strokeWidth={2} />}
            />
            <span className="font-semibold text-lg cursor-pointer">{name}</span>
          </Flex>
        </Flex>
      )}
      {loading ? (
        <div className="flex items-center gap-2 w-[450px]">
          <Skeleton.Button active block shape="round" />
          <Skeleton.Button active block shape="round" />
          <Skeleton.Button active block shape="round" />
          <Skeleton.Button active block shape="round" />
        </div>
      ) : (
        <Flex gap={8} align="center">
          {isSave && (
            <Button onClick={() => save()} type="primary">
              <CheckmarkCircle04Icon size={16} strokeWidth={2} />
              {t('role.save')}
            </Button>
          )}
          {isDelete && (
            <ConfirmDeleteModal
              title={t('role.delete.title')}
              question={t('role.delete.description')}
              message={t('role.delete.message')}
              action={async () => {
                try {
                  const { data } = await roleDelete(
                    QueryString.stringify({ id: id }),
                  );
                  getMessage(data);
                  if (data.data.success) navigate(`${corepulseRoot}/role`);
                } catch ({ response }: any) {
                  getMessage(response?.data);
                }
              }}
              multiple
            />
          )}
        </Flex>
      )}
    </Flex>
  );
}
