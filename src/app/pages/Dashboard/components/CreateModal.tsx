import { Button, Form, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormInput } from 'app/components/FormInput';
import React, { useEffect } from 'react';

export interface CreateModalProps {
  open: boolean;
  onCancel: () => void;
  dataItem: any;
  onSubmit: (updatedData: any) => void;
}

export function CreateModal({
  open,
  onCancel,
  dataItem,
  onSubmit,
}: CreateModalProps) {
  const [form] = useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (open && dataItem) {
      form.setFieldsValue({
        key: '',
        classId: dataItem.key || '',
      });
    }
  }, [open, dataItem, form]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      onSubmit({ ...dataItem, ...values });
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className="[&_*.ant-modal-content]:p-0 [&_*.ant-modal-content]:overflow-hidden"
      open={open}
      onCancel={onCancel}
      destroyOnClose={true}
      centered
      width={500}
      closable={false}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        className="w-full flex flex-col gap-4 p-6"
      >
        <h5 className="font-extrabold text-lg">Create Object</h5>
        <div className="flex flex-col">
          <FormInput name="key" label="Object Key" />
        </div>
        <div style={{ display: 'none' }}>
          <FormInput name="classId" label="Class Id" />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="flex items-center gap-2 font-bold capitalize rounded"
          >
            <i className="fa-solid fa-check-double"></i>
            <span className="text-sm">Save</span>
          </Button>

          <Button
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-500 text-white font-bold capitalize rounded"
          >
            <i className="fa-solid fa-rotate"></i>
            <span className="text-sm">Close</span>
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
