/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const LiveView = lazyLoad(
  () => import('./index'),
  module => module.LiveView,
);
