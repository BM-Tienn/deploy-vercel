/**
 * Asynchronously loads the component for ObjectPage
 */

import { lazyLoad } from 'utils/loadable';

export const Translation = lazyLoad(
  () => import('./index'),
  module => module.Translation,
);
