import React, { useEffect, useState, useCallback } from 'react';
import { Flex } from 'antd';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { FolderOutlined } from '@ant-design/icons';
import { MediaLibraryWrapper } from './styled';
import { getFolderDetailApi, getTreeApi } from 'services/mediaApi';
import QueryString from 'qs';
import useDebounce from 'utils/hooks/usedebounce';
import { Asset, PagginationType } from 'utils/types/const';
import {
  initTreeData,
  updateTreeData,
} from 'app/components/GalleryModal/constant';
import { FolderTree } from 'app/components/GalleryModal/components/FolderTree';
import { Header } from './components/Header';
import { GridView } from './components/Grid';
import { AssetTables } from './components/AssetTables';
import { columnView } from './constant';
import { globalPermissionData } from 'app/slice/selector';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { useSelector } from 'react-redux';
import { PermissionItem } from 'app/components/Permission/constant';
import { filterPermission } from 'app/functions/hasPermission';
import { useTranslation } from 'react-i18next';

export interface MediaLibraryProps {}

export function MediaLibrary(props: MediaLibraryProps) {
  const { t } = useTranslation();
  const [display, setDisplay] = useState<'table' | 'grid'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);
  const [treeData, setTreeData] = useState(initTreeData);
  const [fileList, setFileList] = useState<{
    data: Asset[];
    paginationData?: PagginationType;
  }>({ data: [] });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [view, setView] = useState(columnView);
  const [filterObj, setFilterObj] = useState<{
    filterRule: 'and' | 'or';
    filter: any[];
  }>({ filterRule: 'and', filter: [] });
  const [sort, setSort] = useState<{
    type: string;
    order: 'asc' | 'desc';
  }>({
    type: '',
    order: 'asc',
  });
  const [permission, setPermission] =
    useState<PermissionItem>(permissionDefault);
  const permissionData = useSelector(globalPermissionData);

  const fetchFileList = useCallback(async () => {
    if (!selectedFolder || isNaN(selectedFolder)) return;

    setLoading(true);
    const permissionItem = filterPermission(
      permissionData,
      'assets',
      selectedFolder,
    );

    if (permissionItem) setPermission(permissionItem);

    try {
      const { data: res } = await getFolderDetailApi(
        QueryString.stringify({
          id: selectedFolder,
          search,
          page,
          limit,
          checked: true,
          order_by: sort.type,
          order: sort.order,
          ...filterObj,
        }),
      );

      const data = res.data;
      if (data) {
        setFileList(data);
      }
    } catch ({ response }: any) {
      getMessage(response);
    } finally {
      setLoading(false);
    }
  }, [
    selectedFolder,
    search,
    page,
    limit,
    sort.type,
    sort.order,
    filterObj,
    permissionData,
  ]);

  useEffect(() => {
    fetchFileList();
  }, [
    selectedFolder,
    page,
    limit,
    count,
    sort,
    filterObj.filterRule,
    filterObj.filter,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useDebounce(search, 500),
    fetchFileList,
  ]);

  const onLoadData = async ({ key }: any) => {
    try {
      const { data: res } = await getTreeApi(
        QueryString.stringify({ id: key }),
      );
      const { data } = res.data;

      if (data) {
        const children = data.map(
          (folder: { id: any; filename: any; children: string | any[] }) => ({
            key: folder.id,
            title: folder.filename,
            isLeaf: !folder.children.length,
            icon: <FolderOutlined />,
          }),
        );
        setTreeData(origin => updateTreeData(origin, key, children));
      }
    } catch ({ response }: any) {
      getMessage(response);
    }
  };

  return (
    <MediaLibraryWrapper>
      <Flex
        vertical
        gap={0}
        className="w-[85vw] h-max min-h-[240px] max-h-[90vh]"
      >
        <span className="text-slate-500 py-3 px-5 font-semibold text-lg">
          {t('media_library.title')}
        </span>
        <Flex className="flex-1 overflow-hidden">
          <FolderTree
            selectedFolder={selectedFolder}
            setSelectedFolder={id => {
              if (!isNaN(id)) setSelectedFolder(id);
            }}
            onLoadData={onLoadData}
            treeData={treeData}
            setPage={setPage}
            permission={permission}
          />
          <Flex vertical gap={8} className="flex-1 py-2 px-4">
            <Header
              updateFolder={() => {
                setSearch('');
                setPage(1);
                setCount(prv => prv + 1);
              }}
              selectedFolder={selectedFolder}
              display={display}
              setDisplay={setDisplay}
              view={view}
              setView={setView}
              sort={sort}
              setSort={setSort}
              filterObj={filterObj}
              setFilterObj={setFilterObj}
              permission={permission}
            />
            {display === 'table' && (
              <AssetTables
                view={view}
                loading={loading}
                setPage={setPage}
                setLimit={setLimit}
                pagination={fileList?.paginationData}
                data={fileList?.data}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                fetchFileList={fetchFileList}
                setSelectedFolder={setSelectedFolder}
              />
            )}
            {display === 'grid' && (
              <GridView
                loading={loading}
                fileList={fileList}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                setFileList={setFileList}
                setSelectedFolder={setSelectedFolder}
                setPage={setPage}
                setLimit={setLimit}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </MediaLibraryWrapper>
  );
}
