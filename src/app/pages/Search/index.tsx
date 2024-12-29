// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Flex, Form, Input, InputRef, Modal, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { suggetData } from './constant';
import openNotificationWithIcon from 'app/functions/openNotificationWithIcon';
import { getSearchTypeApi } from 'services/layoutApi';
import { useSelector } from 'react-redux';
import { globalClasses } from 'app/slice/selector';
import { objectType } from 'utils/types/const';
import { CustomList } from 'app/components/CustomList';
import RenderItem from './components/RenderItem';

export interface SearchProps {
  open?: boolean;
  onClose?: () => void;
}

export function Search({ open, onClose }: SearchProps) {
  const listHeight = 400;
  const classes = useSelector(globalClasses);
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [data, setData] = useState<objectType[]>([]);
  const [historyData, setHistoryData] = useState<objectType[]>([]);
  const [historyLocal, setHistoryLocal] = useState<objectType>({});
  const searchInputRef = useRef<InputRef>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('historyData');
    if (storedHistory?.length) {
      setHistoryData(JSON.parse(storedHistory));
    }
  }, []);

  const isObjectEmpty = obj => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  useEffect(() => {
    if (historyLocal) {
      const updatedHistoryData = [historyLocal, ...historyData];
      const uniqueHistoryData = updatedHistoryData.filter(
        (item, index, self) =>
          index ===
          self.findIndex(t => t.id === item.id && t.name === item.name),
      );

      if (
        !(
          uniqueHistoryData.length === 0 ||
          uniqueHistoryData.every(isObjectEmpty)
        )
      ) {
        setHistoryData(uniqueHistoryData);
        localStorage.setItem('historyData', JSON.stringify(uniqueHistoryData));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyLocal]);

  const fetchData = async (type: string, search?: string, subType?: string) => {
    const formData = new FormData();

    formData.append('type', type);
    if (search) formData.append('search', search);
    if (subType) formData.append('subType', subType);
    formData.append('limit', '100');

    try {
      const { data } = await getSearchTypeApi(formData);

      if (data.data?.paginationData?.totalCount) {
        return data.data.data;
      }
      return [];
    } catch (err) {
      console.error(
        `Error fetching data for type: ${type}, subType: ${subType}`,
        err,
      );
      return [];
    }
  };

  const handleFinish = async (values: { search: string }) => {
    setIsSearch(true);
    setData([]);
    setLoading(true);

    const suggetSearchData = suggetData.filter(item =>
      item.title?.toLowerCase().includes(values.search.toLowerCase()),
    );
    setData(prevData => [...prevData, ...suggetSearchData]);

    const assetData = await fetchData('asset', values.search);
    setData(prevData => [...prevData, ...assetData]);

    const documentData = await fetchData('document', values.search);
    setData(prevData => [...prevData, ...documentData]);

    if (classes?.length) {
      const queue = [...classes];
      const batchSize = 3;

      try {
        for (let i = 0; i < queue.length; i += batchSize) {
          const batch = queue.slice(i, i + batchSize);
          const batchResults = await Promise.allSettled(
            batch.map(async item => {
              return fetchData('dataObject', values.search, item.name);
            }),
          );

          const filteredResults = batchResults
            .filter(
              (result): result is PromiseFulfilledResult<any> =>
                result.status === 'fulfilled' && result.value,
            )
            .map(result => result.value);

          setData(prevData => [...prevData, ...filteredResults.flat()]);
        }
      } catch (error) {
        console.error('Error during batch API calls:', error);
        openNotificationWithIcon('error', 'API Error', 'Could not fetch data.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus({
          cursor: 'start',
        });
      }, 100);
    }
  }, [open]);
  return (
    <Modal
      className="quickSearchModal [&_*.ant-modal-content]:p-0 [&_*.ant-modal-content]:overflow-hidde"
      open={open}
      onCancel={onClose}
      destroyOnClose={true}
      centered
      width={1000}
      closable={false}
      title={''}
      footer={''}
    >
      <Form
        form={form}
        onValuesChange={value => {
          if (!value.search) setIsSearch(false);
          else handleFinish(value);
        }}
        onFinish={handleFinish}
        className="w-full p-6"
      >
        <Form.Item name="search" className="m-0">
          <Input ref={searchInputRef} placeholder="search" />
        </Form.Item>
      </Form>

      {isSearch ? (
        <>
          <CustomList
            className="px-6 bg-slate-50 border-t border-slate-200"
            data={data}
            itemKeyPrefix="search"
            renderItem={item => (
              <RenderItem
                item={item}
                setHistoryLocal={setHistoryLocal}
                onClose={onClose}
              />
            )}
          />
          {loading && (
            <Flex align="center" justify="center">
              <Spin size="large" />
            </Flex>
          )}
        </>
      ) : (
        <Flex
          gap={16}
          className="bg-slate-50 border-t border-slate-200 rounded-b-lg px-6"
        >
          <CustomList
            height={listHeight}
            data={suggetData}
            className="flex-1"
            header="Suggestions"
            itemKeyPrefix="sugget"
            renderItem={item => (
              <RenderItem
                item={item}
                setHistoryLocal={setHistoryLocal}
                onClose={onClose}
              />
            )}
          />
          <CustomList
            height={listHeight}
            data={historyData}
            className="w-[320px] flex-none border-l border-slate-200 pl-6"
            header="Recent"
            itemKeyPrefix="recent"
            renderItem={item => (
              <RenderItem
                item={item}
                setHistoryLocal={setHistoryLocal}
                onClose={onClose}
              />
            )}
          />
        </Flex>
      )}
    </Modal>
  );
}
