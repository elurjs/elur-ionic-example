# nix-ionic-example

Complete example app demonstrating the recommended patterns for
`@deijose/nix-ionic` 2.0.0 — tabs, overlays, cache policies, page-state
persistence, and optional Capacitor.

## What this app demonstrates

| Feature | Where |
| --- | --- |
| **Vite plugin auto-registration** | `vite.config.ts` + `src/main.ts` (`virtual:nix-ionic/registration`) — see below |
| **initializeNixIonic + registerIonicComponents** | `src/main.ts` (via virtual module) |
| **IonRouterOutlet with tabs** | `src/main.ts` |
| **NavigationManager with hooks** | `src/main.ts` (`beforeNav`, `afterNav`, `onTabChange`) |
| **Cache policies (LRU/FIFO/TTL)** | `src/main.ts` (outlet-level + per-route) |
| **createBottomTabBar** | `src/main.ts` |
| **IonPage class-based pages** | `HomePage`, `ProfilePage`, `SettingsPage`, `DetailPage` |
| **Composables pattern** | `SearchPage` (`useIonViewWillEnter`, `useIonViewDidLeave`) |
| **IonBackButton** | `DetailPage`, `ProfilePage`, `SettingsPage` |
| **All overlays** | `HomePage` (toast, alert, loading, action-sheet, picker, popover) |
| **createModalController + Nix.js delegate** | `ProfilePage` (edit modal) |
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
cd nix-ionic-example
npm install
npm run dev
```

Open http://localhost:3000

## What is `virtual:nix-ionic/registration`?

It's a **virtual module** generated in memory by the `nixIonic()` Vite plugin.
It is not a physical file — Vite generates it during the build.

The plugin scans all your `html\`\`` templates for `<ion-*>` tags and
`name="icon-name"` attributes on `<ion-icon>`. Then it generates a module
that imports **only** the components and icons you actually use:

```ts
// virtual:nix-ionic/registration (generated in memory)
import { initializeNixIonic, registerIonicComponents, registerIonicons } from "@deijose/nix-ionic";
import { defineIonButton } from "@deijose/nix-ionic/components/button";
import { defineIonContent } from "@deijose/nix-ionic/components/content";
// ... only the components detected in your templates

import { home } from "ionicons/icons/home";
import { search } from "ionicons/icons/search";
// ... only the icons detected

initializeNixIonic();
registerIonicComponents(defineIonButton, defineIonContent, ...);
registerIonicons({ home, search, ... });
```

Your `import "virtual:nix-ionic/registration"` runs all of that automatically.

**Core tags** (`ion-app`, `ion-router-outlet`, `ion-back-button`, `ion-icon`)
are skipped — they're already registered by `initializeNixIonic()`.

**Without the plugin** (manual alternative):

```ts
import { initializeNixIonic, registerIonicComponents } from "@deijose/nix-ionic";
import { defineIonButton } from "@deijose/nix-ionic/components/button";
import { defineIonContent } from "@deijose/nix-ionic/components/content";

initializeNixIonic();
registerIonicComponents(defineIonButton, defineIonContent);
```

## Build

```bash
npm run build
npm run preview
```

## Architecture

```
nix-ionic-example/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts          # nixIonic() Vite plugin
└── src/
    ├── main.ts             # Setup, router, NavigationManager, tabs, App
    └── pages/
        ├── HomePage.ts     # All overlays demo
        ├── SearchPage.ts   # Composables pattern + LRU cache
        ├── ProfilePage.ts  # Page-state persistence + modal delegate
        ├── SettingsPage.ts # cache: false + form controls
        ├── DetailPage.ts   # Route params + TTL cache + pull-to-refresh
        └── ModalContentPage.ts  # NixTemplate inside modal
```

## Recommended patterns

### 1. Use the Vite plugin for component registration

```ts
// vite.config.ts
import { nixIonic } from "@deijose/nix-ionic/vite-plugin";

export default {
    plugins: [nixIonic()],
};

// src/main.ts
import "virtual:nix-ionic/registration";
```

The plugin scans `html\`\`` templates for `<ion-*>` tags and `name="icon"`
attributes, then generates a virtual module that imports only what you use
and calls `initializeNixIonic()` + `registerIonicComponents()`.

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
import { isNative, createCapacitorApp } from "@deijose/nix-ionic/capacitor";

if (isNative()) {
    await createCapacitorApp({ statusBar: { style: "dark" } });
}
// On web, all Capacitor calls are no-ops — zero bundle cost.
```

## License

MIT
