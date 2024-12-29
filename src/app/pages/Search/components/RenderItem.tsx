import {
  AntDesignOutlined,
  BookOutlined,
  CloseCircleOutlined,
  CodeSandboxOutlined,
  FileImageOutlined,
  FileMarkdownOutlined,
  FilePdfOutlined,
  FolderOutlined,
  LinkOutlined,
  LogoutOutlined,
  MailOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  SnippetsOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Button, List, Flex } from 'antd';
import { globalActions } from 'app/slice';
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOutAPI } from 'services/accountApi';
import { removeCookie } from 'utils/cookies';
import { objectType, Token } from 'utils/types/const';

export interface RenderItemProps {
  item: any;
  setHistoryLocal: React.Dispatch<React.SetStateAction<objectType>>;
  onClose?: () => void;
}

const RenderItem: React.FC<RenderItemProps> = React.memo(
  ({ item, setHistoryLocal, onClose }) => {
    const corepulseRoot = process.env.REACT_APP_SUB_DIR;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const iconMap = useMemo(
      () => ({
        user: <UserOutlined />,
        undefined: <QuestionCircleOutlined />,
        create: <PlusCircleOutlined />,
        folder: <FolderOutlined />,
        image: <FileImageOutlined />,
        video: <VideoCameraOutlined />,
        pdf: <FilePdfOutlined />,
        setting: <SettingOutlined />,
        file: <FileMarkdownOutlined />,
        email: <MailOutlined />,
        object: <CloseCircleOutlined />,
        logout: <LogoutOutlined />,
        dataObject: <CodeSandboxOutlined />,
        document: <BookOutlined />,
        page: <BookOutlined />,
        snippet: <SnippetsOutlined />,
        link: <LinkOutlined />,
      }),
      [],
    );

    const renderAvatar = useCallback(
      (type: string | number) => {
        return <Avatar icon={iconMap[type] || <AntDesignOutlined />} />;
      },
      [iconMap],
    );

    const handleNavigate = (onClose: (() => void) | undefined) => {
      setHistoryLocal(item);

      if (item.route && item.route === '/logout') {
        const logout = async () => {
          await logOutAPI();
          removeCookie(Token);
          dispatch(globalActions.clearData());
        };
        logout();
      } else if (item.route) {
        navigate(`${corepulseRoot}${item.route}`);
      } else {
        navigate(`${corepulseRoot}/${item.name}/detail?id=${item.id}`);
      }
      if (onClose) onClose();
    };

    return (
      <Flex
        justify="between"
        align="center"
        className="group w-full"
        onClick={() => handleNavigate(onClose)}
      >
        <List.Item.Meta
          avatar={renderAvatar(item.model)}
          title={<div className="--title">{item.title || item.name}</div>}
          description={<div className="text-sm">{item.path}</div>}
        />
        <Button
          type="primary"
          size="small"
          onClick={() => handleNavigate(onClose)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Enter
        </Button>
      </Flex>
    );
  },
);

export default RenderItem;
