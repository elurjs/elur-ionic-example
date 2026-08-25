/**
 * HomePage — demonstrates all overlay types and navigation.
 */
import { html, signal, nixRouter } from "@deijose/nix-js";
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
} from "@deijose/nix-ionic";

// Overlay handles — created once, reused across presentations
const toast = createToast();
const alert = createAlert();
const loading = createLoading();
const actionSheet = createActionSheet();
const picker = createPicker();
const popover = createPopover();

export class HomePage extends IonPage {
    private lastResult = signal<string>("none");
    private pickerValue = signal<string>("red");

    constructor(ctx: PageContext) {
        super(ctx.lc);
    }

    override ionViewWillEnter() {
        console.log("[home] ionViewWillEnter");
    }

    override ionViewDidEnter() {
        console.log("[home] ionViewDidEnter");
    }

    private async showToast() {
        await toast.present({
            message: "Hello from nix-ionic!",
            duration: 2000,
            color: "primary",
            position: "bottom",
        });
    }

    private async showAlert() {
        await alert.present({
            header: "Confirm",
            message: "Are you sure you want to proceed?",
            buttons: [
                { text: "Cancel", role: "cancel" },
                { text: "OK", role: "confirm" },
            ],
        });
        // result signal updates when the alert is dismissed
        const role = (alert.result.value as { role?: string } | null)?.role ?? "unknown";
        this.lastResult.value = `alert: ${role}`;
    }

    private async showLoading() {
        await loading.present({ message: "Loading...", spinner: "crescent" });
        // Auto-dismiss after 1.5s
        setTimeout(() => loading.dismiss(), 1500);
    }

    private async showActionSheet() {
        await actionSheet.present({
            header: "Choose an action",
            buttons: [
                { text: "Delete", role: "destructive" },
                { text: "Share" },
                { text: "Cancel", role: "cancel" },
            ],
        });
        const role = (actionSheet.result.value as { role?: string } | null)?.role ?? "unknown";
        this.lastResult.value = `action-sheet: ${role}`;
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
        this.lastResult.value = `picker: ${this.pickerValue.value}`;
    }

    private async showPopover(event: Event) {
        await popover.present({
            event,
            translucent: true,
            component: () => html`
                <div style="padding: 16px;">
                    <p style="margin: 0 0 8px; font-weight: bold;">Popover from Nix.js</p>
                    <ion-button size="small" @click=${() => popover.dismiss()}>Close</ion-button>
                </div>
            `,
        });
    }

    private async doAsyncWork() {
        // withLoading: presents loading, runs task, auto-dismisses on settle/error
        await withLoading(
            { message: "Fetching data..." },
            async () => {
                await new Promise((r) => setTimeout(r, 1500));
                this.lastResult.value = "async work done";
            },
        );
    }

    private async doConfirm() {
        // confirm(): promise-based confirm dialog
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
                    <ion-title>Home</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <h2>nix-ionic Example</h2>
                <p>Last result: <strong>${() => this.lastResult.value}</strong></p>
                <p>Picker value: <strong>${() => this.pickerValue.value}</strong></p>

                <ion-list lines="full">
                    <ion-item button detail @click=${() => this.showToast()}>
                        <ion-icon slot="start" name="toast-outline"></ion-icon>
                        <ion-label>Show Toast</ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.showAlert()}>
                        <ion-icon slot="start" name="alert-circle-outline"></ion-icon>
                        <ion-label>Show Alert</ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.showLoading()}>
                        <ion-icon slot="start" name="hourglass-outline"></ion-icon>
                        <ion-label>Show Loading</ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.showActionSheet()}>
                        <ion-icon slot="start" name="list-outline"></ion-icon>
                        <ion-label>Show Action Sheet</ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.showPicker()}>
                        <ion-icon slot="start" name="color-palette-outline"></ion-icon>
                        <ion-label>Show Picker</ion-label>
                    </ion-item>

                    <ion-item
                        button
                        detail
                        @click=${(e: Event) => this.showPopover(e)}
                    >
                        <ion-icon slot="start" name="ellipsis-vertical-outline"></ion-icon>
                        <ion-label>Show Popover</ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.doAsyncWork()}>
                        <ion-icon slot="start" name="cloud-download-outline"></ion-icon>
                        <ion-label>withLoading() async task</ion-label>
                    </ion-item>

                    <ion-item button detail @click=${() => this.doConfirm()}>
                        <ion-icon slot="start" name="help-circle-outline"></ion-icon>
                        <ion-label>confirm() promise dialog</ion-label>
                    </ion-item>
                </ion-list>

                <ion-button
                    expand="block"
                    class="ion-margin-top"
                    @click=${() => nixRouter().navigate("/detail/42")}
                >
                    Go to Detail (cached, TTL 30s)
                </ion-button>
            </ion-content>
        `;
    }
}
