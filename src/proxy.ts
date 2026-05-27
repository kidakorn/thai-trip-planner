import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match root, /en, /th, and all their sub-paths
  matcher: ['/', '/(en|th)', '/(en|th)/(.*)']
};
