import { Button, Input, Modal, Pagination } from 'antd';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { FolderOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Flex } from 'antd';

import { addPropsToChildren } from 'utils/hooks/appPropsTochild';
import { getFolderDetailApi, getTreeApi } from 'services/mediaApi';
import QueryString from 'qs';
import useDebounce from 'utils/hooks/usedebounce';
import { Asset, PagginationType } from 'utils/types/const';
import {
  initTreeData,
  loadingMedia,
  updateTreeData,
} from 'app/components/GalleryModal/constant';
import { FileItems } from 'app/components/GalleryModal/components/FileItems';
import { FolderTree } from 'app/components/GalleryModal/components/FolderTree';
import { UploadBtn } from 'app/components/GalleryModal/components/UploadBtn';
import { useTranslation } from 'react-i18next';

export interface GalleryModalProps {
  children: React.ReactNode;
  type?: 'image' | 'video' | 'document' | 'audio' | 'text' | 'archive';
  setSelectedFiles: Function;
  selectedFiles: Asset[];
  multiple?: boolean;
  open?: boolean;
  setOpen?: Function;
}
export interface DataNode {
  title: string;
  key: number;
  isLeaf?: boolean;
  children?: DataNode[];
  icon?: any;
}

export function GalleryModal({
  type,
  setSelectedFiles,
  selectedFiles,
  multiple,
  open: propOpen,
  setOpen: propSetOpen,
  children,
}: GalleryModalProps) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);
  // Determine if the modal is controlled
  const isControlled =
    typeof propOpen === 'boolean' && typeof propSetOpen === 'function';
  const open = isControlled ? propOpen : internalOpen;
  const setOpen = isControlled ? propSetOpen! : setInternalOpen;
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [fileList, setFileList] = useState<{
    data: Asset[];
    paginationData?: PagginationType;
  }>({ data: [] });
  const [selectedFolder, setSelectedFolder] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const [treeData, setTreeData] = useState(initTreeData);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { data: res } = await getFolderDetailApi(
          QueryString.stringify({
            id: selectedFolder,
            search,
            page,
            limit,
            type,
          }),
        );

        const data = res.data;
        if (data) {
          setFileList(data);
          setLoading(false);
        }
      } catch ({ response }: any) {
        getMessage(response);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFolder, page, limit, count, useDebounce(search, 500)]);

  const onLoadData = async ({ key, children }: any) => {
    try {
      const { data: res } = await getTreeApi(
        QueryString.stringify({ id: key }),
      );
      const { data } = res.data;

      if (data) {
        const children = data.map(folder => {
          const output = {
            key: folder.id,
            title: folder.filename,
            isLeaf: !folder.children.length,
            icon: <FolderOutlined />,
          };
          return output;
        });
        setTreeData(origin => updateTreeData(origin, key, children));

        return;
      }
    } catch ({ response }: any) {
      getMessage(response);
      return;
    }
  };

  return (
    <>
      {addPropsToChildren(children, { onClick: () => setOpen(true) })}
      <Modal
        className="[&_*.ant-modal-content]:p-0 [&_*.ant-modal-content]:overflow-hidden"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        afterOpenChange={() => {
          setSearch('');
          setSelectedFolder(1);
          setPage(1);
          setLimit(25);
        }}
        destroyOnClose={true}
        centered
        width="fit-content"
        closable={false}
        footer={null}
        title={null}
      >
        <Flex
          vertical
          gap={0}
          className="w-[90vw] h-max min-h-[240px] max-h-[90vh]"
        >
          <span className="text-slate-500 py-3 px-5 font-semibold text-lg border-b !border border-slate-200">
            {t('media_library.modal.title')}
          </span>
          <Flex className="flex-1 overflow-hidden">
            <FolderTree
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              onLoadData={onLoadData}
              treeData={treeData}
              setPage={setPage}
            />
            <Flex vertical gap={8} className="flex-1 py-2 px-4">
              <Flex gap={8} className="flex-none h-max">
                <UploadBtn
                  updateFolder={() => {
                    setSearch('');
                    setPage(1);
                    setCount(prv => prv + 1);
                  }}
                  selectedFolder={selectedFolder}
                />
                <Input
                  className="flex-1"
                  allowClear
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                ></Input>
              </Flex>
              <div className="grid grid-cols-6 gap-2 flex-1 overflow-auto">
                {!loading &&
                  fileList?.data?.map((file, index) => (
                    <FileItems
                      key={index}
                      selectedFiles={selectedFiles}
                      setSelectedFiles={setSelectedFiles}
                      setFileList={setFileList}
                      file={file}
                      multiple={multiple}
                      onClick={file => {
                        if (
                          selectedFiles?.some(sFile => sFile.id === file.id)
                        ) {
                          const output = selectedFiles?.filter(
                            sFile => sFile.id !== file.id,
                          );
                          setSelectedFiles(output);
                        } else {
                          if (multiple) {
                            setSelectedFiles([...selectedFiles, file]);
                          } else {
                            setSelectedFiles([file]);
                          }
                        }
                      }}
                    />
                  ))}
                {loading && loadingMedia}
              </div>
              <Pagination
                disabled={loading}
                className=""
                align="end"
                showSizeChanger
                current={fileList.paginationData?.current ?? 1}
                pageSize={fileList.paginationData?.numItemsPerPage ?? 20}
                onChange={(page, pageSize) => {
                  setPage(page);
                  setLimit(pageSize);
                }}
                total={fileList?.paginationData?.totalCount ?? 20}
              />
            </Flex>
          </Flex>
          <Flex gap={8} justify="end" className="h-max px-5 py-3 bg-slate-100">
            <Button
              onClick={() => setOpen(false)}
              htmlType="submit"
              type="primary"
            >
              {t('media_library.modal.submit')}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
