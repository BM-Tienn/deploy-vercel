import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
// Import the plugins
//@ts-ignore
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
//@ts-ignore
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { uploadMediaFile } from 'services/mediaApi';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
// Register the plugins
registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginImagePreview,
  // FilePondPluginImageResize,
  // FilePondPluginImageTransform,
);

export interface UploadBtnProps {
  selectedFolder: number;
  updateFolder: Function;
}

export function UploadBtn({ selectedFolder, updateFolder }: UploadBtnProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<any>([]);
  return (
    <>
      <Button onClick={() => setOpen(true)} type="primary">
        {t('media_library.upload.title')}
      </Button>
      <Modal
        footer={false}
        closeIcon={<></>}
        onCancel={() => {
          if (!loading) {
            setOpen(false);
            if (files.length) {
              setFiles([]);
              updateFolder();
            }
          }
        }}
        open={open}
        destroyOnClose
      >
        <FilePond
          files={files}
          onupdatefiles={file => setFiles(file)}
          onprocessfiles={() => {
            setLoading(false);
          }}
          labelTapToUndo=""
          iconRemove=""
          allowRevert={false}
          chunkUploads={true}
          allowMultiple={true}
          credits={false}
          server={{
            remove: null,
            revert: null,

            process: async (
              fieldName,
              file,
              metadata,
              load,
              error,
              progress,
              abort,
              transfer,
              options,
            ) => {
              setLoading(true);
              const params = {
                file,

                parentId: selectedFolder,
              };
              const formData = new FormData();
              Object.keys(params).forEach(key =>
                formData.append(key, params[key]),
              );
              const CancelToken = axios.CancelToken;
              const source = CancelToken.source();
              try {
                const { data } = await uploadMediaFile(formData, {
                  onUploadProgress: progressEvent =>
                    progress(true, progressEvent.loaded, progressEvent.total),
                  cancelToken: source.token,
                });
                if (data) {
                  setLoading(false);

                  load(data);
                }
              } catch (error) {}
            },
          }}
          labelTapToCancel=""
          labelIdle={t('media_library.upload.description')}
        />
      </Modal>
    </>
  );
}
