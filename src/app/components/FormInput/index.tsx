import { Form, Input, InputNumber } from 'antd';
import { Rule } from 'antd/es/form';
import * as React from 'react';
import { cn } from 'utils/tailwind';

export interface FormInputProps {
  required?: boolean;
  placeholder?: string;
  rules?: Rule[];
  name: string | string[];
  label?: string;
  type?: 'password' | 'textarea' | 'number';
  detail?: boolean;
  readOnly?: boolean;
  isBlock?: boolean;
}

export function FormInput({
  required,
  placeholder,
  rules,
  name,
  label,
  type,
  detail,
  readOnly,
  isBlock,
}: FormInputProps) {
  if (isBlock && Array.isArray(name)) {
    name?.splice(0, 1);
  }

  return (
    <div className="flex flex-col">
      <span className="text-[#919EAB] text-sm mb-[4px]">
        {label}
        {required && <i className="ml-[4px] fa-solid fa-circle-info"></i>}
      </span>
      <Form.Item name={name} rules={rules} required={required}>
        {!type && (
          <Input
            readOnly={readOnly}
            className={cn(detail && 'h-[40px]')}
            placeholder={placeholder ? placeholder : '-'}
          />
        )}

        {type === 'password' && (
          <Input.Password
            readOnly={readOnly}
            className={cn(detail && 'h-[40px]')}
            placeholder={placeholder ? placeholder : '-'}
          />
        )}
        {type === 'textarea' && (
          <Input.TextArea
            readOnly={readOnly}
            placeholder={placeholder ? placeholder : '-'}
          />
        )}
        {type === 'number' && (
          <InputNumber
            readOnly={readOnly}
            className={cn(
              detail &&
                'h-[40px] w-full flex items-center [&>.ant-input-number-input-wrap]:flex-1',
            )}
            placeholder={placeholder ? placeholder : '-'}
          />
        )}
      </Form.Item>
    </div>
  );
}
