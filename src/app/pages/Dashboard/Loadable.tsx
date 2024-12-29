/**
 * Asynchronously loads the component for ObjectDetail
 */

import { lazyLoad } from 'utils/loadable';

export const Dashboard = lazyLoad(
  () => import('./index'),
  module => module.Dashboard,
);
