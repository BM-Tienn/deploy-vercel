import React from 'react';
import { FileItems } from 'app/components/GalleryModal/components/FileItems';
import { Flex, Pagination } from 'antd';
import { Asset } from 'utils/types/const';
import { loadingMedia } from 'app/components/GalleryModal/constant';
import { useNavigate } from 'react-router-dom';
import { cn } from 'utils/tailwind';
import { useSelector } from 'react-redux';
import { globalIsAdmin } from 'app/slice/selector';
import { corepulseRoot } from 'app/routesConfig';

export interface GridViewProps {
  loading: boolean;
  fileList: {
    data: Asset[];
    paginationData?: {
      current: number;
      numItemsPerPage: number;
      totalCount: number;
    };
  };
  selectedFiles: Asset[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<Asset[]>>;
  setFileList: React.Dispatch<
    React.SetStateAction<{ data: Asset[]; paginationData?: any }>
  >;
  setSelectedFolder: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

export const GridView: React.FC<GridViewProps> = ({
  loading,
  fileList,
  selectedFiles,
  setSelectedFiles,
  setFileList,
  setSelectedFolder,
  setPage,
  setLimit,
}) => {
  const navigate = useNavigate();
  const isAdmin = useSelector(globalIsAdmin);

  return (
    <>
      <div className="grid grid-cols-6 gap-2 flex-1 overflow-auto">
        {!loading &&
          fileList?.data?.map((file, index) => {
            const permissionItem = file?.permissions;
            if (isAdmin || permissionItem?.listing) {
              return (
                <FileItems
                  key={index}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  setFileList={setFileList}
                  file={file}
                  multiple={false}
                  onClick={file => {
                    if (file.type !== 'folder') {
                      navigate(
                        `${corepulseRoot}/media-library/detail?id=${file.id}`,
                      );
                    } else {
                      setSelectedFolder(file.id);
                    }
                  }}
                  permission={permissionItem}
                />
              );
            } else {
              return (
                <Flex
                  key={file.id}
                  vertical
                  gap={8}
                  className={cn(
                    'h-[140px] p-2 rounded-[8px] overflow-hidden relative border cursor-pointer',
                  )}
                >
                  <Flex
                    align="center"
                    justify="center"
                    className="flex-1 w-full overflow-hidden"
                  >
                    <img
                      className="w-full h-full object-contain"
                      alt="Access Denied"
                    />
                  </Flex>
                  <span className="w-full h-max flex-none overflow-hidden text-nowrap text-ellipsis text-sm font-semibold">
                    {file.filename}
                  </span>
                </Flex>
              );
            }
          })}
        {loading && loadingMedia}
      </div>
      <Pagination
        disabled={loading}
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
    </>
  );
};
