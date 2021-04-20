/**
 *
 * Asynchronously loads the component for Price
 *
 */

import { lazyLoad } from 'utils/loadable'

export const Price = lazyLoad(
  () => import('./index'),
  module => module.Price,
)
