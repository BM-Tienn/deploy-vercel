import { FormInstance } from 'antd/es/form';
import { Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { GalleryModal } from '../GalleryModal';
import { Asset } from 'utils/types/const';
import { FormImage } from '../FormImage';

export interface FormVideoProps {
  name: string | string[];
  type: string;
  videoUrl?: string;
  supportedTypes?: string[];
  globalForm: FormInstance;
}

export function FormVideo({
  name,
  type,
  supportedTypes,
  videoUrl,
  globalForm,
}: FormVideoProps) {
  const [form] = Form.useForm();
  const [selectType, setSelectType] = useState('');
  const [url, setUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Asset[]>([]);
  const [, setCount] = useState(0);

  useEffect(() => {
    setSelectType(globalForm.getFieldValue(name)?.type ?? 'asset');
    setUrl(globalForm.getFieldValue(name)?.url);
    setSelectedFiles(
      globalForm.getFieldValue(name) ? [globalForm.getFieldValue(name)] : [],
    );
    form.setFieldsValue(globalForm.getFieldValue(name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allValues = form.getFieldsValue(true);

  useEffect(() => {
    globalForm.setFieldValue(name, allValues);
    setUrl(allValues.url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allValues]);

  return (
    <div className="px-3 py-2 rounded-[10px] bg-[#f4f6f8]">
      <Form className="flex flex-col gap-4" form={form}>
        <div className="flex flex-col">
          <span className="text-sm text-slate-400">Type</span>{' '}
          <Form.Item initialValue={type} className="mb-0" name={'type'}>
            <Select
              className="h-[40px]"
              placeholder={'_'}
              optionFilterProp="label"
              onChange={value => {
                setSelectType(value);
              }}
              options={supportedTypes?.map(type => ({
                label: type,
                value: type,
              }))}
            />
          </Form.Item>
        </div>
        {selectType === 'asset' && (
          <>
            <div className="flex gap-4">
              <div className="flex flex-col w-2/4">
                <span className="text-sm text-slate-400">Title</span>
                <Form.Item className="mb-0" name={'title'}>
                  <Input className="h-[40px]" />
                </Form.Item>
              </div>
              <div className="flex flex-col w-2/4">
                <span className="text-sm text-slate-400">Description</span>
                <Form.Item className="mb-0" name={'Description'}>
                  <Input className="h-[40px]" />
                </Form.Item>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-400">Video</span>

              <GalleryModal
                type="video"
                selectedFiles={selectedFiles}
                setSelectedFiles={video => {
                  form.setFieldValue('video', video);

                  setSelectedFiles(video);
                }}
              >
                <div className="w-full h-[300px]">
                  {selectedFiles[0] ? (
                    <video
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      className="w-full h-full"
                      src={selectedFiles[0].path}
                      controls
                    ></video>
                  ) : (
                    <div className="w-full rounded-[8px] cursor-pointer h-full border bg-white flex justify-center items-center relative">
                      <span>Select a video</span>
                    </div>
                  )}
                </div>
              </GalleryModal>
            </div>
            <FormImage
              forceUpdate={() => setCount(prv => prv + 1)}
              form={form}
              name="poster"
            />
          </>
        )}
        {selectType !== 'asset' && (
          <>
            <div className="flex flex-col">
              <span className="text-sm text-slate-400">Url</span>{' '}
              <Form.Item className="mb-0" name={'url'}>
                <Input className="h-[40px]" />
              </Form.Item>
            </div>
            {url && (
              <div className="flex flex-col">
                <span className="text-sm text-slate-400">Video demo</span>
                <iframe
                  className="w-full h-[300px]"
                  src={form.getFieldValue('url')}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </>
        )}
      </Form>
    </div>
  );
}
