/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const Indexing = lazyLoad(
  () => import('./index'),
  module => module.Indexing,
);
