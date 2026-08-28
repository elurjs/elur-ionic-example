/**
 * HomePage — modern dashboard design with hero card, stats, and overlay demos.
 */
import { html, signal, effect, elurRouter } from "@elurjs/core";
import {
    IonPage,
    createToast,
    createAlert,
    createLoading,
    createActionSheet,
    createPicker,
    createPopover,
    withLoading,
    confirm,
    type PageContext,
} from "@elurjs/ionic";

const toast = createToast();
const alert = createAlert();
const loading = createLoading();
const actionSheet = createActionSheet();
const picker = createPicker();
const popover = createPopover();

export class HomePage extends IonPage {
    private lastResult = signal<string>("none");
    private pickerValue = signal<string>("Red");

    constructor(ctx: PageContext) {
        super(ctx.lc);
    }

    override onMount() {
        effect(() => {
            const r = alert.result.value as { role?: string } | null;
            if (r) this.lastResult.value = `alert: ${r.role ?? "unknown"}`;
        });

        effect(() => {
            const r = actionSheet.result.value as { role?: string } | null;
            if (r) this.lastResult.value = `action-sheet: ${r.role ?? "unknown"}`;
        });

        effect(() => {
            const r = picker.result.value as { role?: string; data?: any } | null;
            if (r) {
                const col = r.data?.color;
                if (col) this.pickerValue.value = col.text ?? col.value ?? "unknown";
                this.lastResult.value = `picker: ${this.pickerValue.value}`;
            }
        });
    }

    override ionViewWillEnter() {
        console.log("[home] ionViewWillEnter");
    }

    override ionViewDidEnter() {
        console.log("[home] ionViewDidEnter");
    }

    private async showToast() {
        await toast.present({
            message: "Hello from elur-ionic!",
            duration: 2000,
            color: "primary",
            position: "bottom",
            icon: "sparkles-outline",
        });
    }

    private async showAlert() {
        await alert.present({
            header: "Confirm Action",
            message: "Are you sure you want to proceed with this operation?",
            buttons: [
                { text: "Cancel", role: "cancel" },
                { text: "OK", role: "confirm" },
            ],
        });
    }

    private async showLoading() {
        await loading.present({ message: "Loading...", spinner: "crescent" });
        setTimeout(() => loading.dismiss(), 1500);
    }

    private async showActionSheet() {
        await actionSheet.present({
            header: "Choose an action",
            buttons: [
                { text: "Delete", role: "destructive" },
                { text: "Share", role: "sharing" },
                { text: "Cancel", role: "cancel" },
            ],
        });
    }

    private async showPicker() {
        await picker.present({
            columns: [
                {
                    name: "color",
                    options: [
                        { text: "Red", value: "red" },
                        { text: "Blue", value: "blue" },
                        { text: "Green", value: "green" },
                    ],
                },
            ],
            buttons: [
                { text: "Cancel", role: "cancel" },
                { text: "Done", role: "confirm" },
            ],
        });
    }

    private async showPopover(event: Event) {
        await popover.present({
            event,
            translucent: true,
            component: () => html`
                <div style="padding: 20px; min-width: 200px;">
                    <p style="margin: 0 0 12px; font-weight: 700; font-size: 16px;">
                        Quick Actions
                    </p>
                    <ion-button
                        size="small"
                        expand="block"
                        fill="clear"
                        @click=${() => popover.dismiss()}
                    >
                        <ion-icon slot="start" name="share-outline"></ion-icon>
                        Share
                    </ion-button>
                    <ion-button
                        size="small"
                        expand="block"
                        fill="clear"
                        @click=${() => popover.dismiss()}
                    >
                        <ion-icon slot="start" name="link-outline"></ion-icon>
                        Copy Link
                    </ion-button>
                </div>
            `,
        });
    }

    private async doAsyncWork() {
        await withLoading(
            { message: "Fetching data..." },
            async () => {
                await new Promise((r) => setTimeout(r, 1500));
                this.lastResult.value = "async work done";
            },
        );
    }

    private async doConfirm() {
        const ok = await confirm({
            header: "Delete item",
            message: "This action cannot be undone.",
            confirmText: "Delete",
            cancelText: "Cancel",
        });
        this.lastResult.value = `confirm: ${ok ? "yes" : "no"}`;
    }

    override render() {
        return html`
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-title>elur-ionic</ion-title>
                    <ion-buttons slot="end">
                        <ion-button @click=${(e: Event) => this.showPopover(e)}>
                            <ion-icon slot="icon-only" name="ellipsis-vertical"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <!-- Hero card -->
                <div class="hero-card">
                    <h1 style="font-size: 24px; font-weight: 800;">Welcome back</h1>
                    <p style="font-size: 15px;">Explore the elur-ionic features</p>
                    <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
                        <ion-chip style="--background: rgba(255,255,255,0.2); color: #fff;">
                            <ion-icon name="flash-outline"></ion-icon>
                            Signal-based
                        </ion-chip>
                        <ion-chip style="--background: rgba(255,255,255,0.2); color: #fff;">
                            <ion-icon name="leaf-outline"></ion-icon>
                            Tree-shakeable
                        </ion-chip>
                    </div>
                </div>

                <!-- Stats grid -->
                <div class="app-grid-3">
                    <div class="stat-card">
                        <div class="stat-value" style="color: var(--ion-color-primary);">7</div>
                        <div class="stat-label">Overlays</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="color: var(--ion-color-success);">4</div>
                        <div class="stat-label">Tabs</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="color: var(--ion-color-warning);">2.0</div>
                        <div class="stat-label">Version</div>
                    </div>
                </div>

                <!-- Last result -->
                ${() =>
                this.lastResult.value !== "none"
                    ? html`
                            <div style="padding: 16px; margin-top: 8px;">
                                <ion-chip color="primary" style="font-weight: 600;">
                                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                                    ${() => this.lastResult.value}
                                </ion-chip>
                            </div>
                        `
                    : null}

                <!-- Overlays section -->
                <h2 class="section-title">Overlays</h2>
                <p class="section-subtitle">Toast, alert, loading, action sheet, picker, popover</p>

                <ion-list lines="full">
                    <ion-item button detail @click=${() => this.showToast()}>
                        <div slot="start" class="icon-circle icon-circle-primary">
                            <ion-icon name="chatbubble-outline"></ion-icon>
                        </div>
                        <ion-label>
                            <h3 style="font-weight: 600;">Toast</h3>
                            <p style="color: var(--app-text-secondary);">Quick message</p>
                        </ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.showAlert()}>
                        <div slot="start" class="icon-circle icon-circle-warning">
                            <ion-icon name="alert-circle-outline"></ion-icon>
                        </div>
                        <ion-label>
                            <h3 style="font-weight: 600;">Alert</h3>
                            <p style="color: var(--app-text-secondary);">Confirm dialog</p>
                        </ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.showLoading()}>
                        <div slot="start" class="icon-circle icon-circle-secondary">
                            <ion-icon name="hourglass-outline"></ion-icon>
                        </div>
                        <ion-label>
                            <h3 style="font-weight: 600;">Loading</h3>
                            <p style="color: var(--app-text-secondary);">Spinner overlay</p>
                        </ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.showActionSheet()}>
                        <div slot="start" class="icon-circle icon-circle-danger">
                            <ion-icon name="list-outline"></ion-icon>
                        </div>
                        <ion-label>
                            <h3 style="font-weight: 600;">Action Sheet</h3>
                            <p style="color: var(--app-text-secondary);">Bottom sheet menu</p>
                        </ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.showPicker()}>
                        <div slot="start" class="icon-circle icon-circle-primary">
                            <ion-icon name="color-palette-outline"></ion-icon>
                        </div>
                        <ion-label>
                            <h3 style="font-weight: 600;">Picker</h3>
                            <p style="color: var(--app-text-secondary);">Column selector</p>
                        </ion-label>
                    </ion-item>

                    <ion-item button detail @click=${(e: Event) => this.showPopover(e)}>
                        <div slot="start" class="icon-circle icon-circle-success">
                            <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                        </div>
                        <ion-label>
                            <h3 style="font-weight: 600;">Popover</h3>
                            <p style="color: var(--app-text-secondary);">Floating menu</p>
                        </ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.doAsyncWork()}>
                        <div slot="start" class="icon-circle icon-circle-secondary">
                            <ion-icon name="cloud-download-outline"></ion-icon>
                        </div>
                        <ion-label>
                            <h3 style="font-weight: 600;">withLoading()</h3>
                            <p style="color: var(--app-text-secondary);">Auto-dismiss task</p>
                        </ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.doConfirm()}>
                        <div slot="start" class="icon-circle icon-circle-warning">
                            <ion-icon name="help-circle-outline"></ion-icon>
                        </div>
                        <ion-label>
                            <h3 style="font-weight: 600;">confirm()</h3>
                            <p style="color: var(--app-text-secondary);">Promise dialog</p>
                        </ion-label>
                    </ion-item>
                </ion-list>

                <!-- Navigation section -->
                <h2 class="section-title">Navigation</h2>
                <p class="section-subtitle">Cached routes with TTL, deep stacks</p>

                <div style="padding: 0 16px;">
                    <ion-button
                        expand="block"
                        @click=${() => elurRouter().navigate("/detail/42")}
                    >
                        <ion-icon slot="start" name="arrow-forward-circle-outline"></ion-icon>
                        Go to Detail (TTL 30s)
                    </ion-button>
                </div>

                <div class="app-spacer"></div>
            </ion-content>
        `;
    }
}
