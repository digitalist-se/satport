import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['fi', 'en'],
  // Used when no locale matches
  defaultLocale: 'en',
  // Do not try to from anywhere else but the path.
  localeDetection: false
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration.
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
