/**
 * elur-ionic-example — main entry
 */

// --- Ionic Core CSS ---
import "@ionic/core/css/core.css";
import "@ionic/core/css/normalize.css";
import "@ionic/core/css/structure.css";
import "@ionic/core/css/typography.css";
import "@ionic/core/css/padding.css";
import "@ionic/core/css/float-elements.css";
import "@ionic/core/css/flex-utils.css";
import "@ionic/core/css/display.css";

// --- Dark mode palette (class-based: .ion-palette-dark) ---
import "@ionic/core/css/palettes/dark.class.css";

// --- App theme ---
import "./theme.css";

// --- Elur core ---
import { ElurComponent, html, mount, elurRouter, createRouter } from "@elurjs/core";

// --- Elur Ionic ---
import {
    IonRouterOutlet,
    createBottomTabBar,
    createTabsLayout,
    NavigationManager,
    type RouteDefinition,
} from "@elurjs/ionic";

// --- Ionicons ---
import { home, search, person, settings } from "ionicons/icons";

// --- Auto-generated registration (Vite plugin) ---
import "virtual:elur-ionic/registration";

// --- Pages ---
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { DetailPage } from "./pages/DetailPage";

// --- Optional: Capacitor (no-op on web) ---
import { isNative, createCapacitorApp } from "@elurjs/ionic/capacitor";

// =============================================================
// Router — history mode (clean URLs: /detail/42, not /#/detail/42)
// =============================================================

createRouter(
    [
        { path: "/" },
        { path: "/search" },
        { path: "/profile" },
        { path: "/profile/edit" },
        { path: "/settings" },
        { path: "/settings/about" },
        { path: "/detail/:id" },
        { path: "*" },
    ],
    { mode: "history" },
);

// =============================================================
// NavigationManager
// =============================================================

const nav = new NavigationManager({
    tabs: ["/", "/search", "/profile", "/settings"],
});

nav.beforeNav((to: string) => {
    console.log(`[nav] → ${to}`);
    return true;
});

nav.onTabChange((tab: string) => {
    console.log(`[tab] ${tab}`);
});

// =============================================================
// Routes
// =============================================================

const routes: RouteDefinition[] = [
    { path: "/", component: (ctx) => new HomePage(ctx) },
    { path: "/search", component: (ctx) => SearchPage(ctx), cache: { max: 5, strategy: "lru" } },
    { path: "/profile", component: (ctx) => new ProfilePage(ctx) },
    { path: "/profile/edit", component: (ctx) => new ProfilePage(ctx) },
    { path: "/settings", component: (ctx) => new SettingsPage(ctx), cache: false },
    { path: "/settings/about", component: (ctx) => new SettingsPage(ctx) },
    { path: "/detail/:id", component: (ctx) => new DetailPage(ctx), cache: { ttl: 30_000 } },
];

// =============================================================
// IonRouterOutlet
// =============================================================

const outlet = new IonRouterOutlet(routes, {
    tabs: ["/", "/search", "/profile", "/settings"],
    cachePolicy: { max: 10, strategy: "lru" },
    navigation: nav,
});

// =============================================================
// Tab bar — personalized with cssVars + badges
// =============================================================

const tabBar = createBottomTabBar(
    [
        { label: "Home", icon: "home", path: "/" },
        { label: "Search", icon: "search", path: "/search" },
        { label: "Profile", icon: "person", path: "/profile", badge: "!" },
        { label: "Settings", icon: "settings", path: "/settings" },
    ],
    {
        hiddenPaths: ["/detail/*", "/profile/edit"],
        icons: { home, search, person, settings },
        cssVars: {
            "--background": "var(--app-tab-bg)",
            "--color-selected": "var(--ion-color-primary)",
            "--color": "var(--app-tab-inactive)",
        },
    },
);

const tabsLayout = createTabsLayout(outlet, tabBar);

// =============================================================
// App
// =============================================================

class App extends ElurComponent {
    override render() {
        return html`<ion-app>${tabsLayout}</ion-app>`;
    }
}

// =============================================================
// Capacitor (no-op on web)
// =============================================================

if (isNative()) {
    const capApp = createCapacitorApp({
        statusBar: { backgroundColor: "#3880ff", overlaysWebView: false },
        splashScreen: { fadeOutDuration: 300 },
        backButton: { defaultHref: "/" },
    });
    capApp.ready().then(() => console.log("[capacitor] ready"));
}

// =============================================================
// Mount
// =============================================================

(window as any).__router = elurRouter();
(window as any).__nav = nav;

mount(new App(), "#app");
