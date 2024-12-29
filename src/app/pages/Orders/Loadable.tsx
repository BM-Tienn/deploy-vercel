/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const Orders = lazyLoad(
  () => import('./index'),
  module => module.Orders,
);
