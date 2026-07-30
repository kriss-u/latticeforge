/** Single source of truth for app routes — imported by App.tsx for routing and by vite.config.ts for sitemap generation. */
export const routes = {
  home: "/",
  about: "/about",
} as const
