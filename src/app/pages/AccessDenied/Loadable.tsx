/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const AccessDenied = lazyLoad(
  () => import('./index'),
  module => module.AccessDenied,
);
