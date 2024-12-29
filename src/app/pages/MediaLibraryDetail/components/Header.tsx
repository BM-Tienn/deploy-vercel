// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton, Flex } from 'antd';
import { CheckmarkCircle04Icon, ArrowLeft01Icon } from 'hugeicons-react';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { EditableText } from 'app/components/EditableText';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import QueryString from 'qs';
import { corepulseRoot } from 'app/routesConfig';
import { PermissionItem } from 'app/components/Permission/constant';
import { useTranslation } from 'react-i18next';
import { mediaDelete, mediaPostDetailApi } from 'services/mediaApi';
import { selectMetaData } from '../slice/selector';
import { useSelector } from 'react-redux';

export interface HeaderProps {
  id: string | null;
  loading: boolean;
  dataParent: any;
  globalData: any;
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function Header({
  id,
  loading,
  dataParent,
  globalData,
  permission,
  isAdmin,
}: HeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const metaData = useSelector(selectMetaData);
  const [key, setKey] = useState<string>(dataParent?.sidebar.filename);
  const [loadKey, setLoadKey] = useState<boolean>(false);

  const save = async () => {
    try {
      const formData = new FormData();
      formData.append('metaData', JSON.stringify(metaData));

      const { data } = await mediaPostDetailApi(id, formData);
      getMessage(data);
    } catch ({ response }) {
      getMessage(response);
    }
  };

  const editKey = async (value: any) => {
    setLoadKey(true);
    try {
      const formData = new FormData();
      formData.append('rename', 'true');
      formData.append('filename', value);
      const { data } = await mediaPostDetailApi(id, formData);
      if (data?.data.success) {
        setKey(value);
      } else {
        setKey(dataParent?.sidebar.filename);
      }
      getMessage(data);
    } catch ({ response }) {
      getMessage(response);
      setKey(dataParent?.sidebar.filename);
    } finally {
      setLoadKey(false);
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
              onClick={() => navigate(`${corepulseRoot}/media-library`)}
              type="text"
              icon={<ArrowLeft01Icon size={16} strokeWidth={2} />}
            />
            {(isAdmin || permission?.rename) && !loadKey ? (
              <EditableText initialValue={key} onSave={editKey} />
            ) : (
              <span className="font-semibold text-lg cursor-pointer">
                {key}
              </span>
            )}
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
          {(isAdmin || permission?.publish) && (
            <Button onClick={() => save()} type="primary">
              <CheckmarkCircle04Icon size={16} strokeWidth={2} />
              {t('media_library.save')}
            </Button>
          )}

          {(isAdmin || permission?.delete) && (
            <ConfirmDeleteModal
              title={t('media_library.delete.title')}
              question={t('media_library.delete.description')}
              message={t('media_library.delete.message')}
              action={async () => {
                const { data } = await mediaDelete(
                  QueryString.stringify({ id: id }),
                );
                getMessage(data);
                if (data.data.success)
                  navigate(`${corepulseRoot}/media-library`);
              }}
              multiple
            />
          )}
        </Flex>
      )}
    </Flex>
  );
}
