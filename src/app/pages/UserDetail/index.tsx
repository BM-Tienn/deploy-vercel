// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { UserDetailWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Header } from './components/Header';
import { Content } from './components/Content';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { userGetDetailApi } from 'services/userApi';

export interface UserDetailProps {}

export function UserDetail(props: UserDetailProps) {
  const navigate = useNavigate();
  const corepulseRoot = process.env.REACT_APP_SUB_DIR;
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [userData, setUserData] = useState();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await userGetDetailApi(id);
        if (data.data) {
          setData(data.data);
          if (data.data?.user) {
            setUserData(data.data.user);
          }
        }
      } catch ({ response }: any) {
        getMessage(response?.data);
        navigate(`${corepulseRoot}/user`);
      } finally {
        setLoading(false);
      }
    })();
  }, [corepulseRoot, id, navigate]);

  const handleEdit = values => {
    setUserData(values);
  };
  return (
    <UserDetailWrapper className="flex gap-3 flex-col w-5/6">
      <Helmet>
        <title>User</title>
      </Helmet>
      {!loading && <Header id={id} dataParent={userData} loading={loading} />}
      <Content loading={loading} data={data} callback={handleEdit} />
    </UserDetailWrapper>
  );
}
