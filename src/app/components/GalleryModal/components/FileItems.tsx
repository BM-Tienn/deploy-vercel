import { Button, Dropdown, MenuProps, Popconfirm, Tooltip, Flex } from 'antd';
import { PermissionItem } from 'app/components/Permission/constant';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { globalIsAdmin } from 'app/slice/selector';
import QueryString from 'qs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { deleteMediaFile } from 'services/mediaApi';
import { cn } from 'utils/tailwind';
import { Asset } from 'utils/types/const';

export interface FileItemsProps {
  file: Asset;
  setFileList: Function;
  setSelectedFiles: Function;
  selectedFiles: Asset[];
  multiple?: boolean;
  onClick?: (file: Asset) => void;
  permission?: PermissionItem;
}

export function FileItems({
  file,
  setFileList,
  selectedFiles,
  setSelectedFiles,
  multiple,
  onClick,
  permission,
}: FileItemsProps) {
  const [loading, setLoading] = useState(false);
  const isAdmin = useSelector(globalIsAdmin);
  const { t } = useTranslation();

  const items: MenuProps['items'] = [
    {
      label:
        isAdmin || permission?.delete ? (
          <Popconfirm
            title={t('media_library.delete.title')}
            description={t('media_library.delete.description')}
            onConfirm={async () => {
              setLoading(true);
              try {
                const res = await deleteMediaFile(
                  QueryString.stringify({ id: file.id }),
                );
                if (res) {
                  setLoading(false);
                  setFileList(prv => ({
                    ...prv,
                    data: prv.data.filter(data => data.id !== file.id),
                  }));
                  return;
                }
              } catch ({ response }: any) {
                getMessage(response);
                return;
              }
            }}
            okText={t('media_library.delete.submit')}
            cancelText={t('media_library.delete.cancel')}
          >
            <Button danger>{t('media_library.delete.name')}</Button>
          </Popconfirm>
        ) : (
          <></>
        ),
      className: '!p-0',
      key: '1',
    },
  ];

  const handleClick = () => {
    if (isAdmin || permission?.view) {
      onClick?.(file);
    }
  };

  return (
    <Tooltip placement="bottom" title={file.filename}>
      <Dropdown menu={{ items }} trigger={['contextMenu']}>
        <Flex
          onClick={handleClick}
          vertical
          gap={8}
          className={cn(
            'h-[140px] p-2 rounded-[8px] overflow-hidden relative border cursor-pointer',
            selectedFiles.some(sFile => sFile.id === file.id) && 'bg-blue-100',
          )}
        >
          <Flex
            align="center"
            justify="center"
            className="flex-1 w-full overflow-hidden"
          >
            {file.type === 'image' && (
              <img
                className="w-full h-full object-contain"
                src={file.thumbnail || file.fullPath}
                alt={file.path}
              />
            )}

            {file.type === 'video' && (
              <i className="text-7xl fa-regular fa-file-video" />
            )}
            {file.type === 'document' && (
              <i className="text-7xl fa-regular fa-file-word" />
            )}
            {file.type === 'audio' && (
              <i className="text-7xl fa-regular fa-file-audio" />
            )}
            {file.type === 'text' && (
              <i className="text-7xl fa-regular fa-file-text" />
            )}
            {file.type === 'archive' && (
              <i className="text-7xl fa-regular fa-file-zipper" />
            )}
            {file.type === 'folder' && (
              <i
                className="text-7xl fa-solid fa-folder"
                style={{ color: '#FFD43B' }}
              ></i>
            )}
          </Flex>
          <span className="w-full h-max flex-none overflow-hidden text-nowrap text-ellipsis text-sm font-semibold">
            {file.filename}
          </span>
          {loading && (
            <div className="w-full flex items-center justify-center top-0 left-0 absolute h-full z-10 bg-[#0000008d] text-white">
              {t('media_library.delete.loading')}
            </div>
          )}
        </Flex>
      </Dropdown>
    </Tooltip>
  );
}
