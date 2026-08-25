/**
 * SearchPage — demonstrates:
 *   - Composables pattern (useIonView* instead of class-based)
 *   - Per-route cache policy (LRU max 5)
 *   - Reactive search with signal
 */
import { html, signal, nixRouter } from "@deijose/nix-js";
import {
    useIonViewWillEnter,
    useIonViewDidLeave,
    type PageContext,
} from "@deijose/nix-ionic";

const ALL_ITEMS = [
    "Apple", "Banana", "Cherry", "Date", "Elderberry",
    "Fig", "Grape", "Honeydew", "Kiwi", "Lemon",
    "Mango", "Nectarine", "Orange", "Papaya", "Quince",
];

export function SearchPage(ctx: PageContext) {
    const query = signal("");
    const results = signal<string[]>(ALL_ITEMS);
    const searchCount = signal(0);

    // Composable pattern: useIonView* hooks
    useIonViewWillEnter(ctx.lc, () => {
        console.log("[search] ionViewWillEnter — restoring focus");
        searchCount.value++;
    });

    useIonViewDidLeave(ctx.lc, () => {
        console.log("[search] ionViewDidLeave — state preserved by cache");
    });

    // Reactive filter
    function performSearch() {
        const q = query.value.toLowerCase().trim();
        results.value = q
            ? ALL_ITEMS.filter((item) => item.toLowerCase().includes(q))
            : ALL_ITEMS;
    }

    return html`
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Search</ion-title>
            </ion-toolbar>
            <ion-toolbar>
                <ion-searchbar
                    placeholder="Search fruits..."
                    .value=${() => query.value}
                    @ionInput=${(e: CustomEvent) => {
            query.value = (e.target as HTMLIonSearchbarElement).value ?? "";
            performSearch();
        }}
                ></ion-searchbar>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <p class="ion-padding" style="color: var(--ion-color-medium);">
                Searches performed: ${() => searchCount.value} ·
                Results: ${() => results.value.length}
            </p>
            <ion-list>
                ${() =>
            results.value.map(
                (item) => html`
                            <ion-item
                                button
                                detail
                                @click=${() => nixRouter().navigate(`/detail/${item.toLowerCase()}`)}
                            >
                                <ion-icon slot="start" name="nutrition-outline"></ion-icon>
                                <ion-label>${item}</ion-label>
                            </ion-item>
                        `,
            )}
            </ion-list>
            ${() =>
            results.value.length === 0
                ? html`
                        <div class="ion-padding ion-text-center">
                            <ion-icon
                                name="search-outline"
                                style="font-size: 48px; color: var(--ion-color-medium);"
                            ></ion-icon>
                            <p>No results found</p>
                        </div>
                    `
                : null}
        </ion-content>
    `;
}
