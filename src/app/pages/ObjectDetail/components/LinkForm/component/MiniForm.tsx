import { Button, Input } from 'antd';
import Form, { FormInstance, Rule } from 'antd/es/form';
import React, { useState } from 'react';
import { cn } from 'utils/tailwind';
import { PropertyModal } from './PropertyModal';
import { AdvancedModal } from './AdvancedModal';

export interface MiniFormProps {
  name: string | string[];
  rules?: Rule[];
  globalForm: FormInstance;
}

export function MiniForm({ name, rules, globalForm }: MiniFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setCount] = useState(0);
  const getFieldName = (field: string) =>
    typeof name === 'string' ? [name, field] : [...name, field];
  const textName = getFieldName('text');
  const pathName = getFieldName('path');
  const propertyName = getFieldName('property');
  const advancedName = getFieldName('advanced');

  return (
    <div className="px-3 py-2 rounded-[10px] bg-[#f4f6f8]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-slate-400">Text</span>{' '}
          <Form.Item className="mb-0" name={textName}>
            <Input className={cn('h-[40px]')} placeholder={'-'} />
          </Form.Item>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-slate-400">Path</span>{' '}
          <div className="flex gap-2 ">
            <Form.Item className="mb-0 flex-1" name={pathName}>
              <Input className={cn('h-[40px]')} placeholder={'-'} />
            </Form.Item>
            <Button className="h-[40px] w-[40px]">
              <i className="fa-solid fa-magnifying-glass"></i>
            </Button>
          </div>
        </div>
        <div className="flex gap-2 ">
          <PropertyModal name={propertyName} />
          <AdvancedModal name={advancedName} />
        </div>
      </div>
    </div>
  );
}
