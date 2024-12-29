/**
 * Asynchronously loads the component for ObjectPage
 */

import { lazyLoad } from 'utils/loadable';

export const ObjectPage = lazyLoad(
  () => import('./index'),
  module => module.ObjectPage,
);
