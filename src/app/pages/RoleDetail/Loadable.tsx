/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const RoleDetail = lazyLoad(
  () => import('./index'),
  module => module.RoleDetail,
);
