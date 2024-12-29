import { useEffect, useState } from 'react';
import { RoleDetailWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Header } from './components/Header';
import { Content } from './components/Content';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { roleGetDetailApi } from 'services/roleApi';
import { useTranslation } from 'react-i18next';
import { corepulseRoot } from 'app/routesConfig';

export interface RoleDetailProps {}

export function RoleDetail(props: RoleDetailProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [roleData, setRoleData] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await roleGetDetailApi(id);
        if (data.data) {
          setData(data.data);
          if (data.data?.role) {
            setRoleData(data.data.role);
          }
        }
      } catch ({ response }: any) {
        getMessage(response?.data);
        navigate(`${corepulseRoot}/role`);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleEdit = values => {
    setRoleData(values);
  };
  return (
    <RoleDetailWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>{t('role.create')}</title>
      </Helmet>
      {!loading && <Header id={id} dataParent={roleData} loading={loading} />}
      <Content loading={loading} data={data} callback={handleEdit} />
    </RoleDetailWrapper>
  );
}
