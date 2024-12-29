import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton, Flex } from 'antd';
import { CheckmarkCircle04Icon, ArrowLeft01Icon } from 'hugeicons-react';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { EditableText } from 'app/components/EditableText';
import { pageDelete, pagePostDetailApi } from 'services/pagesApi';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import QueryString from 'qs';
import { PermissionItem } from 'app/components/Permission/constant';
import { corepulseRoot } from 'app/routesConfig';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { pageDetailDataEdit } from '../slice/selector';

export interface HeaderProps {
  id: string | null;
  loading: boolean;
  dataParent: any;
  onSaveComplete: Function;
  permission?: PermissionItem;
  isAdmin?: boolean;
}

export function Header({
  id,
  loading,
  dataParent,
  onSaveComplete,
  permission,
  isAdmin,
}: HeaderProps) {
  const navigate = useNavigate();
  const [published, setPublished] = useState(dataParent?.sidebar.published);
  const { t } = useTranslation();
  const globalData = useSelector(pageDetailDataEdit);

  const save = async (publish = 'draft') => {
    try {
      const formData = new FormData();
      console.log(globalData);
      formData.append('data', JSON.stringify(globalData));
      if (publish) formData.append('_publish', publish);

      const { data } = await pagePostDetailApi(id, formData);
      getMessage(data);

      if (data.data.success) {
        setPublished(
          publish === 'publish' ? t('pages.publish') : t('pages.unpublish'),
        );
        onSaveComplete();
      }
    } catch (response) {
      getMessage(response);
    }
  };

  const editKey = async (value: any) => {
    try {
      const formData = new FormData();
      formData.append('key', value);
      const { data } = await pagePostDetailApi(id, formData);
      getMessage(data);
    } catch (response) {
      getMessage(response);
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
            {(isAdmin || permission?.rename) && (
              <Button
                onClick={() => navigate(`${corepulseRoot}/pages`)}
                type="text"
                icon={<ArrowLeft01Icon size={16} strokeWidth={2} />}
              />
            )}
            {Number(id) !== 1 && (isAdmin || permission?.rename) ? (
              <EditableText
                initialValue={dataParent?.sidebar.key}
                onSave={editKey}
              />
            ) : (
              <span className="font-semibold text-lg cursor-pointer">
                {Number(id) === 1 ? 'Home' : dataParent?.sidebar.key}
              </span>
            )}
          </Flex>
          {published === 'Publish' ? (
            <div className="w-2 h-2 rounded-full bg-[#4CAF50] shadow-[0_0_4px_rgba(76,175,80,0.5)]" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-[#af4c4c] shadow-[0_0_4px_rgba(175,76,76,0.5)]" />
          )}
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
            <Button onClick={() => save('publish')} type="primary">
              <CheckmarkCircle04Icon size={16} strokeWidth={2} />
              {t('pages.publish')}
            </Button>
          )}
          {(isAdmin || permission?.unpublish) && (
            <Button onClick={() => save('unpublish')}>
              {t('pages.unpublish')}
            </Button>
          )}
          {(isAdmin || permission?.save) && (
            <Button onClick={() => save('draft')}>
              {t('pages.save_draft')}
            </Button>
          )}

          {(isAdmin || permission?.delete) && (
            <ConfirmDeleteModal
              title={t('pages.delete.title')}
              question={t('pages.delete.description')}
              message={t('pages.delete.message')}
              action={async () => {
                const { data } = await pageDelete(
                  QueryString.stringify({ id: id }),
                );
                getMessage(data);
                if (data.data.success) navigate(`${corepulseRoot}/pages`);
              }}
              multiple
            />
          )}
        </Flex>
      )}
    </Flex>
  );
}
