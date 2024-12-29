/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const PageDetail = lazyLoad(
  () => import('./index'),
  module => module.PageDetail,
);
