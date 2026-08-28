# elur-ionic-example

Complete example app demonstrating the recommended patterns for
`@elurjs/ionic` 2.0.0 — tabs, overlays, cache policies, page-state
persistence, and optional Capacitor.

## What this app demonstrates

| Feature | Where |
| --- | --- |
| **Vite plugin auto-registration** | `vite.config.ts` + `src/main.ts` (`virtual:elur-ionic/registration`) — see below |
| **initializeElurIonic + registerIonicComponents** | `src/main.ts` (via virtual module) |
| **IonRouterOutlet with tabs** | `src/main.ts` |
| **NavigationManager with hooks** | `src/main.ts` (`beforeNav`, `afterNav`, `onTabChange`) |
| **Cache policies (LRU/FIFO/TTL)** | `src/main.ts` (outlet-level + per-route) |
| **createBottomTabBar** | `src/main.ts` |
| **IonPage class-based pages** | `HomePage`, `ProfilePage`, `SettingsPage`, `DetailPage` |
| **Composables pattern** | `SearchPage` (`useIonViewWillEnter`, `useIonViewDidLeave`) |
| **IonBackButton** | `DetailPage`, `ProfilePage`, `SettingsPage` |
| **All overlays** | `HomePage` (toast, alert, loading, action-sheet, picker, popover) |
| **createModalController + Elur delegate** | `ProfilePage` (edit modal) |
| **withLoading() helper** | `HomePage` (async task with auto loading spinner) |
| **confirm() helper** | `HomePage` (promise-based confirm dialog) |
| **Page-state persistence** | `ProfilePage` (localStorage, serializable signals) |
| **Route params** | `DetailPage` (`ctx.params.id`) |
| **Pull-to-refresh** | `DetailPage` (`ion-refresher`) |
| **Cache: false (fresh remount)** | `SettingsPage` |
| **Cache: TTL (30s expiry)** | `DetailPage` |
| **Cache: LRU max (5 entries)** | `SearchPage` |
| **Capacitor (optional)** | `src/main.ts` (`isNative()`, `createCapacitorApp()`) |
| **Hash mode router** | `src/main.ts` (`mode: "hash"`) |

## Setup

```bash
cd elur-ionic-example
npm install
npm run dev
```

Open http://localhost:3000

## What is `virtual:elur-ionic/registration`?

It's a **virtual module** generated in memory by the `elurIonic()` Vite plugin.
It is not a physical file — Vite generates it during the build.

The plugin scans all your `html\`\`` templates for `<ion-*>` tags and
`name="icon-name"` attributes on `<ion-icon>`. Then it generates a module
that imports **only** the components and icons you actually use:

```ts
// virtual:elur-ionic/registration (generated in memory)
import { initializeElurIonic, registerIonicComponents, registerIonicons } from "@elurjs/ionic";
import { defineIonButton } from "@elurjs/ionic/components/button";
import { defineIonContent } from "@elurjs/ionic/components/content";
// ... only the components detected in your templates

import { home } from "ionicons/icons/home";
import { search } from "ionicons/icons/search";
// ... only the icons detected

initializeElurIonic();
registerIonicComponents(defineIonButton, defineIonContent, ...);
registerIonicons({ home, search, ... });
```

Your `import "virtual:elur-ionic/registration"` runs all of that automatically.

**Core tags** (`ion-app`, `ion-router-outlet`, `ion-back-button`, `ion-icon`)
are skipped — they're already registered by `initializeElurIonic()`.

**Without the plugin** (manual alternative):

```ts
import { initializeElurIonic, registerIonicComponents } from "@elurjs/ionic";
import { defineIonButton } from "@elurjs/ionic/components/button";
import { defineIonContent } from "@elurjs/ionic/components/content";

initializeElurIonic();
registerIonicComponents(defineIonButton, defineIonContent);
```

## Build

```bash
npm run build
npm run preview
```

## Architecture

```
elur-ionic-example/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts          # elurIonic() Vite plugin
└── src/
    ├── main.ts             # Setup, router, NavigationManager, tabs, App
    └── pages/
        ├── HomePage.ts     # All overlays demo
        ├── SearchPage.ts   # Composables pattern + LRU cache
        ├── ProfilePage.ts  # Page-state persistence + modal delegate
        ├── SettingsPage.ts # cache: false + form controls
        ├── DetailPage.ts   # Route params + TTL cache + pull-to-refresh
        └── ModalContentPage.ts  # ElurTemplate inside modal
```

## Recommended patterns

### 1. Use the Vite plugin for component registration

```ts
// vite.config.ts
import { elurIonic } from "@elurjs/ionic/vite-plugin";

export default {
    plugins: [elurIonic()],
};

// src/main.ts
import "virtual:elur-ionic/registration";
```

The plugin scans `html\`\`` templates for `<ion-*>` tags and `name="icon"`
attributes, then generates a virtual module that imports only what you use
and calls `initializeElurIonic()` + `registerIonicComponents()`.

### 2. Use NavigationManager for hooks

```ts
const nav = new NavigationManager({
    tabs: ["/", "/search", "/profile", "/settings"],
    beforeNav: [(to, from) => { console.log(`${from} → ${to}`); return true; }],
    afterNav: [(_to, _from) => { /* analytics */ }],
    onTabChange: [(tab) => console.log(`tab: ${tab}`)],
});

const outlet = new IonRouterOutlet(routes, {
    tabs: ["/", "/search", "/profile", "/settings"],
    cachePolicy: { max: 10, strategy: "lru" },
    navigation: nav,
});
```

### 3. Use create* overlays (not use*)

```ts
const toast = createToast();
await toast.present({ message: "Hello!", duration: 2000 });
// toast.presented.value === true
// toast.result.value === { role: "close" }
```

### 4. Use page-state persistence for form data

```ts
const state = createPageState("profile", {}, { storage: "local" });

// In ionViewWillEnter:
state.bind({ name: nameSignal, email: emailSignal });
state.restore();

// In ionViewWillLeave:
state.save();
```

### 5. Keep Capacitor optional

```ts
import { isNative, createCapacitorApp } from "@elurjs/ionic/capacitor";

if (isNative()) {
    await createCapacitorApp({ statusBar: { style: "dark" } });
}
// On web, all Capacitor calls are no-ops — zero bundle cost.
```

## License

MIT
