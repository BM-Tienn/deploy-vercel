import { ObjectDataType } from 'app/pages/ObjectDetail/constant';
import React, { useEffect, useState } from 'react';
import { objectType } from 'utils/types/const';
import { FormInstance } from 'antd';
import { LocalizedFrom } from 'app/pages/ObjectDetail/components/LocalizedForm';
import { CheckboxForm } from 'app/pages/ObjectDetail/components/CheckboxForm';
import { LinkForm } from 'app/pages/ObjectDetail/components/LinkForm';
import { MapForm } from 'app/pages/ObjectDetail/components/MapForm';
import { VideoForm } from 'app/pages/ObjectDetail/components/VideoForm';
import { FormInput } from 'app/components/FormInput';
import { FormImage } from 'app/components/FormImage';
import { FormDate } from 'app/components/FormDate';
import { FormCascader } from 'app/components/FormCascader';
import { FormSelect } from 'app/components/FormSelect';
import Wysiwyg from 'app/components/Wysiwyg';
import { FormGallery } from 'app/components/FormGallery';

export interface ChildFormProps {
  fatherForm: FormInstance;
  data?: ObjectDataType[];
  parentName?: any;
  optionName?: any;
  options?: any;
}
export const formatName = (
  data: any,
  parentName?: string[],
  customItem: string = 'name',
) => {
  const name = parentName?.length
    ? [...parentName, data?.[customItem] ?? '']
    : data?.[customItem] ?? '';
  return name;
};

export function ChildForm({
  data,
  fatherForm,
  parentName,
  optionName,
  options,
}: ChildFormProps) {
  const [dataObj, setDataObj] = useState<objectType | undefined>();

  useEffect(() => {
    if (data) {
      setDataObj(data);
    }
  }, [data]);

  return (
    <div className="flex flex-col bg-[#ffffff] rounded-2xl">
      {dataObj?.map((item, index) => {
        switch (item.fieldtype) {
          case 'urlSlug':
            return (
              <FormInput
                key={index}
                detail
                name={formatName(item, parentName)}
                label={item?.title ?? ''}
                // isBlock
              />
            );
          case 'input':
            return (
              <FormInput
                key={index}
                detail
                name={formatName(item, parentName)}
                label={item?.title ?? ''}
                // isBlock
              />
            );
          case 'textarea':
            return (
              <FormInput
                key={index}
                detail
                name={formatName(item, parentName)}
                label={item?.title ?? ''}
                type="textarea"
                // isBlock
              />
            );
          case 'password':
            return (
              <FormInput
                key={index}
                detail
                name={formatName(item, parentName)}
                label={item?.title ?? ''}
                type="number"
                // isBlock
              />
            );
          case 'numeric':
            return (
              <FormInput
                key={index}
                detail
                name={formatName(item, parentName)}
                label={item?.title ?? ''}
                type="number"
                // isBlock
              />
            );
          case 'checkbox':
            return (
              <CheckboxForm key={index} parentName={parentName} data={item} />
            );
          case 'link':
            return (
              <LinkForm
                key={index}
                parentName={parentName}
                globalForm={fatherForm}
                data={item}
              />
            );
          case 'video':
            return (
              <VideoForm
                key={index}
                parentName={parentName}
                form={fatherForm}
                data={item}
              />
            );
          case 'image':
            return (
              <FormImage
                key={index}
                form={fatherForm}
                name={formatName(item, parentName)}
                supportedTypes={item.supportedTypes}
              />
            );
          case 'imageGallery':
            return (
              <FormGallery
                key={index}
                name={formatName(item, parentName)}
                supportedTypes={item.supportedTypes}
                form={fatherForm}
              />
            );
          case 'geopoint':
            return (
              <MapForm
                key={index}
                parentName={parentName}
                form={fatherForm}
                data={item}
              />
            );
          case 'localizedfields':
            return <LocalizedFrom key={index} form={fatherForm} data={item} />;
          case 'wysiwyg':
            return (
              <Wysiwyg
                key={index}
                content=""
                label={item?.title ?? ''}
                name={formatName(item, parentName)}
                form={fatherForm}
              />
            );
          case 'select':
            return (
              <FormSelect
                key={index}
                option={options?.[item.name] ?? []}
                label={item.title}
                name={formatName(item, parentName)}
              />
            );
          case 'manyToManyObjectRelation':
            return (
              <FormCascader
                key={index}
                type={item.fieldtype}
                fatherForm={fatherForm}
                option={options?.[item.name] ?? []}
                name={formatName(item, optionName)}
                title={item.title}
                multiple={true}
              />
            );
          case 'manyToOneRelation':
            return (
              <FormCascader
                key={index}
                type={item.fieldtype}
                fatherForm={fatherForm}
                option={options?.[item.name] ?? []}
                name={formatName(item, optionName)}
                title={item.title}
              />
            );
          case 'advancedManyToManyRelation':
            return (
              <FormCascader
                key={index}
                type={item.fieldtype}
                fatherForm={fatherForm}
                option={options?.[item.name] ?? []}
                name={formatName(item, optionName)}
                title={item.title}
                multiple={true}
              />
            );
          case 'manyToManyRelation':
            return (
              <FormCascader
                key={index}
                type={item.fieldtype}
                fatherForm={fatherForm}
                option={options?.[item.name] ?? []}
                name={formatName(item, optionName)}
                title={item.title}
                multiple={true}
              />
            );
          case 'date':
            return (
              <FormDate
                key={index}
                fatherForm={fatherForm}
                label={item.title}
                name={formatName(item, parentName)}
              />
            );
          case 'datetime':
            return (
              <FormDate
                key={index}
                fatherForm={fatherForm}
                label={item.title}
                name={formatName(item, parentName)}
                type={'datetime'}
              />
            );
          case 'dateRange':
            return (
              <FormDate
                key={index}
                fatherForm={fatherForm}
                label={item.title}
                name={formatName(item, parentName)}
                type={'dateRange'}
              />
            );
          case 'time':
            return (
              <FormDate
                key={index}
                fatherForm={fatherForm}
                label={item.title}
                name={formatName(item, parentName)}
                type={'time'}
              />
            );
          // Các trường hợp khác
          default:
            return null;
        }
      })}
    </div>
  );
}
