/**
 * Asynchronously loads the component for Layout
 */

import { lazyLoad } from 'utils/loadable';

export const MediaLibrary = lazyLoad(
  () => import('./index'),
  module => module.MediaLibrary,
);
