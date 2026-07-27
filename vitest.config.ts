import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        environment: "node",
        // SLH-DSA-256s signing/verification is slow relative to the other algorithms.
        testTimeout: 60000,
    },
});
