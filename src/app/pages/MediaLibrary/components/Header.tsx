// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';
import { TableOutlined } from '@ant-design/icons';
import { Button, Flex, Radio, Space } from 'antd';
import { UploadBtn } from 'app/components/GalleryModal/components/UploadBtn';
import { SortFilter } from 'app/components/SortFilter';
import { TypeFilter } from 'app/components/TypeFilter';
import { ViewFilter } from 'app/components/ViewFIlter';
import { FileDownloadIcon } from 'hugeicons-react';
import { PermissionItem } from 'app/components/Permission/constant';
import { useSelector } from 'react-redux';
import { globalIsAdmin } from 'app/slice/selector';
import { useTranslation } from 'react-i18next';

export interface HeaderProps {
  updateFolder: () => void;
  selectedFolder: number;
  display: 'table' | 'grid';
  setDisplay: Function;
  setView: Function;
  setSort: Function;
  setFilterObj: Function;
  view: {
    [key: string]: boolean;
  }[];
  filterObj: {
    filterRule: 'and' | 'or';
    filter: any[];
  };
  sort: {
    type: string;
    order: 'asc' | 'desc';
  };
  permission: PermissionItem;
}

export function Header({
  updateFolder,
  selectedFolder,
  display,
  setDisplay,
  sort,
  setSort,
  view,
  setView,
  filterObj,
  setFilterObj,
  permission,
}: HeaderProps) {
  const isAdmin = useSelector(globalIsAdmin);
  const { t } = useTranslation();
  return (
    <Flex gap={8} className="flex-none h-max" justify="space-between">
      {(isAdmin || permission?.create) && (
        <UploadBtn
          updateFolder={updateFolder}
          selectedFolder={selectedFolder}
        />
      )}
      <Flex gap="middle" align="center" justify="end" className="w-full">
        <Flex>{t('media_library.display')}</Flex>
        <Radio.Group
          defaultValue={display}
          buttonStyle="solid"
          onChange={e => {
            setDisplay(e.target.value);
          }}
        >
          <Radio.Button value="grid">
            <i className="fas fa-th-large"></i>
          </Radio.Button>
          <Radio.Button value="table">
            <TableOutlined />
          </Radio.Button>
        </Radio.Group>
        {display === 'table' && (
          <Space size={16} align="center">
            <Space size={4} align="center">
              <ViewFilter list={view} setList={setView} />
              <SortFilter
                types={[
                  { value: 'id', label: 'Id' },
                  { value: 'type', label: 'Type' },
                  { value: 'filename', label: 'Filename' },
                  { value: 'path', label: 'Path' },
                ]}
                sort={sort}
                setSort={setSort}
              />
              <TypeFilter
                types={{
                  id: 'number',
                  type: 'string',
                  filename: 'string',
                  path: 'string',
                }}
                filterObj={filterObj}
                setFilterObj={setFilterObj}
              />
            </Space>
            <Button icon={<FileDownloadIcon size={16} strokeWidth={2} />}>
              {t('media_library.export')}
            </Button>
          </Space>
        )}
      </Flex>
    </Flex>
  );
}
