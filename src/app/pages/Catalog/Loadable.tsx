/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const Catalog = lazyLoad(
  () => import('./index'),
  module => module.Catalog,
);