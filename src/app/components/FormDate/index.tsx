import { DatePicker, TimePicker } from 'antd';
import Form, { FormInstance, Rule } from 'antd/es/form';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { cn } from 'utils/tailwind';

export interface FormDateProps {
  required?: boolean;
  placeholder?: string;
  rules?: Rule[];
  name: string | string[];
  label?: string;
  type?: 'datetime' | 'dateRange' | 'time';
  readOnly?: boolean;
  fatherForm: FormInstance;
  forceUpdate?: Function;
}

export function FormDate({
  required = false,
  placeholder = '',
  rules = [],
  name,
  label,
  type,
  readOnly = false,
  fatherForm,
  forceUpdate,
}: FormDateProps) {
  const { RangePicker } = DatePicker;
  const [date, setDate] = useState<any>(undefined);

  useEffect(() => {
    const initValue = fatherForm.getFieldValue(name);
    if (!initValue) return;

    switch (type) {
      case undefined:
        setDate(dayjs(initValue, 'YYYY/MM/DD'));
        break;
      case 'datetime':
        setDate(dayjs(initValue, 'YYYY/MM/DD HH:mm'));
        break;
      case 'dateRange':
        setDate(
          Array.isArray(initValue)
            ? initValue.map(day => dayjs(day, 'YYYY/MM/DD'))
            : initValue.split(' - ').map(day => dayjs(day, 'YYYY/MM/DD')),
        );
        break;
      case 'time':
        setDate(dayjs(initValue, 'HH:mm:ss'));
        break;
      default:
        break;
    }
  }, [fatherForm, name, type]);

  const handleChange = (value: any) => {
    if (value === null) {
      setDate(null);
      fatherForm.setFieldValue(name, null);
    } else {
      switch (type) {
        case undefined:
          setDate(value);
          fatherForm.setFieldValue(name, value.format('YYYY/MM/DD'));
          break;
        case 'datetime':
          setDate(value);
          fatherForm.setFieldValue(name, value.format('YYYY/MM/DD HH:mm'));
          break;
        case 'dateRange':
          setDate(value);
          fatherForm.setFieldValue(
            name,
            value.map((v: any) => v.format('YYYY/MM/DD')),
          );
          break;
        case 'time':
          setDate(value);
          fatherForm.setFieldValue(name, value.format('HH:mm:ss'));
          break;
        default:
          setDate(value);
          fatherForm.setFieldValue(name, value.format('YYYY/MM/DD'));
          break;
      }
    }

    if (forceUpdate) forceUpdate(fatherForm.getFieldsValue(true));
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm text-slate-400">
        {label}
        {required && <i className="ml-[4px] fa-solid fa-circle-info"></i>}
      </span>

      {!type && (
        <DatePicker
          value={date}
          onChange={handleChange}
          className={cn('h-[40px]')}
          placeholder={placeholder}
          disabled={readOnly}
        />
      )}
      {type === 'datetime' && (
        <DatePicker
          value={date}
          onChange={handleChange}
          showTime
          className={cn('h-[40px]')}
          placeholder={placeholder}
          disabled={readOnly}
        />
      )}
      {type === 'dateRange' && (
        <RangePicker
          value={date}
          onChange={handleChange}
          className={cn('h-[40px]')}
          disabled={readOnly}
        />
      )}
      {type === 'time' && (
        <TimePicker
          value={date}
          onChange={handleChange}
          className={cn('h-[40px]')}
          placeholder={placeholder}
          defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
          disabled={readOnly}
        />
      )}

      <Form.Item
        className="mb-0"
        name={name}
        rules={rules}
        required={required}
        noStyle
      />
    </div>
  );
}
