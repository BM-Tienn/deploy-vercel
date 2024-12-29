// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';

export interface ResultModalProps {
  modalTitle?: string;
  open: boolean;
  onClose: () => void;
  dataModal?: any;
}

export function ResultModal({
  modalTitle,
  open,
  onClose,
  dataModal,
}: ResultModalProps) {
  return (
    <Modal
      className="[&_*.ant-modal-content]:p-0 [&_*.ant-modal-content]:overflow-hidden"
      open={open}
      onCancel={onClose}
      destroyOnClose={true}
      centered
      width="fit-content"
      closable={false}
      footer={null}
      title={null}
    >
      <h4 className="py-4 px-6 font-extrabold leading-[22.4px]">
        {modalTitle}
      </h4>
      <div className="flex flex-col px-6 pb-2">
        {dataModal?.result && (
          <ul className="list-disc pl-4">
            {Object.entries(dataModal.result).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong>{' '}
                {typeof value === 'object' && value !== null ? (
                  <ul className="pl-4 list-disc">
                    {Object.entries(value).map(([subKey, subValue]) => (
                      <li key={subKey}>
                        <strong>{subKey}:</strong>{' '}
                        {subValue?.toString() || 'N/A'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  value?.toString() || 'N/A'
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="px-6 flex gap-2 py-3 bg-[#F4F6F8]">
        <Button
          onClick={onClose}
          className="px-3.5 flex items-center gap-3.5 bg-[#919EAB] font-bold capitalize rounded-[0.5rem]"
        >
          <i className="fa-solid fa-rotate"></i>
          <span className="text-[13px]"> Close</span>
        </Button>
      </div>
    </Modal>
  );
}
