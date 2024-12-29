/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const ObjectDetail = lazyLoad(
  () => import('./index'),
  module => module.ObjectDetail,
);
