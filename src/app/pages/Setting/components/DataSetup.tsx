// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { Flex, Button, Space } from 'antd';
import { SettingTables } from './SettingTables';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SETTING_GET_LIST, useSettingSlice } from '../slice';
import { updateSettingObject } from 'services/settingApi';
import QueryString from 'qs';
import {
  settingList,
  settingLoading,
  settingPagination,
} from '../slice/selector';
import openNotificationWithIcon from 'app/functions/openNotificationWithIcon';

export interface DataSetupProps {
  activeTab: string;
  setActiveTab: (key: string) => void;
}

export function DataSetup({ setActiveTab }: DataSetupProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { actions } = useSettingSlice();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<
    {
      [key: string]: boolean;
    }[]
  >([{ name: true }, { title: true }, { checked: true }]);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const loading = useSelector(settingLoading);
  const pagination = useSelector(settingPagination);
  const data = useSelector(settingList);

  const dispatch = useDispatch();
  const { object } = useParams();

  useEffect(() => {
    dispatch(
      SETTING_GET_LIST({
        params: {
          id: object,
          page,
          limit,
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, object]);

  const settingObjectAction = async (publish: string) => {
    const { data } = await updateSettingObject(
      QueryString.stringify({
        publish: publish,
        params: selectedRowKeys,
      }),
    );
    if (data) {
      openNotificationWithIcon(
        data?.data?.success ? 'success' : 'error',
        '',
        data?.data?.message,
      );

      setSelectedRowKeys([]);
      dispatch(
        SETTING_GET_LIST({
          params: {
            id: object,
            page,
            limit,
          },
        }),
      );
    }
  };

  return (
    <Flex vertical gap={16} className="--wrapper">
      {!!selectedRowKeys.length && (
        <Flex
          className="batchUpdate px-5 py-3 w-full bg-slate-50 p-2 rounded-[8px]"
          justify="space-between"
          align="center"
        >
          <span>{selectedRowKeys.length} Selected</span>
          <Space>
            <Button
              type="primary"
              onClick={() => settingObjectAction('publish')}
            >
              Publish
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => settingObjectAction('unpublish')}
            >
              Unpublish
            </Button>
          </Space>
        </Flex>
      )}
      <div className="p-4 rounded-[12px] shadow-[0px_0px_2px_0px_rgba(145,158,171,0.25),0px_10px_40px_-4px_rgba(145,158,171,0.15)]">
        <SettingTables
          setPage={setPage}
          setLimit={setLimit}
          pagination={pagination}
          view={view}
          loading={loading}
          data={data}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </div>
    </Flex>
  );
}
