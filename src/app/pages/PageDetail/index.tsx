import { useEffect, useState, useRef } from 'react';
import { PageDetailWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Token } from 'utils/types/const';
import { getCookie } from 'utils/cookies';
import { Edit } from './components/Edit';
import { EditData } from './constant';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { pageGetDetailApi } from 'services/pagesApi';
import { Header } from './components/Header';
import { Content } from './components/Content';
import { filterPermission } from 'app/functions/hasPermission';
import { globalPermissionData, globalIsAdmin } from 'app/slice/selector';
import { useDispatch, useSelector } from 'react-redux';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { PermissionItem } from 'app/components/Permission/constant';
import { useTranslation } from 'react-i18next';
import { corepulseRoot } from 'app/routesConfig';
import { usePageDetailSlice } from './slice';

export const mapConfig = (dataList: any, values: any, key = 'name') => {
  return dataList.map(item => {
    if (values[item[key]] !== undefined) {
      return {
        ...item,
        data: values[item[key]],
      };
    }
    return item;
  });
};

export const useIframeMessenger = (
  iframeRef: React.RefObject<HTMLIFrameElement>,
  origin: string,
) => {
  const sendMessage = (data: any) => {
    iframeRef.current?.contentWindow?.postMessage(data, origin);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [origin]);

  return sendMessage;
};

export interface PageDetailProps {}

export function PageDetail(props: PageDetailProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = usePageDetailSlice();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const id = searchParams.get('id');
  const token = getCookie(Token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<EditData | undefined>(undefined);
  const [data, setData] = useState<any>(undefined);
  const [iframeSrc, setIframeSrc] = useState<string>(
    `${process.env.REACT_APP_API_URL}/corepulse/cms/api/document/edit-mode?id=${id}&cms_editmode=true&CMS-TOKEN=${token}`,
  );
  const [permission, setPermission] =
    useState<PermissionItem>(permissionDefault);
  const permissionData = useSelector(globalPermissionData);
  const isAdmin = useSelector(globalIsAdmin);

  useEffect(() => {
    if (id) {
      const permissionItem = filterPermission(permissionData, 'documents', id);
      if (permissionItem) setPermission(permissionItem);
    }
  }, [id, permissionData]);

  useEffect(() => {
    if (id && (isAdmin || permission?.view)) {
      (async () => {
        setLoading(true);
        try {
          const { data } = await pageGetDetailApi(id);
          if (data.data) {
            setData(data.data);
          }
        } catch ({ response }: any) {
          getMessage(response);
          navigate(`${corepulseRoot}/pages`);
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAdmin, permission]);

  const handleSaveComplete = () => {
    setData(undefined);
    setIframeSrc(
      prevSrc => `${prevSrc.split('&timestamp=')[0]}&timestamp=${Date.now()}`,
    );
  };

  const sendMessage = useIframeMessenger(
    iframeRef,
    process.env.REACT_APP_API_URL || '',
  );

  const handleDataChange = (updatedData: any) => {
    sendMessage({ action: 'update', ...updatedData });
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== process.env.REACT_APP_API_URL) return;

      const { action, data, id } = event.data;

      if (action === 'error') {
        getMessage(data);
        setLoading(false);
      }
      if (action === 'initConfig') {
        const initConfig = mapConfig(data.config, data.dataDocument);

        dispatch(actions.setInitialData(initConfig));
      }
      if (action === 'openModal' && id) {
        setEditData(event.data);
        setIsModalOpen(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [actions, dispatch]);

  return (
    <PageDetailWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>{t('pages.detail.meta_title')}</title>
      </Helmet>
      <Header
        id={id}
        dataParent={data}
        loading={loading}
        onSaveComplete={handleSaveComplete}
        permission={permission}
        isAdmin={isAdmin}
      />
      <Content
        loading={loading}
        data={data}
        callback={values => {
          setData(prevData => ({
            ...prevData,
            data: values,
          }));
        }}
        iframeRef={iframeRef}
        iframeSrc={iframeSrc}
        permission={permission}
        isAdmin={isAdmin}
      />
      {editData && (
        <Edit
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          id={id || ''}
          editId={editData.id}
          data={editData.data}
          handleUpdate={handleDataChange}
        />
      )}
    </PageDetailWrapper>
  );
}
