// import { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { CreateFolder } from './CreateFolder';
import { Flex } from 'antd';
import { PermissionItem } from 'app/components/Permission/constant';
import { useSelector } from 'react-redux';
import { globalIsAdmin } from 'app/slice/selector';

interface FolderTreeProps {
  selectedFolder: number;
  setSelectedFolder: (folderId: number) => void;
  onLoadData: (node: { key: number }) => Promise<any>;
  treeData: any[];
  setPage: (page: number) => void;
  permission?: PermissionItem;
}

export function FolderTree({
  selectedFolder,
  setSelectedFolder,
  onLoadData,
  treeData,
  setPage,
  permission,
}: FolderTreeProps) {
  const isAdmin = useSelector(globalIsAdmin);
  return (
    <Flex
      vertical
      gap={8}
      className="w-[200px] bg-white px-4 py-2 border-r border-slate-200 overflow-hidden"
    >
      {(isAdmin || permission?.create) && (
        <CreateFolder
          onLoadData={() => onLoadData({ key: selectedFolder })}
          selectedFolder={selectedFolder}
        />
      )}
      <Tree
        defaultExpandedKeys={[1]}
        defaultSelectedKeys={[1]}
        selectedKeys={[selectedFolder]}
        onSelect={selectedKeys => {
          setPage(1);
          setSelectedFolder(Number(selectedKeys[0]));
        }}
        showIcon={true}
        className="h-full overflow-x-hidden overflow-y-auto [&_.ant-tree-node-content-wrapper]:flex  [&_.ant-tree-title]:text-nowrap"
        loadData={onLoadData}
        treeData={treeData}
      />
    </Flex>
  );
}
