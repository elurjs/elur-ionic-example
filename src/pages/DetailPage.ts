/**
 * DetailPage — modern detail view with hero gradient and pull-to-refresh.
 */
import { html, signal, elurRouter } from "@elurjs/core";
import {
    IonPage,
    IonBackButton,
    createToast,
    type PageContext,
} from "@elurjs/ionic";

const toast = createToast();

export class DetailPage extends IonPage {
    private id: string;
    private enterCount = signal(0);
    private data = signal<string>("");
    private refreshing = signal(false);
    private loadTime = signal("");

    constructor(ctx: PageContext) {
        super(ctx.lc);
        this.id = ctx.params.id ?? "unknown";
    }

    override ionViewWillEnter() {
        this.enterCount.value++;
        if (this.data.value === "") {
            this.loadTime.value = new Date().toLocaleTimeString();
            setTimeout(() => {
                this.data.value = `Loaded at ${this.loadTime.value}`;
            }, 300);
        }
    }

    private async handleRefresh(event: CustomEvent) {
        this.refreshing.value = true;
        await new Promise((r) => setTimeout(r, 1000));
        this.loadTime.value = new Date().toLocaleTimeString();
        this.data.value = `Refreshed at ${this.loadTime.value}`;
        this.refreshing.value = false;
        (event.target as HTMLIonRefresherElement).complete();
        await toast.present({
            message: "Refreshed!",
            duration: 1000,
            color: "success",
            icon: "checkmark-circle",
        });
    }

    override render() {
        return html`
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-buttons slot="start">
                        ${IonBackButton("/")}
                    </ion-buttons>
                    <ion-title>Detail</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-refresher
                    slot="fixed"
                    @ionRefresh=${(e: CustomEvent) => this.handleRefresh(e)}
                >
                    <ion-refresher-content></ion-refresher-content>
                </ion-refresher>

                <!-- Hero card -->
                <div class="hero-card" style="background: var(--app-hero-gradient-2);">
                    <ion-icon
                        name="cube-outline"
                        style="font-size: 48px; color: #fff; margin-bottom: 12px;"
                    ></ion-icon>
                    <h1 style="font-size: 28px; font-weight: 800;">#${() => this.id}</h1>
                    <p style="font-size: 14px;">Cached with TTL 30s</p>
                </div>

                <!-- Stats -->
                <div class="app-grid">
                    <div class="stat-card">
                        <div class="stat-value" style="color: var(--ion-color-primary);">
                            ${() => this.enterCount.value}
                        </div>
                        <div class="stat-label">Visits</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="color: var(--ion-color-success);">
                            ${() => this.refreshing.value ? "..." : "OK"}
                        </div>
                        <div class="stat-label">Status</div>
                    </div>
                </div>

                <!-- Info card -->
                <h2 class="section-title">Information</h2>
                <ion-card>
                    <ion-card-content style="padding: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="color: var(--app-text-secondary); font-size: 14px;">ID</span>
                            <span style="font-weight: 700; font-size: 16px;">${() => this.id}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="color: var(--app-text-secondary); font-size: 14px;">Loaded</span>
                            <span style="font-weight: 600; font-size: 14px;">${() => this.loadTime.value || "—"}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: var(--app-text-secondary); font-size: 14px;">Cache</span>
                            <ion-chip color="success" style="font-weight: 600; font-size: 12px;">
                                <ion-icon name="time-outline"></ion-icon>
                                TTL 30s
                            </ion-chip>
                        </div>
                    </ion-card-content>
                </ion-card>

                <!-- Actions -->
                <div style="padding: 16px;">
                    <ion-button
                        expand="block"
                        @click=${() => elurRouter().navigate(`/detail/${Number(this.id) + 1}`)}
                    >
                        <ion-icon slot="start" name="arrow-forward"></ion-icon>
                        Go Deeper (#${() => Number(this.id) + 1})
                    </ion-button>
                </div>
                <div style="padding: 0 16px 8px;">
                    <ion-button
                        expand="block"
                        fill="outline"
                        @click=${() => elurRouter().back()}
                    >
                        <ion-icon slot="start" name="arrow-back"></ion-icon>
                        Back
                    </ion-button>
                </div>

                <div class="app-spacer"></div>
            </ion-content>
        `;
    }
}
