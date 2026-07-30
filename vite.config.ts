import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import sitemap from "vite-plugin-sitemap";
import { routes } from "./src/routes";

const routePaths = Object.values(routes);

export default defineConfig({
    plugins: [
        react(),
        sitemap({
            hostname: "https://latticeforge.nepcodex.com",
            // "/" is discovered automatically from dist/index.html; only list the rest here.
            dynamicRoutes: routePaths.filter((path) => path !== routes.home),
            changefreq: "monthly",
            priority: { [routes.home]: 1.0, [routes.about]: 0.5 },
            robots: [{ userAgent: "*", allow: "/" }],
        }),
    ],
    resolve: {
        tsconfigPaths: true,
    },
});
