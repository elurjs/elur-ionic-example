import { defineConfig } from "vite";
import { elurIonic } from "@elurjs/ionic/vite-plugin";

export default defineConfig({
    root: ".",
    plugins: [
        elurIonic({
            allowTags: [
                "ion-app",
                // Layout
                "ion-header", "ion-toolbar", "ion-title", "ion-content",
                "ion-buttons", "ion-button", "ion-back-button",
                // Tab bar
                "ion-tab-bar", "ion-tab-button",
                // Lists
                "ion-list", "ion-list-header", "ion-item", "ion-label",
                "ion-note",
                // Cards
                "ion-card", "ion-card-header", "ion-card-title", "ion-card-content",
                // Forms
                "ion-input", "ion-textarea", "ion-toggle", "ion-select",
                "ion-select-option", "ion-range", "ion-searchbar",
                // Visual
                "ion-icon", "ion-avatar", "ion-chip", "ion-badge",
                "ion-progress-bar",
                // Refresher
                "ion-refresher", "ion-refresher-content",
                // Overlays (programmatic)
                "ion-toast", "ion-alert", "ion-loading",
                "ion-action-sheet", "ion-popover", "ion-modal",
                "ion-picker", "ion-picker-column", "ion-picker-column-option",
            ],
            allowIcons: [
                // Tab bar icons
                "home", "search", "person", "settings",
                // Home page
                "share-outline", "link-outline", "ellipsis-vertical",
                "flash-outline", "leaf-outline", "checkmark-circle-outline",
                "chatbubble-outline", "alert-circle-outline", "hourglass-outline",
                "list-outline", "color-palette-outline",
                "ellipsis-vertical-outline", "cloud-download-outline",
                "help-circle-outline", "arrow-forward-circle-outline",
                // Search page
                "search-outline", "eye-outline",
                // Profile page
                "create-outline", "arrow-forward-outline", "trash-outline",
                "person-outline",
                // Settings page
                "moon-outline", "text-outline", "notifications-outline",
                "language-outline", "save-outline", "information-circle-outline",
                // Detail page
                "arrow-back", "arrow-forward", "checkmark-circle",
                "checkmark-outline", "time-outline", "navigate-outline",
                "cube-outline", "document-text-outline", "code-slash-outline",
                "layers-outline", "phone-portrait-outline", "mail-outline",
                "sparkles",
            ],
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
