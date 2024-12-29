/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const Pricing = lazyLoad(
  () => import('./index'),
  module => module.Pricing,
);
