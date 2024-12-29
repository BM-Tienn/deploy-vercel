/// <reference types="react-scripts" />

// To solve the issue: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245
/// <reference types="styled-components/cssprop" />

declare module '*.svg?react' {
  import type { ComponentProps } from 'react';

  export const ReactComponent: React.FunctionComponent<
    ComponentProps<'svg'> & { title?: string }
  >;
}
