import * as React from 'react';
import { ObjectDataType } from '../../constant';
import { MiniForm } from './component/MiniForm';
import { FormInstance } from 'antd';

export interface LinkFormProps {
  data: ObjectDataType | ObjectDataType[];
  required?: boolean;
  globalForm: FormInstance;
  parentName?: string | string[];
  customItem?: string;
}

export function LinkForm({
  data,
  required,
  globalForm,
  parentName,
  customItem = 'name',
}: LinkFormProps) {
  return (
    <>
      {Array.isArray(data) ? (
        data.map(field => (
          <div className="flex flex-col">
            <span className="text-sm text-slate-400">
              {field.title}
              {required && <i className="ml-[4px] fa-solid fa-circle-info"></i>}
            </span>
            <MiniForm
              globalForm={globalForm}
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
          <MiniForm
            globalForm={globalForm}
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
