import React, { useState } from 'react';
import { Button, Modal, Flex, Space } from 'antd';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { Delete01Icon } from 'hugeicons-react';
import { useTranslation } from 'react-i18next';

export interface ConfirmDeleteModalProps {
  title: string;
  question: string;
  message: string;
  action: Function;
  multiple?: boolean;
}

export function ConfirmDeleteModal({
  title,
  question,
  message,
  action,
  multiple,
}: ConfirmDeleteModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <>
      {!multiple ? (
        <Button
          onClick={() => setOpen(true)}
          type="text"
          size="small"
          className="text-slate-400"
          icon={<Delete01Icon size={16} strokeWidth={2} />}
        />
      ) : (
        <Button
          onClick={() => setOpen(true)}
          type="primary"
          danger
          className="flex h-9 items-center px-[20px] py-0 gap-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="15"
            viewBox="0 0 13 15"
            fill="none"
          >
            <path
              d="M12.0938 2.9375C12.4492 2.9375 12.75 3.23828 12.75 3.59375C12.75 3.97656 12.4492 4.25 12.0938 4.25H11.7656L11.1094 13.1367C11.0273 14.0664 10.2891 14.75 9.35938 14.75H3.86328C2.93359 14.75 2.19531 14.0664 2.11328 13.1367L1.45703 4.25H1.15625C0.773438 4.25 0.5 3.97656 0.5 3.59375C0.5 3.23828 0.773438 2.9375 1.15625 2.9375H3.04297L4.05469 1.43359C4.32812 1.02344 4.82031 0.75 5.33984 0.75H7.88281C8.40234 0.75 8.89453 1.02344 9.16797 1.43359L10.1797 2.9375H12.0938ZM5.33984 2.0625C5.25781 2.0625 5.17578 2.11719 5.14844 2.17188L4.62891 2.9375H8.59375L8.07422 2.17188C8.04688 2.11719 7.96484 2.0625 7.88281 2.0625H5.33984ZM10.4531 4.25H2.76953L3.42578 13.0547C3.45312 13.2734 3.64453 13.4375 3.86328 13.4375H9.35938C9.57812 13.4375 9.76953 13.2734 9.79688 13.0547L10.4531 4.25Z"
              fill="#ffffff"
            />
          </svg>{' '}
          {t('app.delete')}
        </Button>
      )}
      <Modal
        className="[&_*.ant-modal-content]:p-0 [&_*.ant-modal-content]:overflow-hidden"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        destroyOnClose={true}
        centered
        width="fit-content"
        closable={false}
        footer={null}
        title={null}
      >
        <Flex gap={16} vertical className="w-[400px] p-5">
          <Flex vertical gap={8} className="text-center">
            <span className="text-lg font-semibold">{title}</span>
            {/* <span className="text-slate-400">{question}</span> */}
            <Flex
              vertical
              className="pl-7 pr-5 py-5 gap-2 relative text-left rounded-[8px] bg-red-50 text-red-500"
            >
              <span className="absolute w-[4px] h-[60%] content-center rounded-[6px] left-[8px] z-[20]	bg-red-500 top-1/2 -translate-y-1/2"></span>
              <Space size={8} className="font-semibold">
                <i className="fas fa-triangle-exclamation"></i>
                {t('app.warning')}
              </Space>
              <span>{message}</span>
            </Flex>
          </Flex>
          <Flex gap={8} justify="center" className="w-full">
            <Button
              loading={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await action();
                } catch ({ response }: any) {
                  getMessage(response?.data);
                } finally {
                  setLoading(false);
                  setOpen(false);
                }
              }}
              danger
              type="primary"
            >
              {t('app.confirm')}
            </Button>
            <Button onClick={() => setOpen(false)} type="text">
              {t('app.cancel')}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
