/**
 * DetailPage — demonstrates:
 *   - Route params extraction (ctx.params.id)
 *   - Cache with TTL (30s — page state preserved between visits)
 *   - Deep navigation stack (go deeper)
 *   - IonBackButton with reactive canGoBack
 *   - ion-refresher (pull to refresh)
 */
import { html, signal, nixRouter } from "@deijose/nix-js";
import {
    IonPage,
    IonBackButton,
    createToast,
    type PageContext,
} from "@deijose/nix-ionic";

const toast = createToast();

export class DetailPage extends IonPage {
    private id: string;
    private enterCount = signal(0);
    private data = signal<string>("Loading...");
    private refreshing = signal(false);

    constructor(ctx: PageContext) {
        super(ctx.lc);
        this.id = ctx.params.id ?? "unknown";
    }

    override ionViewWillEnter() {
        this.enterCount.value++;
        // Simulate data fetch on first enter
        if (this.data.value === "Loading...") {
            setTimeout(() => {
                this.data.value = `Item #${this.id} loaded at ${new Date().toLocaleTimeString()}`;
            }, 300);
        }
    }

    private async handleRefresh(event: CustomEvent) {
        this.refreshing.value = true;
        // Simulate async refresh
        await new Promise((r) => setTimeout(r, 1000));
        this.data.value = `Item #${this.id} refreshed at ${new Date().toLocaleTimeString()}`;
        this.refreshing.value = false;
        // Complete the refresher
        (event.target as HTMLIonRefresherElement).complete();
        await toast.present({
            message: "Refreshed!",
            duration: 1000,
            color: "success",
        });
    }

    override render() {
        return html`
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-buttons slot="start">
                        ${IonBackButton("/")}
                    </ion-buttons>
                    <ion-title>Detail #${() => this.id}</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <ion-refresher
                    @ionRefresh=${(e: CustomEvent) => this.handleRefresh(e)}
                >
                    <ion-refresher-content></ion-refresher-content>
                </ion-refresher>

                <h2>Detail Page</h2>
                <p><strong>ID:</strong> ${() => this.id}</p>
                <p><strong>Enters:</strong> ${() => this.enterCount.value}</p>
                <p><strong>Data:</strong> ${() => this.data.value}</p>
                <p><strong>Refreshing:</strong> ${() => (this.refreshing.value ? "yes" : "no")}</p>

                <ion-note color="medium" class="ion-padding">
                    This page is cached with TTL 30s. Navigate away and back within
                    30s to see preserved state. After 30s, the cache entry expires.
                </ion-note>

                <ion-button
                    expand="block"
                    class="ion-margin-top"
                    @click=${() => nixRouter().navigate(`/detail/${Number(this.id) + 1}`)}
                >
                    <ion-icon slot="start" name="arrow-forward"></ion-icon>
                    Go Deeper (#${() => Number(this.id) + 1})
                </ion-button>

                <ion-button
                    expand="block"
                    fill="outline"
                    class="ion-margin-top"
                    @click=${() => nixRouter().back()}
                >
                    <ion-icon slot="start" name="arrow-back"></ion-icon>
                    Back
                </ion-button>
            </ion-content>
        `;
    }
}
