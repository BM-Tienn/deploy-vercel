/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const Discount = lazyLoad(
  () => import('./index'),
  module => module.Discount,
);
