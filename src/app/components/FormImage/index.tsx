import { FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';

import { Asset } from 'utils/types/const';
import { GalleryModal } from '../GalleryModal';

export interface FormImageProps {
  title?: string;
  name: string | string[];
  supportedTypes?: string[];
  form: FormInstance;
  forceUpdate?: Function;
}

export function FormImage({
  title,
  form,
  name,
  supportedTypes,
  forceUpdate,
}: FormImageProps) {
  const [selectedFiles, setSelectedFiles] = useState<Asset[]>([]);

  // useEffect(() => {
  //   const initialFiles = form.getFieldValue(name) ?? [];
  //   setSelectedFiles(initialFiles);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    const initialFiles = form.getFieldValue(name) ?? [];
    setSelectedFiles(initialFiles);
  }, [form, name]);

  useEffect(() => {
    form.setFieldValue(name, selectedFiles);
    form.validateFields([name]);
  }, [selectedFiles, form, name]);

  const handleFileChange = (images: Asset[]) => {
    setSelectedFiles(images);
    form.setFieldValue(name, images);
    console.log(form.getFieldsValue(true));
    if (forceUpdate) forceUpdate();
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm text-slate-400">{title || 'Image'}</span>

      <GalleryModal
        type="image"
        selectedFiles={selectedFiles}
        setSelectedFiles={handleFileChange}
      >
        <div className="w-max max-w-full h-max p-2 border mb-4">
          {selectedFiles[0] ? (
            <img
              alt=""
              className="w-full h-full object-contain"
              src={selectedFiles[0].fullPath}
            />
          ) : (
            <div className="w-full rounded-[8px] cursor-pointer h-full border bg-white flex justify-center items-center relative">
              <span>Select a image</span>
            </div>
          )}
        </div>
      </GalleryModal>
    </div>
  );
}
