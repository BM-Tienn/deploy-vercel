/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const Inventory = lazyLoad(
  () => import('./index'),
  module => module.Inventory,
);
