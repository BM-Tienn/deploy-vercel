import * as React from 'react';
import { ObjectDataType } from '../constant';
import { FormMap } from 'app/components/FormMap';
import { FormInstance } from 'antd';

export interface MapFormProps {
  data: ObjectDataType | ObjectDataType[];
  required?: boolean;
  form: FormInstance;
  parentName?: [];
  customItem?: string;
}

export function MapForm({
  data,
  required,
  form,
  parentName,
  customItem = 'name',
}: MapFormProps) {
  return (
    <>
      {Array.isArray(data) ? (
        data.map(field => (
          <div className="flex flex-col">
            <span className="text-sm text-slate-400">
              {field.title}
              {required && <i className="ml-[4px] fa-solid fa-circle-info"></i>}
            </span>
            <FormMap
              initialLocation={form.getFieldValue(field.name)}
              form={form}
              name={
                parentName
                  ? [...parentName, field?.[customItem] ?? '']
                  : field?.[customItem] ?? ''
              }
            />
          </div>
        ))
      ) : (
        <div className="flex flex-col">
          <span className="text-sm text-slate-400">
            {data.title}
            {required && <i className="ml-[4px] fa-solid fa-circle-info"></i>}
          </span>
          <FormMap
            initialLocation={form.getFieldValue(data.name)}
            form={form}
            name={
              parentName
                ? [...parentName, data?.[customItem] ?? '']
                : data?.[customItem] ?? ''
            }
          />
        </div>
      )}
    </>
  );
}
