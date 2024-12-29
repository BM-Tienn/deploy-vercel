import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { seoMonitorDetail } from 'services/seoHttpApi';
import QueryString from 'qs';
import { useTranslation } from 'react-i18next';

export interface MonitorModalProps {
  modalTitle?: string;
  open: boolean;
  onClose: () => void;
  dataModal?: any;
}

export function MonitorModal({
  modalTitle,
  open,
  onClose,
  dataModal,
}: MonitorModalProps) {
  const [data, setData] = useState<any>(dataModal);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await seoMonitorDetail(
        QueryString.stringify({ id: dataModal.id }),
      );
      if (data?.data) {
        setData(data.data);
      }
    };
    fetchData();
  }, [dataModal]);

  return (
    <Modal
      className="[&_*.ant-modal-content]:p-0 [&_*.ant-modal-content]:overflow-hidden"
      open={open}
      onCancel={onClose}
      destroyOnClose={true}
      centered
      width={700}
      closable={false}
      footer={null}
      title={null}
    >
      <h3 className="py-4 px-6 font-extrabold leading-[22.4px]">
        {modalTitle}
      </h3>
      <div className="flex flex-col px-6 pb-2">
        {data?.parametersGet?.length > 0 && (
          <div>
            <h3 className="font-extrabold">
              {t('indexing.modal.parameters_get')}
            </h3>
            <ul
              className="list-disc pl-4 overflow-y-auto"
              style={{ maxHeight: '300px' }}
            >
              {Object.entries(data.parametersGet).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value?.toString() || 'N/A'}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data?.parametersPost?.length > 0 && (
          <div>
            <h3 className="font-extrabold">
              {t('indexing.modal.parameters_post')}
            </h3>
            <ul
              className="list-disc pl-4 overflow-y-auto"
              style={{ maxHeight: '300px' }}
            >
              {Object.entries(data.parametersPost).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value?.toString() || 'N/A'}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data?.cookies && (
          <div>
            <h3 className="font-extrabold">{t('indexing.modal.cookies')}</h3>
            <ul
              className="list-disc pl-4 overflow-y-auto"
              style={{ maxHeight: '300px' }}
            >
              {Object.entries(data.cookies).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value?.toString() || 'N/A'}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data?.serverVars && (
          <div>
            <h3 className="font-extrabold">
              {t('indexing.modal.server_variables')}
            </h3>
            <ul
              className="list-disc pl-4 overflow-y-auto"
              style={{ maxHeight: '300px' }}
            >
              {Object.entries(data.serverVars).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value?.toString() || 'N/A'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="px-6 flex gap-2 py-3 bg-[#F4F6F8]">
        <Button
          onClick={onClose}
          className="px-3.5 flex items-center gap-3.5 bg-[#919EAB] font-bold capitalize rounded-[0.5rem]"
        >
          <i className="fa-solid fa-rotate"></i>
          <span className="text-[13px]">{t('indexing.modal.close')}</span>
        </Button>
      </div>
    </Modal>
  );
}
