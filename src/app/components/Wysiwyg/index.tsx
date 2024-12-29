import React, { useEffect, useRef, useState } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Heading,
  FontSize,
  FontFamily,
  FontColor,
  FontBackgroundColor,
  Alignment,
  Underline,
  Link,
  MediaEmbed,
  SourceEditing,
  Table,
  List,
  RemoveFormat,
  Image,
  ImageInsert,
  ImageEditing,
  ImageUtils,
  ImageToolbar,
  ImageCaption,
  ImageUpload,
  Plugin,
  ButtonView,
  ImageResize,
  ImageStyle,
  HtmlEmbed,
  ListUI,
} from 'ckeditor5';

import Form, { FormInstance, Rule } from 'antd/es/form';
import { WysiwygWrapper } from './styled';
import { Asset } from 'utils/types/const';
import { GalleryModal } from '../GalleryModal';

export interface WysiwygProps {
  content: any;

  readOnly?: boolean;
  name?: string | string[];
  label?: string;
  required?: boolean;
  form: FormInstance;
  rules?: Rule[];
}

const Wysiwyg = ({
  content,
  readOnly,
  name,
  label,
  required,
  rules,
  form,
}: WysiwygProps) => {
  const editorRef = useRef<null | ClassicEditor>(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'image' | 'video'>('image');
  const [selectedFiles, setSelectedFiles] = useState<Asset[]>([]);

  useEffect(() => {
    if (editorRef.current && selectedFiles.length) {
      const editor = editorRef.current;
      editor.model.change(writer => {
        const insertPosition =
          editor.model.document.selection.getFirstPosition();
        if (insertPosition) {
          if (type === 'image') {
            const imageElement = writer.createElement('imageBlock', {
              src: selectedFiles[0].fullPath,
            });
            editor.model.insertContent(imageElement, insertPosition);
          } else if (type === 'video') {
            const videoHtml = `
              <video style='width:100%;height100%' controls>
                <source src="${selectedFiles[0].fullPath}" type="${selectedFiles[0].mimetype}" />
                ${selectedFiles[0].filename}
              </video>
            `;
            editor.execute('htmlEmbed', videoHtml);
          }
        }
      });
    }
  }, [selectedFiles, type]);

  class CustomImage extends Plugin {
    init() {
      const editor = this.editor;

      editor.ui.componentFactory.add('image', locale => {
        const view = new ButtonView(locale);

        view.set({
          label: 'Insert Image',
          icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M1.201 1c-.662 0-1.2.47-1.2 1.1v14.248c0 .64.533 1.152 1.185 1.152h6.623v-7.236L6.617 9.15a.694.694 0 0 0-.957-.033L1.602 13.55V2.553l14.798.003V9.7H18V2.1c0-.63-.547-1.1-1.2-1.1H1.202Zm11.723 2.805a2.094 2.094 0 0 0-1.621.832 2.127 2.127 0 0 0 1.136 3.357 2.13 2.13 0 0 0 2.611-1.506 2.133 2.133 0 0 0-.76-2.244 2.13 2.13 0 0 0-1.366-.44Z"/><path clip-rule="evenodd" d="M19.898 12.369v6.187a.844.844 0 0 1-.844.844h-8.719a.844.844 0 0 1-.843-.844v-7.312a.844.844 0 0 1 .843-.844h2.531a.843.843 0 0 1 .597.248l.838.852h4.75c.223 0 .441.114.6.272a.844.844 0 0 1 .247.597Zm-1.52.654-4.377.02-1.1-1.143H11v6h7.4l-.023-4.877Z"/></svg>',
          tooltip: true,
        });

        view.on('execute', () => {
          setType('image');
          setOpen(true);
        });

        return view;
      });
    }
  }
  class CustomVideo extends Plugin {
    init() {
      const editor = this.editor;

      editor.ui.componentFactory.add('video', locale => {
        const view = new ButtonView(locale);

        view.set({
          label: 'Insert Video',
          icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 6.83v10.34c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6.83c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-11 8.77 4.55-2.61L11 10.38v5.22z"/></svg>',
          tooltip: true,
        });

        view.on('execute', () => {
          setType('video');
          setOpen(true);
        });

        return view;
      });
    }
  }

  return (
    <WysiwygWrapper className="flex flex-col">
      <span className="text-sm text-slate-400">
        {label}
        {required && <i className="ml-[4px] fa-solid fa-circle-info"></i>}
      </span>
      <Form.Item rules={rules} required={required}>
        <CKEditor
          editor={ClassicEditor}
          onReady={editor => {
            editorRef.current = editor;
          }}
          config={{
            initialData: form.getFieldValue(name),

            toolbar: {
              items: [
                'heading',
                '|',
                'fontSize',
                'fontFamily',
                'fontColor',
                'fontBackgroundColor',
                '|',
                'alignment',
                'bold',
                'italic',
                'underline',
                'image',
                'video',
                // 'code',
                // 'subscript',
                // 'superscript',
                'link',
                'bulletedList',
                'numberedList',
                // 'highlight',
                // '|',
                // 'outdent',
                // 'indent',
                '|',
                'insertTable',
                'mediaEmbed',
                'htmlEmbed',
                'undo',
                'redo',
                'sourceEditing',
                'removeFormat',
              ],
            },

            mediaEmbed: {
              previewsInData: true,
            },
            image: {
              resizeOptions: [
                {
                  name: 'resizeImage:original',
                  value: null,
                  label: 'Original',
                },
                {
                  name: 'resizeImage:custom',
                  label: 'Custom',
                  value: 'custom',
                },
                {
                  name: 'resizeImage:40',
                  value: '40',
                  label: '40%',
                },
                {
                  name: 'resizeImage:60',
                  value: '60',
                  label: '60%',
                },
              ],
              toolbar: [
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'linkImage',
                'resizeImage',
              ],
            },
            htmlSupport: {
              allow: [
                {
                  name: /.*/,
                  attributes: true,
                  classes: true,

                  styles: true,
                },
              ],
            },
            heading: {
              options: [
                {
                  model: 'paragraph',
                  title: 'Paragraph',
                  class: 'ck-heading_paragraph',
                },
                {
                  model: 'heading1',
                  view: 'h1',
                  title: 'Heading 1',
                  class: 'ck-heading_heading1',
                },
                {
                  model: 'heading2',
                  view: 'h2',
                  title: 'Heading 2',
                  class: 'ck-heading_heading2',
                },
                {
                  model: 'heading3',
                  view: 'h3',
                  title: 'Heading 3',
                  class: 'ck-heading_heading3',
                },
                {
                  model: 'heading4',
                  view: 'h4',
                  title: 'Heading 4',
                  class: 'ck-heading_heading4',
                },
                {
                  model: 'heading5',
                  view: 'h5',
                  title: 'Heading 5',
                  class: 'ck-heading_heading5',
                },
                {
                  model: 'heading6',
                  view: 'h6',
                  title: 'Heading 6',
                  class: 'ck-heading_heading6',
                },
              ],
            },

            link: {
              defaultProtocol: 'http://',
              decorators: {
                toggleDownloadable: {
                  mode: 'manual',
                  label: 'Downloadable',
                  attributes: {
                    download: 'file',
                  },
                },

                toggleDofollow: {
                  mode: 'manual',
                  label: 'Dofollow',
                  attributes: {
                    rel: 'dofollow',
                  },
                },
                toggleNofollow: {
                  mode: 'manual',
                  label: 'Nofollow',
                  attributes: {
                    rel: 'nofollow',
                  },
                },
                openInNewTab: {
                  mode: 'manual',
                  label: 'Open in a new tab',
                  defaultValue: false,
                  attributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  },
                },
              },
            },
            fontSize: {
              options: [10, 12, 14, 'default', 18, 20, 22],
              supportAllValues: true,
            },
            htmlEmbed: {
              showPreviews: true,
            },
            fontColor: {
              colors: [
                {
                  color: 'hsl(0, 0%, 0%)',
                  label: 'Black',
                },
                {
                  color: 'hsl(0, 0%, 30%)',
                  label: 'Dim grey',
                },
                {
                  color: 'hsl(0, 0%, 60%)',
                  label: 'Grey',
                },
                {
                  color: 'hsl(0, 0%, 90%)',
                  label: 'Light grey',
                },
                {
                  color: 'hsl(0, 0%, 100%)',
                  label: 'White',
                  hasBorder: true,
                },
                // More colors.
                // ...
              ],
            },
            fontBackgroundColor: {
              colors: [
                {
                  color: 'hsl(0, 75%, 60%)',
                  label: 'Red',
                },
                {
                  color: 'hsl(30, 75%, 60%)',
                  label: 'Orange',
                },
                {
                  color: 'hsl(60, 75%, 60%)',
                  label: 'Yellow',
                },
                {
                  color: 'hsl(90, 75%, 60%)',
                  label: 'Light green',
                },
                {
                  color: 'hsl(120, 75%, 60%)',
                  label: 'Green',
                },
                // More colors.
                // ...
              ],
            },
            list: {
              properties: {
                styles: true,
                startIndex: true,
                reversed: true,
              },
            },
            plugins: [
              Bold,
              Essentials,
              Italic,
              Mention,
              Paragraph,
              Undo,
              Heading,
              FontSize,
              FontFamily,
              FontColor,
              FontBackgroundColor,
              Alignment,
              Underline,
              Link,

              MediaEmbed,
              SourceEditing,
              Table,
              List,
              ListUI,

              RemoveFormat,
              Image,
              ImageEditing,
              CustomImage,
              ImageInsert,
              CustomVideo,
              ImageUtils,
              ImageToolbar,
              ImageCaption,
              ImageUpload,
              ImageResize,
              ImageStyle,
              HtmlEmbed,
            ],
          }}
          onChange={(e, crr) => {
            form.setFieldValue(name, editorRef.current?.getData());
          }}
        />
      </Form.Item>
      <GalleryModal
        key={`${type}-${name}`}
        open={open}
        setOpen={setOpen}
        type={type}
        children={undefined}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      />
    </WysiwygWrapper>
  );
};
export default Wysiwyg;
