import { Button, Form, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from 'react';

export interface CreateModalProps {
  modalTitle?: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any, form: any) => void;
  formItems: React.ReactNode;
  loading?: boolean;
  footerButtons?: React.ReactNode;
  formProps?: object;
  clear?: boolean;
}

export function CreateModal({
  modalTitle,
  open,
  onClose,
  onSubmit,
  formItems,
  loading = false,
  footerButtons,
  formProps = {},
}: CreateModalProps) {
  const [form] = useForm();

  const handleFinish = async values => {
    await onSubmit(values, form);
  };

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
      <Form
        form={form}
        onFinish={handleFinish}
        className="w-[500px] flex flex-col gap-0"
        {...formProps}
      >
        <h5 className="py-4 px-6 font-extrabold leading-[22.4px] ">
          {modalTitle}
        </h5>
        <div className="flex flex-col px-6 pt-4 pb-2">{formItems}</div>
        <div className="px-6 flex gap-2 py-3 bg-[#F4F6F8]">
          <Button
            loading={loading}
            className={
              'px-3.5 flex items-center gap-3.5 font-bold capitalize rounded-[0.5rem]'
            }
            htmlType="submit"
          >
            <i className="fa-solid fa-check-double"></i>{' '}
            <span className="text-[13px]"> Submit</span>
          </Button>

          <Button
            onClick={onClose}
            className={
              'px-3.5 flex items-center gap-3.5 bg-[#919EAB] font-bold capitalize rounded-[0.5rem]'
            }
          >
            <i className="fa-solid fa-rotate"></i>
            <span className="text-[13px]"> Close</span>
          </Button>

          {footerButtons}
        </div>
      </Form>
    </Modal>
  );
}