/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const Role = lazyLoad(
  () => import('./index'),
  module => module.Role,
);
