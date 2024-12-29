// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton, Flex } from 'antd';
import { CheckmarkCircle04Icon, ArrowLeft01Icon } from 'hugeicons-react';
import { ConfirmDeleteModal } from 'app/components/ConfirmDeleteModal';
import { pageDelete } from 'services/pagesApi';
import openNotificationWithIcon from 'app/functions/openNotificationWithIcon';
import QueryString from 'qs';
import {
  permissionsAssets,
  permissionsDocuments,
  permissionsObjects,
  permissionsOthers,
} from '../../../components/Permission/slice/selector';
import { useSelector } from 'react-redux';
import { userPostDetailApi } from 'services/userApi';

export interface HeaderProps {
  id: string | null;
  loading: boolean;
  dataParent: any;
}

export function Header({ id, loading, dataParent }: HeaderProps) {
  const navigate = useNavigate();
  const corepulseRoot = process.env.REACT_APP_SUB_DIR;
  const [active, setActive] = useState<boolean>(dataParent?.active);
  const [username] = useState<string>(dataParent?.username);
  const documents = useSelector(permissionsDocuments);
  const assets = useSelector(permissionsAssets);
  const objects = useSelector(permissionsObjects);
  const others = useSelector(permissionsOthers);

  const save = async () => {
    try {
      const formData = new FormData();

      if (documents?.length)
        formData.append('documents', JSON.stringify(documents));
      if (assets?.length) formData.append('assets', JSON.stringify(assets));
      if (objects?.length) formData.append('objects', JSON.stringify(objects));
      if (others?.length) formData.append('others', JSON.stringify(others));
      if (dataParent) formData.append('setting', JSON.stringify(dataParent));

      const { data } = await userPostDetailApi(id, formData);
      openNotificationWithIcon(
        data.data.success ? 'success' : 'error',
        '',
        data.data.message,
      );
      if (data?.data?.succes) {
        setActive(dataParent?.active);
      }
    } catch (response) {
      openNotificationWithIcon(
        'error',
        '',
        response.data.error ? response.data.error?.message : '',
      );
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
              onClick={() => navigate(`${corepulseRoot}/user`)}
              type="text"
              icon={<ArrowLeft01Icon size={16} strokeWidth={2} />}
            />
            <span className="font-semibold text-lg cursor-pointer">
              {username}
            </span>
          </Flex>
          {active ? (
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
          <Button onClick={() => save()} type="primary">
            <CheckmarkCircle04Icon size={16} strokeWidth={2} />
            Save
          </Button>
          <ConfirmDeleteModal
            title={`Delete object?`}
            question={`Are you sure you want to delete object?`}
            message={`This action cannot be undone.`}
            action={async () => {
              const { data } = await pageDelete(
                QueryString.stringify({ id: id }),
              );
              openNotificationWithIcon(
                data.data.success ? 'success' : 'error',
                '',
                data.data.message,
              );
              if (data.data.success) navigate(`${corepulseRoot}/pages`);
            }}
            multiple
          />
        </Flex>
      )}
    </Flex>
  );
}
