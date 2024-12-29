/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const UserDetail = lazyLoad(
  () => import('./index'),
  module => module.UserDetail,
);