/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const AdminSetting = lazyLoad(
  () => import('./index'),
  module => module.AdminSetting,
);
