/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const AnalyticReport = lazyLoad(
  () => import('./index'),
  module => module.AnalyticReport,
);
