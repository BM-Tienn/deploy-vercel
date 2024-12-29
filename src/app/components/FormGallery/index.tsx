import { FormInstance } from 'antd';
import React, { useState } from 'react';

import { Asset } from 'utils/types/const';
import { GalleryModal } from '../GalleryModal';

export interface FormGalleryProps {
  name: string | string[];
  supportedTypes?: string[];
  form: FormInstance;
}

export function FormGallery({ name, supportedTypes, form }: FormGalleryProps) {
  const [selectedFiles, setSelectedFiles] = useState<Asset[]>(
    form.getFieldValue(name) ?? [],
  );

  return (
    <div className="flex flex-col">
      <span className="text-sm text-slate-400">Image gallery</span>

      <div className="flex gap-3 flex-wrap">
        {selectedFiles.map((file, index) => (
          <div
            key={index}
            className="h-[150px]  w-[calc((100%/4)-12px)]  rounded-[8px] cursor-pointer  border bg-white flex justify-center items-center relative"
          >
            <img
              className="w-full h-full object-contain"
              src={file.path}
              alt=""
            />
          </div>
        ))}
        <GalleryModal
          type="image"
          selectedFiles={selectedFiles}
          setSelectedFiles={images => {
            setSelectedFiles(images);
            form.setFieldValue(name, images);
          }}
          multiple
        >
          <div className="h-[150px] w-[calc((100%/4)-12px)] rounded-[8px] cursor-pointer  border bg-white flex justify-center items-center relative">
            <span>Select a image</span>
          </div>
        </GalleryModal>
      </div>
    </div>
  );
}
