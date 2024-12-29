/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const Customers = lazyLoad(
  () => import('./index'),
  module => module.Customers,
);
