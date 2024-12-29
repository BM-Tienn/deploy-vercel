import styled from 'styled-components/macro';
import 'ckeditor5/ckeditor5.css';
export const WysiwygWrapper = styled.div`
  .ck-editor__top {
    --ck-border-radius: 6px !important;
  }
  .ck-content {
    border-bottom-right-radius: 6px !important;
    border-bottom-left-radius: 6px !important;
  }
  .ck-editor__editable_inline {
    padding: 0 30px !important;
  }
`;
