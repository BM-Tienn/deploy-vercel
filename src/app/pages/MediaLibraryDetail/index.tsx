import { useEffect, useState } from 'react';
import { MediaLibraryDetailWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Header } from './components/Header';
import { Content } from './components/Content';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { mediaGetDetailApi, mediaPermissionApi } from 'services/mediaApi';
import { permissionDefault } from 'app/components/Permission/components/LayoutTables';
import { PermissionItem } from 'app/components/Permission/constant';
import { globalPermissionData, globalIsAdmin } from 'app/slice/selector';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import QueryString from 'qs';

export interface MediaLibraryDetailProps {}

export function MediaLibraryDetail(props: MediaLibraryDetailProps) {
  const navigate = useNavigate();
  const corepulseRoot = process.env.REACT_APP_SUB_DIR;
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [permission, setPermission] =
    useState<PermissionItem>(permissionDefault);
  const permissionData = useSelector(globalPermissionData);
  const isAdmin = useSelector(globalIsAdmin);
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      const getPermission = async () => {
        try {
          const { data } = await mediaPermissionApi(
            QueryString.stringify({ id }),
          );
          if (data?.data?.permission) setPermission(data?.data?.permission);
        } catch ({ response }: any) {}
      };
      getPermission();
    }
  }, [id, permissionData]);

  useEffect(() => {
    if (isAdmin || permission?.view) {
      (async () => {
        setLoading(true);
        try {
          const { data } = await mediaGetDetailApi(id);
          if (data.data) {
            setData(data.data);
          }
        } catch ({ response }: any) {
          getMessage(response?.data);
          navigate(`${corepulseRoot}/media-library`);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [corepulseRoot, id, isAdmin, navigate, permission?.view]);

  return (
    <MediaLibraryDetailWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>{t('media_library.detail.meta_title')}</title>
      </Helmet>
      {!loading && (
        <Header
          id={id}
          dataParent={data}
          loading={loading}
          permission={permission}
          isAdmin={isAdmin}
          globalData={data}
        />
      )}
      <Content
        loading={loading}
        data={data}
        permission={permission}
        isAdmin={isAdmin}
      />
    </MediaLibraryDetailWrapper>
  );
}
