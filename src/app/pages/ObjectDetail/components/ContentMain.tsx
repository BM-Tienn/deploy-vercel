import { useEffect, useState } from 'react';
import { ObjectDataType } from '../constant';
import { Form, FormInstance, Flex, Tabs } from 'antd';
import { objectType } from 'utils/types/const';
import { LocalizedFrom } from './LocalizedForm';
import { CheckboxForm } from './CheckboxForm';
import { LinkForm } from './LinkForm';
import { MapForm } from './MapForm';
import { VideoForm } from './VideoForm';
import { ItemProps } from 'app/slice/types';
import { FieldcollectionsForm } from './FieldcollectionsForm';
import { BlockForm } from './BlockForm';
import { FormInput } from 'app/components/FormInput';
import { FormImage } from 'app/components/FormImage';
import { FormDate } from 'app/components/FormDate';
import { FormCascader } from 'app/components/FormCascader';
import { FormSelect } from 'app/components/FormSelect';
import Wysiwyg from 'app/components/Wysiwyg';
import { FormGallery } from 'app/components/FormGallery';

export interface ContentMainProps {
  data?: ObjectDataType;
  globalForm: FormInstance;
  options?: ItemProps[][];
}

export function groupByFieldType(object, currentItem) {
  if (currentItem.fieldtype) {
    if (!object[currentItem.fieldtype]) {
      object[currentItem.fieldtype] = currentItem;
    } else if (!Array.isArray(object[currentItem.fieldtype])) {
      object[currentItem.fieldtype] = [
        object[currentItem.fieldtype],
        currentItem,
      ];
    } else {
      object[currentItem.fieldtype].push(currentItem);
    }
  }
  return object;
}

export function ContentMain({ data, globalForm, options }: ContentMainProps) {
  const [active, setActive] = useState<number>(0);
  const [dataObj, setDataObj] = useState<objectType | undefined>();
  useEffect(() => {
    if (
      data?.fieldtype &&
      (data.fieldtype === 'tabpanel' || data.fieldtype === 'panel')
    ) {
      const targetChildren =
        data.fieldtype === 'tabpanel'
          ? data.children?.[active]?.children
          : data.children;

      if (targetChildren) {
        setDataObj(targetChildren);
      }
    }
  }, [data, active]);

  return (
    <Flex
      vertical
      className="flex-1 h-full px-4 rounded-[12px] border overflow-auto"
    >
      {data?.fieldtype === 'tabpanel' && (
        <Tabs
          activeKey={active.toString()}
          onChange={key => setActive(Number(key))}
          items={data.children?.map((child, idx) => ({
            key: idx.toString(),
            label: child.title || child.name,
          }))}
        />
      )}
      {data?.fieldtype === 'panel' && (
        <Tabs
          activeKey={active.toString()}
          onChange={key => setActive(Number(key))}
          items={[
            {
              key: '1',
              label: data.title || data.name,
            },
          ]}
        />
      )}
      <Form
        form={globalForm}
        onValuesChange={value => globalForm.getFieldsValue(true)}
        onFinish={() => {
          const output = { ...globalForm.getFieldsValue(true) };
          Object.keys(output).forEach(key => {
            if (
              Array.isArray(output[key]) &&
              output[key].some(item => item.fieldname)
            ) {
              output[key] = output[key].map(rel =>
                rel.element.fullpath.split('/'),
              );
            }
            if (
              Array.isArray(output[key]) &&
              output[key].some(item => item?.fullpath)
            ) {
              output[key] = output[key].map(rel => rel.fullpath.split('/'));
            }
            if (output[key]?.fullpath) {
              output[key] = output[key].fullpath.split('/');
            }
          });
        }}
      >
        <Flex vertical gap={8}>
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
                return (
                  <LinkForm key={index} globalForm={globalForm} data={item} />
                );
              case 'video':
                return <VideoForm key={index} form={globalForm} data={item} />;
              case 'image':
                return (
                  <FormImage
                    key={index}
                    form={globalForm}
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
                    form={globalForm}
                  />
                );
              case 'geopoint':
                return <MapForm key={index} form={globalForm} data={item} />;
              case 'localizedfields':
                return (
                  <LocalizedFrom key={index} form={globalForm} data={item} />
                );
              case 'wysiwyg':
                return (
                  <Wysiwyg
                    key={index}
                    content=""
                    label={item.title}
                    name={item.name}
                    form={globalForm}
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
              case 'manyToManyRelation':
                return (
                  <FormCascader
                    key={index}
                    type={item.fieldtype}
                    fatherForm={globalForm}
                    option={options?.[item.name] ?? []}
                    name={item.name}
                    title={item.title}
                    multiple={true}
                  />
                );
              case 'manyToManyObjectRelation':
                return (
                  <FormCascader
                    key={index}
                    type={item.fieldtype}
                    fatherForm={globalForm}
                    option={options?.[item.name] ?? []}
                    name={item.name}
                    title={item.title}
                  />
                );
              case 'manyToOneRelation':
                return (
                  <FormCascader
                    key={index}
                    type={item.fieldtype}
                    fatherForm={globalForm}
                    option={options?.[item.name] ?? []}
                    name={item.name}
                    title={item.title}
                    multiple={true}
                  />
                );
              case 'advancedManyToManyRelation':
                return (
                  <FormCascader
                    key={index}
                    type={item.fieldtype}
                    fatherForm={globalForm}
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
                    fatherForm={globalForm}
                    label={item.title}
                    name={item.name}
                  />
                );
              case 'datetime':
                return (
                  <FormDate
                    key={index}
                    fatherForm={globalForm}
                    label={item.title}
                    name={item.name}
                    type="datetime"
                  />
                );
              case 'dateRange':
                return (
                  <FormDate
                    key={index}
                    fatherForm={globalForm}
                    label={item.title}
                    name={item.name}
                    type="dateRange"
                  />
                );
              case 'time':
                return (
                  <FormDate
                    key={index}
                    fatherForm={globalForm}
                    label={item.title}
                    name={item.name}
                    type="time"
                  />
                );
              case 'fieldcollections':
                return (
                  <FieldcollectionsForm
                    key={index}
                    fatherForm={globalForm}
                    data={item}
                  />
                );
              case 'block':
                return (
                  <BlockForm key={index} fatherForm={globalForm} data={item} />
                );
              // Các trường hợp khác
              default:
                return null;
            }
          })}
        </Flex>
      </Form>
    </Flex>
  );
}
