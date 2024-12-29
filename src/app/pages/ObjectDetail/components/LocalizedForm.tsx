import React, { useEffect, useState } from 'react';
import { ObjectDataType } from '../constant';
import { fixData } from 'app/pages/ObjectDetail';
import { objectGetOptionsApi } from 'services/objectApi';
import QueryString from 'qs';
import { objectType } from 'utils/types/const';
import { FormInstance } from 'antd';
import { CheckboxForm } from './CheckboxForm';
import { LinkForm } from './LinkForm';
import { VideoForm } from './VideoForm';
import { MapForm } from './MapForm';
import { ApiOptions } from 'app/slice/types';
import { FormInput } from 'app/components/FormInput';
import { FormImage } from 'app/components/FormImage';
import { FormDate } from 'app/components/FormDate';
import { FormCascader } from 'app/components/FormCascader';
import { FormSelect } from 'app/components/FormSelect';
import Wysiwyg from 'app/components/Wysiwyg';
import { FormGallery } from 'app/components/FormGallery';

export interface LocalizedFromProps {
  data?: ObjectDataType;
  form: FormInstance;
}

export function LocalizedFrom({ data, form }: LocalizedFromProps) {
  const [dataObj, setDataObj] = useState<objectType | undefined>();
  const [options, setOptions] = useState<any>({});
  useEffect(() => {
    if (data?.children) {
      const object = data?.children;
      setDataObj(object);
    }
  }, [data]);

  useEffect(() => {
    const options = {}; // Chuyển sang object để chứa các key động

    const apiOptions = data?.api_options as ApiOptions;
    if (apiOptions && apiOptions?.value) {
      const defaultParams = {
        id: apiOptions?.id,
        class: apiOptions?.class,
        type: 'localizedfields',
      };

      const apiOptionsValue = apiOptions.value;
      const fetchOptions = async () => {
        await Promise.all(
          Object.entries(apiOptionsValue).map(async ([key, value]) => {
            if (value) {
              const params = {
                ...defaultParams,
                ...value,
                typeId: key,
              };
              try {
                const { data: res } = await objectGetOptionsApi(
                  QueryString.stringify(params),
                );
                if (res) {
                  if (!options[key]) options[key] = [];
                  options[key] =
                    Array.isArray(res.data) && res.data.length > 0
                      ? res.data.map(item => fixData(item))
                      : [fixData(res.data)];
                }
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            }
          }),
        );
        setOptions(options);
      };

      fetchOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataObj]);

  return (
    <div className="p-4 flex flex-col bg-[#f4f6f8] rounded-xl">
      {dataObj?.map((item, index) => {
        switch (item.fieldtype) {
          case 'urlSlug':
            return (
              <FormInput
                key={index}
                detail
                name={item.name}
                label={item?.title ?? ''}
              />
            );
          case 'input':
            return (
              <FormInput
                key={index}
                detail
                name={item.name}
                label={item?.title ?? ''}
              />
            );
          case 'textarea':
            return (
              <FormInput
                key={index}
                detail
                name={item.name}
                label={item?.title ?? ''}
                type="textarea"
              />
            );
          case 'password':
            return (
              <FormInput
                key={index}
                detail
                name={item.name}
                label={item?.title ?? ''}
                type="password"
              />
            );
          case 'numeric':
            return (
              <FormInput
                key={index}
                detail
                name={item.name}
                label={item?.title ?? ''}
                type="number"
              />
            );
          case 'checkbox':
            return <CheckboxForm key={index} data={item} />;
          case 'link':
            return <LinkForm key={index} globalForm={form} data={item} />;
          case 'video':
            return <VideoForm key={index} form={form} data={item} />;
          case 'image':
            return (
              <FormImage
                key={index}
                form={form}
                name={item.name}
                supportedTypes={item.supportedTypes}
              />
            );
          case 'imageGallery':
            return (
              <FormGallery
                key={index}
                name={item.name}
                supportedTypes={item.supportedTypes}
                form={form}
              />
            );
          case 'geopoint':
            return <MapForm key={index} form={form} data={item} />;
          case 'localizedfields':
            return <LocalizedFrom key={index} form={form} data={item} />;
          case 'wysiwyg':
            return (
              <Wysiwyg
                key={index}
                content=""
                label={item.title}
                name={item.name}
                form={form}
              />
            );
          case 'select':
            return (
              <FormSelect
                key={index}
                option={options?.[item.name] ?? []}
                label={item.title}
                name={item.name}
              />
            );
          case 'manyToManyObjectRelation':
            return (
              <FormCascader
                key={index}
                type={item.fieldtype}
                fatherForm={form}
                option={options?.[item.name] ?? []}
                name={item.name}
                title={item.title}
                multiple={true}
              />
            );
          case 'manyToOneRelation':
            return (
              <FormCascader
                key={index}
                type={item.fieldtype}
                fatherForm={form}
                option={options?.[item.name] ?? []}
                name={item.name}
                title={item.title}
              />
            );
          case 'advancedManyToManyRelation':
            return (
              <FormCascader
                key={index}
                type={item.fieldtype}
                fatherForm={form}
                option={options?.[item.name] ?? []}
                name={item.name}
                title={item.title}
                multiple={true}
              />
            );
          case 'manyToManyRelation':
            return (
              <FormCascader
                key={index}
                type={item.fieldtype}
                fatherForm={form}
                option={options?.[item.name] ?? []}
                name={item.name}
                title={item.title}
                multiple={true}
              />
            );
          case 'date':
            return (
              <FormDate
                key={index}
                fatherForm={form}
                label={item.title}
                name={item.name}
              />
            );
          case 'datetime':
            return (
              <FormDate
                key={index}
                fatherForm={form}
                label={item.title}
                name={item.name}
                type="datetime"
              />
            );
          case 'dateRange':
            return (
              <FormDate
                key={index}
                fatherForm={form}
                label={item.title}
                name={item.name}
                type="dateRange"
              />
            );
          case 'time':
            return (
              <FormDate
                key={index}
                fatherForm={form}
                label={item.title}
                name={item.name}
                type="time"
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
