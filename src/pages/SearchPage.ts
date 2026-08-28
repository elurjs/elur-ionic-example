/**
 * SearchPage — modern search with cards and icons.
 */
import { html, signal, elurRouter } from "@elurjs/core";
import {
    useIonViewWillEnter,
    useIonViewDidLeave,
    type PageContext,
} from "@elurjs/ionic";

const ALL_ITEMS = [
    { name: "Apple", emoji: "🍎", color: "danger", category: "Fruit" },
    { name: "Banana", emoji: "🍌", color: "warning", category: "Fruit" },
    { name: "Cherry", emoji: "🍒", color: "danger", category: "Fruit" },
    { name: "Date", emoji: "🌴", color: "tertiary", category: "Exotic" },
    { name: "Elderberry", emoji: "🫐", color: "primary", category: "Berry" },
    { name: "Fig", emoji: "🪴", color: "success", category: "Fruit" },
    { name: "Grape", emoji: "🍇", color: "primary", category: "Fruit" },
    { name: "Honeydew", emoji: "🍈", color: "success", category: "Melon" },
    { name: "Kiwi", emoji: "🥝", color: "success", category: "Exotic" },
    { name: "Lemon", emoji: "🍋", color: "warning", category: "Fruit" },
    { name: "Mango", emoji: "🥭", color: "warning", category: "Exotic" },
    { name: "Nectarine", emoji: "🍑", color: "danger", category: "Fruit" },
    { name: "Orange", emoji: "🍊", color: "warning", category: "Fruit" },
    { name: "Papaya", emoji: "🍐", color: "success", category: "Exotic" },
    { name: "Quince", emoji: "🍋", color: "warning", category: "Fruit" },
];

export function SearchPage(ctx: PageContext) {
    const query = signal("");
    const results = signal(ALL_ITEMS);
    const searchCount = signal(0);

    useIonViewWillEnter(ctx.lc, () => {
        searchCount.value++;
    });

    useIonViewDidLeave(ctx.lc, () => {
        console.log("[search] state preserved by cache");
    });

    function performSearch() {
        const q = query.value.toLowerCase().trim();
        results.value = q
            ? ALL_ITEMS.filter((item) => item.name.toLowerCase().includes(q))
            : ALL_ITEMS;
    }

    return html`
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Search</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-searchbar
                placeholder="Search fruits..."
                debounce="100"
                @ionInput=${(e: CustomEvent) => {
            query.value = (e.target as HTMLIonSearchbarElement).value ?? "";
            performSearch();
        }}
            ></ion-searchbar>

            <div style="padding: 8px 16px; display: flex; gap: 8px; align-items: center;">
                <ion-chip color="primary" style="font-weight: 600;">
                    <ion-icon name="search-outline"></ion-icon>
                    ${() => results.value.length} results
                </ion-chip>
                <ion-chip color="medium" style="font-weight: 600;">
                    <ion-icon name="eye-outline"></ion-icon>
                    ${() => searchCount.value} visits
                </ion-chip>
            </div>

            ${() =>
            results.value.length === 0
                ? html`
                        <div class="empty-state">
                            <ion-icon name="search-outline"></ion-icon>
                            <h3>No results found</h3>
                            <p>Try a different search term</p>
                        </div>
                    `
                : html`
                        <ion-list lines="full">
                            ${() =>
                        results.value.map(
                            (item) => html`
                                        <ion-item
                                            button
                                            detail
                                            @click=${() => elurRouter().navigate(`/detail/${item.name.toLowerCase()}`)}
                                        >
                                            <div
                                                slot="start"
                                                class="icon-circle icon-circle-${item.color === "danger"
                                    ? "danger"
                                    : item.color === "warning"
                                        ? "warning"
                                        : item.color === "success"
                                            ? "success"
                                            : "primary"}"
                                                style="font-size: 24px;"
                                            >
                                                ${item.emoji}
                                            </div>
                                            <ion-label>
                                                <h3 style="font-weight: 600;">${item.name}</h3>
                                                <p style="color: var(--app-text-secondary);">${item.category}</p>
                                            </ion-label>
                                        </ion-item>
                                    `,
                        )}
                        </ion-list>
                    `}
            <div class="app-spacer"></div>
        </ion-content>
    `;
}
