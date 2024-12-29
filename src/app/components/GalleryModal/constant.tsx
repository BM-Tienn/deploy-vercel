import { DataNode } from 'antd/es/tree';
import { Skeleton } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

export const initTreeData: DataNode[] = [
  {
    title: 'Home',
    key: 1,
    icon: <HomeOutlined></HomeOutlined>,
  },
];

export const updateTreeData = (
  list: DataNode[],
  key: React.Key,
  children: DataNode[],
): DataNode[] =>
  list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        isLeaf: false,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        isLeaf: false,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

export const loadingMedia = Array.from(Array(12).keys()).map((_, index) => (
  <div key={index} className="w-[calc((100%-4rem)/5)] h-[140px]">
    <Skeleton.Image active className="!w-full !h-full" />
  </div>
));
