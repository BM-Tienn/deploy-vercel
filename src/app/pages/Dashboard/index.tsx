import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardWrapper } from './styled';
import { Helmet } from 'react-helmet-async';
import { Button, Card, Flex, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { CreateModal } from './components/CreateModal';
import openNotificationWithIcon from 'app/functions/openNotificationWithIcon';
import { objectCreate } from 'services/objectApi';
import QueryString from 'qs';
import { getChartData } from 'services/dashboardApi';
import { LineChart } from 'app/components/Chart/LineChart';
import { LatestChangeTable } from './components/LatestChangeTable';
import {
  UserMultiple02Icon,
  File01Icon,
  Image01Icon,
  CubeIcon,
} from 'hugeicons-react';

export interface DashboardProps {}
export interface ObjectProps {}
type MenuItem = Required<MenuProps>['items'][number];

export function Dashboard(_props: DashboardProps) {
  const corepulseRoot = process.env.REACT_APP_SUB_DIR;
  const navigate = useNavigate();
  const [data, setData] = useState<MenuItem[]>();
  const [dashboardData, setDashboardData] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ObjectProps | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getChartData();
        if (data) {
          setDashboardData(data.data);
        }
      } catch ({ response }: any) {}
    })();
  }, []);

  useEffect(() => {
    if (dashboardData?.classes) {
      const items: MenuItem[] =
        dashboardData.classes?.map(obj => ({
          label: obj.title || obj.name,
          key: obj.id,
        })) || [];
      setData(items);
    }
  }, [dashboardData]);

  const handleEditClick = (record: ObjectProps) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleFormSubmit = async (updatedData: ObjectProps) => {
    try {
      const { data } = await objectCreate(
        QueryString.stringify({
          classId: updatedData['classId'],
          key: updatedData['key'],
          checked: true,
        }),
      );

      if (data?.data?.success) {
        navigate(
          `${corepulseRoot}/${data.data.classId}/detail?id=${data.data.id}`,
        );
      }

      openNotificationWithIcon(
        data?.data?.success ? 'success' : 'error',
        '',
        data?.data?.message,
      );
      setIsModalVisible(false);
      setSelectedRecord(null);
    } catch ({ response }: any) {
      openNotificationWithIcon(
        'error',
        '',
        response.data.errors
          ? response.data.errors?.key + ' ' + response.data.errors?.message
          : '',
      );
    }
  };

  return (
    <DashboardWrapper className="flex flex-col gap-4 p-5 overflow-x-hidden bg-slate-100">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Flex gap={20}>
        <Card className="w-[75%] overflow-hidden">
          <Flex gap={40}>
            <Flex vertical gap={20}>
              <span className="text-2xl font-semibold">
                Welcome back 👋
                <br />
                <span className="text-purple-700">[User Name]</span>
              </span>
              <div className="mb-4">
                You are in the Dashboard of{' '}
                <span className="font-semibold">[Website Name]</span>. You can
                manage all the content here. Click on the button below to learn
                the tutorial.
              </div>
              <Flex gap={8}>
                <Button type="primary" className="w-max">
                  Learn more
                </Button>
                <Dropdown
                  menu={{ items: data, onClick: handleEditClick }}
                  trigger={['click']}
                >
                  <Button className="create-content-menu w-max">
                    Create Content
                  </Button>
                </Dropdown>
              </Flex>
            </Flex>
            <img
              className="w-80 mr-[-25px]"
              src="https://stf-wp-media.s3.ap-southeast-1.amazonaws.com/panoee_com/wp-content/uploads/2024/01/08171752/5241364-1-e1704734172754-700x716.png"
              alt=""
            />
          </Flex>
        </Card>
        {/* <Card className="w-[25%]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="56"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d="M4 22h16" opacity=".5" />
              <path d="m14.63 2.921l-.742.742l-6.817 6.817c-.462.462-.693.692-.891.947a5.24 5.24 0 0 0-.599.969c-.139.291-.242.601-.449 1.22l-.875 2.626l-.213.641a.848.848 0 0 0 1.073 1.073l.641-.213l2.625-.875c.62-.207.93-.31 1.221-.45a5.19 5.19 0 0 0 .969-.598c.255-.199.485-.43.947-.891l6.817-6.817l.742-.742a3.146 3.146 0 0 0-4.45-4.449Z" />
              <path
                d="M13.888 3.664S13.98 5.24 15.37 6.63c1.39 1.39 2.966 1.483 2.966 1.483m-12.579 9.63l-1.5-1.5"
                opacity=".5"
              />
            </g>
          </svg>
          <Flex vertical justify="flex-start">
            <Flex>
              <h2>Quick Actions</h2>
            </Flex>
          </Flex>
        </Card> */}
      </Flex>
      <Flex gap={20}>
        <Card className="flex-1">
          <Flex gap={20}>
            <UserMultiple02Icon size={42} strokeWidth={1.5} />
            <Flex vertical gap={4}>
              <span className="text-lg text-slate-500">Users</span>
              <span className="text-2xl font-semibold">
                {dashboardData?.totalUser}
              </span>
            </Flex>
          </Flex>
        </Card>
        <Card className="flex-1">
          <Flex gap={20}>
            <CubeIcon size={42} strokeWidth={1.5} />
            <Flex vertical gap={4}>
              <span className="text-lg text-slate-500">Objects</span>
              <span className="text-2xl font-semibold">
                {dashboardData?.totalObject}
              </span>
            </Flex>
          </Flex>
        </Card>
        <Card className="flex-1">
          <Flex gap={20}>
            <Image01Icon size={42} strokeWidth={1.5} />
            <Flex vertical gap={4}>
              <span className="text-lg text-slate-500">Assets</span>
              <span className="text-2xl font-semibold">
                {dashboardData?.totalAsset}
              </span>
            </Flex>
          </Flex>
        </Card>
        <Card className="flex-1">
          <Flex gap={20}>
            <File01Icon size={42} strokeWidth={1.5} />
            <Flex vertical gap={4}>
              <span className="text-lg text-slate-500">Documents</span>
              <span className="text-2xl font-semibold">
                {dashboardData?.totalDoc}
              </span>
            </Flex>
          </Flex>
        </Card>
      </Flex>
      <Flex gap={20}>
        <Card className="flex-1">
          <Flex vertical>
            <span className="text-lg font-semibold mb-4">
              Changes in 1 month
            </span>
            <div className="flex-1 overflow-hidden">
              <LineChart chartData={dashboardData?.chartData} />
            </div>
          </Flex>
        </Card>
        <Card className="flex-1">
          <Flex vertical>
            <span className="text-lg font-semibold mb-4">Total Objects</span>
            <LatestChangeTable
              data={dashboardData?.listing}
            ></LatestChangeTable>
          </Flex>
        </Card>
      </Flex>

      {selectedRecord && (
        <CreateModal
          open={isModalVisible}
          onCancel={handleModalClose}
          dataItem={selectedRecord}
          onSubmit={handleFormSubmit}
        />
      )}
    </DashboardWrapper>
  );
}
