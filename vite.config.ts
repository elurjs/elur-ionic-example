import { defineConfig } from "vite";
import { nixIonic } from "@deijose/nix-ionic/vite-plugin";

export default defineConfig({
    root: ".",
    plugins: [
        // Auto-detects <ion-*> tags and ion-icon names in html`` templates.
        // Generates a virtual module with only the components/icons you use.
        nixIonic({
            // Optional: suppress diagnostics for dynamically-rendered tags
            allowTags: ["ion-tab-bar", "ion-tab-button"],
        }),
    ],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: "dist",
        sourcemap: true,
    },
});
