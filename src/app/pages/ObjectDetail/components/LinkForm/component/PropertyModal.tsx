import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { cn } from 'utils/tailwind';

export interface PropertyModalProps {
  name: string | string[];
}

export function PropertyModal({ name }: PropertyModalProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Property</Button>
      <Modal
        className="[&_*.ant-modal-content]:p-0 [&_*.ant-modal-content]:overflow-hidden"
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose={true}
        centered
        width="fit-content"
        closable={false}
        footer={null}
        title={null}
      >
        <div className="w-[500px] flex flex-col gap-0">
          <h5 className="py-4 px-6 font-extrabold leading-[22.4px]">
            Property
          </h5>
          <div className="flex flex-col px-6 pt-4 pb-4 gap-2">
            <div className="flex flex-col">
              <span className="text-sm text-slate-400">Target</span>
              <Form.Item
                name={
                  typeof name === 'string'
                    ? [name, 'target']
                    : [...name, 'target']
                }
                className="mb-0"
              >
                <Select
                  className="h-[40px]"
                  placeholder={'_'}
                  options={[
                    { value: '_blank' },
                    { value: '_self' },
                    { value: '_top' },
                    { value: '_parent' },
                  ]}
                />
              </Form.Item>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-400">Parameters</span>
              <Form.Item
                className="mb-0"
                name={
                  typeof name === 'string'
                    ? [name, 'parameters']
                    : [...name, 'parameters']
                }
              >
                <Input className={cn('h-[40px]')} placeholder={'-'} />
              </Form.Item>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-400">Title</span>
              <Form.Item
                className="mb-0"
                name={
                  typeof name === 'string'
                    ? [name, 'title']
                    : [...name, 'title']
                }
              >
                <Input className={cn('h-[40px]')} placeholder={'-'} />
              </Form.Item>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-400">Anchor</span>
              <Form.Item
                className="mb-0"
                name={
                  typeof name === 'string'
                    ? [name, 'anchor']
                    : [...name, 'anchor']
                }
              >
                <Input className={cn('h-[40px]')} placeholder={'-'} />
              </Form.Item>
            </div>
          </div>

          <div className="px-6 flex gap-2 py-3 bg-[#F4F6F8]">
            <Button
              onClick={() => setOpen(false)}
              className="px-3.5 flex items-center gap-3.5 font-bold capitalize rounded-[0.5rem]"
              htmlType="submit"
            >
              <i className="fa-solid fa-check-double"></i>
              <span className="text-[13px]"> Save</span>
            </Button>

            {/* <Button
              onClick={() => setOpen(false)}
              className="px-3.5 flex items-center gap-3.5 bg-[#919EAB] font-bold capitalize rounded-[0.5rem]"
            >
              <i className="fa-solid fa-rotate"></i>
              <span className="text-[13px]"> Close</span>
            </Button> */}
          </div>
        </div>
      </Modal>
    </>
  );
}
