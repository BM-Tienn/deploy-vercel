import { SetStateAction, useEffect, useState } from 'react';
import { Button, Flex } from 'antd';
import { LayoutTables } from './components/LayoutTables';
import { useDispatch } from 'react-redux';
import { usePermissionsSlice } from 'app/components/Permission/slice';
import {
  PermissionData,
  PermissionItem,
} from 'app/components/Permission/constant';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { getAllData } from 'services/settingApi';

export interface PermissionProps {
  data: PermissionData;
}

export function Permission({ data }: PermissionProps) {
  const { actions } = usePermissionsSlice();
  const dispatch = useDispatch();

  const [assets, setAssets] = useState<PermissionItem[]>([]);
  const [documents, setDocuments] = useState<PermissionItem[]>([]);
  const [objects, setObjects] = useState<PermissionItem[]>([]);
  const [others, setOthers] = useState<PermissionItem[]>([]);
  const [dataSelect, setDataSelect] = useState<any>({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllData();
        if (data.data) {
          setDataSelect(data.data);
        }
      } catch ({ response }: any) {
        getMessage(response?.data);
      }
    })();
  }, [actions, dispatch]);

  useEffect(() => {
    if (dataSelect?.assets) {
      dispatch(actions.initAssetsConfig({ data: dataSelect.assets }));
    }
    if (dataSelect?.documents) {
      dispatch(actions.initDocumentsConfig({ data: dataSelect.documents }));
    }
    if (dataSelect?.others) {
      dispatch(actions.initOthersConfig({ data: dataSelect.others }));
    }
  }, [actions, dataSelect, dispatch]);

  useEffect(() => {
    if (data?.assets) {
      setAssets(data.assets);
      dispatch(actions.updateAssets({ data: data.assets }));
    }
    if (data?.documents) {
      setDocuments(data.documents);
      dispatch(actions.updateDocuments({ data: data.documents }));
    }
    if (data?.objects) {
      setObjects(data.objects);
      dispatch(actions.updateObjects({ data: data.objects }));
    }
    if (data?.others) {
      setOthers(data.others);
      dispatch(actions.updateOthers({ data: data.others }));
    }
  }, [actions, data, dispatch]);

  const [activeTab, setActiveTab] = useState<string>('documents');
  const layoutItems = [
    {
      key: 'documents',
      label: 'Document',
      content: (
        <LayoutTables
          callback={(values: SetStateAction<PermissionItem[]>) => {
            setDocuments(values);
            dispatch(actions.updateDocuments({ data: values }));
          }}
          data={documents}
          type="documents"
        />
      ),
    },
    {
      key: 'assets',
      label: 'Asset',
      content: (
        <LayoutTables
          data={assets}
          callback={(values: SetStateAction<PermissionItem[]>) => {
            setAssets(values);
            dispatch(actions.updateAssets({ data: values }));
          }}
          type="assets"
        />
      ),
    },
    {
      key: 'objects',
      label: 'DataObject',
      content: (
        <LayoutTables
          data={objects}
          callback={(values: SetStateAction<PermissionItem[]>) => {
            setObjects(values);
            dispatch(actions.updateObjects({ data: values }));
          }}
          type="objects"
        />
      ),
    },

    {
      key: 'other',
      label: 'Other',
      content: (
        <LayoutTables
          data={others}
          callback={(values: SetStateAction<PermissionItem[]>) => {
            setOthers(values);
            dispatch(actions.updateOthers({ data: values }));
          }}
          type="others"
        />
      ),
    },
  ];

  return (
    <>
      <Flex className="relative mx-5 w-fit mt-5 p-1 items-center gap-2 bg-white rounded-xl border border-[#DAD9D9]">
        {layoutItems.map(tab => (
          <Button
            key={tab.key}
            className={`rounded-lg text-base capitalize h-8 px-4 font-medium ${
              activeTab === tab.key
                ? 'bg-[#EFE7F3] text-[#6A1B9A]'
                : 'text-[#919EAB]'
            }`}
            type="text"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </Flex>
      <div className="w-full px-5 pt-5 pb-3 overflow-hidden">
        <Flex gap={24} className="w-full h-full overflow-hidden">
          <Flex vertical className="flex-1 h-full rounded-[12px] overflow-auto">
            {layoutItems.map(tab => (
              <div
                key={tab.key}
                style={{
                  display: activeTab === tab.key ? 'block' : 'none',
                  width: '100%',
                  height: '100%',
                }}
              >
                {tab.content}
              </div>
            ))}
          </Flex>
        </Flex>
      </div>
    </>
  );
}
