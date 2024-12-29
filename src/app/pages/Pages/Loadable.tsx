/**
 * Asynchronously loads the component for Pages
 */

import { lazyLoad } from 'utils/loadable';

export const Pages = lazyLoad(
  () => import('./index'),
  module => module.Pages,
);
