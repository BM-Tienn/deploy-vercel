import { Button, FormInstance, Skeleton, Flex } from 'antd';
import { ObjectLayout, SideBarData } from '../constant';
import { objectDeleteApi, objectPostDetailsApi } from 'services/objectApi';
import { CheckmarkCircle04Icon, ArrowLeft01Icon } from 'hugeicons-react';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { useNavigate } from 'react-router-dom';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import QueryString from 'qs';
import _ from 'lodash';
import { EditableText } from 'app/components/EditableText';
import { useState } from 'react';
import { PermissionItem } from 'app/components/Permission/constant';
import { useTranslation } from 'react-i18next';

export interface HeaderProps {
  id?: string | null;
  loading: boolean;
  data?: {
    layout: ObjectLayout;
    sidebar: SideBarData;
  };
  globalForm: FormInstance;
  locale: string | undefined;
  object: string | undefined;
  permission: PermissionItem;
  isAdmin?: boolean;
}

export function Header({
  id,
  loading,
  data,
  globalForm,
  locale,
  object,
  permission,
  isAdmin,
}: HeaderProps) {
  const navigate = useNavigate();
  const corepulseRoot = process.env.REACT_APP_SUB_DIR;
  const [published, setPublished] = useState(data?.sidebar.published);
  const { t } = useTranslation();

  const save = async (publish = true) => {
    try {
      const formData = new FormData();
      const convertValue = _.mapValues(
        globalForm.getFieldsValue(true),
        (value: any) => value ?? null,
      );
      formData.append('data', JSON.stringify(convertValue));
      if (locale) formData.append('_locale', locale);
      if (publish) formData.append('_publish', 'publish');

      const { data } = await objectPostDetailsApi(id, formData);
      getMessage(data);

      if (data.data.success && publish) setPublished('Publish');
      if (data.data.success && !publish) setPublished('Unpublish');
    } catch ({ response }) {
      getMessage(response?.data);
    }
  };

  const editKey = async (value: any) => {
    try {
      const formData = new FormData();
      const convertValue = { key: value };
      formData.append('data', JSON.stringify(convertValue));
      if (locale) formData.append('_locale', locale);
      const { data } = await objectPostDetailsApi(id, formData);
      getMessage(data);
    } catch ({ response }) {
      getMessage(response?.data);
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
            {(isAdmin || permission?.listing) && (
              <Button
                onClick={() => navigate(`${corepulseRoot}/${object}`)}
                type="text"
                icon={<ArrowLeft01Icon size={16} strokeWidth={2} />}
              />
            )}
            {isAdmin || permission?.rename ? (
              <EditableText initialValue={data?.sidebar.key} onSave={editKey} />
            ) : (
              <span className="font-semibold text-lg cursor-pointer">
                {data?.sidebar.key}
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
            <Button onClick={() => save()} type="primary">
              <CheckmarkCircle04Icon size={16} strokeWidth={2} />
              {t('object.publish')}
            </Button>
          )}
          {(isAdmin || permission?.unpublish) && (
            <Button onClick={() => save(false)}>{t('object.unpublish')}</Button>
          )}
          {(isAdmin || permission?.delete) && (
            <ConfirmDeleteModal
              title={t('object.delete.title')}
              question={t('object.delete.description')}
              message={t('object.delete.message')}
              action={async () => {
                const { data } = await objectDeleteApi(
                  QueryString.stringify({ id: id, classId: object }),
                );
                if (data) {
                  navigate(`${corepulseRoot}/${object}`);
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
