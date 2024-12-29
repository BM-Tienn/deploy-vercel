import { FormInstance } from 'antd/es/form';
import { Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { GalleryModal } from '../GalleryModal';
import { Asset } from 'utils/types/const';

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
  const [selectType, setSelectType] = useState('');
  const [url, setUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Asset[]>([]);
  const [selectedPoster, setSelectedPoster] = useState<Asset[]>([]);

  useEffect(() => {
    setSelectType(globalForm.getFieldValue(name)?.type ?? 'asset');
    setUrl(globalForm.getFieldValue(name)?.url);
    setSelectedFiles(
      globalForm.getFieldValue(name) ? [globalForm.getFieldValue(name)] : [],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-3 py-2 rounded-[10px] bg-[#f4f6f8]">
      {/* <Form className="flex flex-col gap-4" form={form}> */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-slate-400">Type</span>{' '}
          <Form.Item
            initialValue={type}
            className="mb-0"
            name={typeof name === 'string' ? [name, 'type'] : [...name, 'type']}
          >
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
                <Form.Item
                  className="mb-0"
                  name={
                    typeof name === 'string'
                      ? [name, 'title']
                      : [...name, 'title']
                  }
                >
                  <Input className="h-[40px]" />
                </Form.Item>
              </div>
              <div className="flex flex-col w-2/4">
                <span className="text-sm text-slate-400">Description</span>
                <Form.Item
                  className="mb-0"
                  name={
                    typeof name === 'string'
                      ? [name, 'description']
                      : [...name, 'description']
                  }
                >
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
                  globalForm.setFieldValue(
                    typeof name === 'string'
                      ? [name, 'dataId']
                      : [...name, 'dataId'],
                    video[0].id,
                  );
                  globalForm.setFieldValue(
                    typeof name === 'string'
                      ? [name, 'path']
                      : [...name, 'path'],
                    video[0].fullPath || video[0].path,
                  );

                  setSelectedFiles(video);
                }}
              >
                <div className="w-full h-[300px]">
                  {selectedFiles[0] ? (
                    <>
                      <video
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        height={200}
                        src={selectedFiles[0].fullPath || selectedFiles[0].path}
                        controls
                      ></video>
                    </>
                  ) : (
                    <div className="w-full rounded-[8px] cursor-pointer h-full border bg-white flex justify-center items-center relative">
                      <span>Select a video</span>
                    </div>
                  )}
                </div>
              </GalleryModal>
            </div>
            <GalleryModal
              type="image"
              selectedFiles={selectedPoster}
              setSelectedFiles={image => {
                globalForm.setFieldValue(
                  typeof name === 'string'
                    ? [name, 'posterId']
                    : [...name, 'posterId'],
                  image[0].id,
                );
                globalForm.setFieldValue(
                  typeof name === 'string'
                    ? [name, 'poster']
                    : [...name, 'poster'],
                  image[0].fullPath || image[0].path,
                );
                setSelectedPoster(image);
              }}
            >
              <div className="w-full h-[300px]">
                {selectedPoster[0] ? (
                  <img
                    alt={selectedPoster[0].fullPath || selectedPoster[0].path}
                    height={150}
                    src={selectedPoster[0].fullPath || selectedPoster[0].path}
                  />
                ) : (
                  <div className="w-full rounded-[8px] cursor-pointer h-full border bg-white flex justify-center items-center relative">
                    <span>Select a poster image</span>
                  </div>
                )}
              </div>
            </GalleryModal>
          </>
        )}
        {selectType !== 'asset' && (
          <>
            <div className="flex flex-col">
              <span className="text-sm text-slate-400">Url</span>{' '}
              <Form.Item
                className="mb-0"
                name={
                  typeof name === 'string' ? [name, 'path'] : [...name, 'path']
                }
              >
                <Input className="h-[40px]" />
              </Form.Item>
            </div>
            {url && (
              <div className="flex flex-col">
                <span className="text-sm text-slate-400">Video demo</span>
                <iframe
                  className="w-full h-[300px]"
                  src={globalForm.getFieldValue(
                    typeof name === 'string'
                      ? [name, 'path']
                      : [...name, 'path'],
                  )}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
