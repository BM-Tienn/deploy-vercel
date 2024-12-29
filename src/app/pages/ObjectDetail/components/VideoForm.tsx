import * as React from 'react';
import { ObjectDataType } from '../constant';
import { FormVideo } from 'app/components/FormVideo';
import { FormInstance } from 'antd';

export interface VideoFormProps {
  data: ObjectDataType | ObjectDataType[];
  form: FormInstance;
  parentName?: [];
  customItem?: string;
}

export function VideoForm({
  data,
  form,
  parentName,
  customItem = 'name',
}: VideoFormProps) {
  return (
    <>
      {Array.isArray(data) ? (
        data.map(field => (
          <div className="flex flex-col">
            <span className="text-sm text-slate-400">
              {field.title}
              {field.mandatory && (
                <i className="ml-[4px] fa-solid fa-circle-info"></i>
              )}
            </span>
            <FormVideo
              globalForm={form}
              type={'asset'}
              name={
                parentName
                  ? [...parentName, field?.[customItem] ?? '']
                  : field?.[customItem] ?? ''
              }
              supportedTypes={field.supportedTypes}
            />
          </div>
        ))
      ) : (
        <div className="flex flex-col">
          <span className="text-sm text-slate-400">
            {data.title}
            {data.mandatory && (
              <i className="ml-[4px] fa-solid fa-circle-info"></i>
            )}
          </span>
          <FormVideo
            globalForm={form}
            type={'asset'}
            name={
              parentName
                ? [...parentName, data?.[customItem] ?? '']
                : data?.[customItem] ?? ''
            }
            supportedTypes={data.supportedTypes}
          />
        </div>
      )}
    </>
  );
}
