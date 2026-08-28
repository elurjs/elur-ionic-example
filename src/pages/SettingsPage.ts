/**
 * SettingsPage — modern settings with grouped sections and dark mode toggle.
 */
import { html, signal, elurRouter } from "@elurjs/core";
import {
    IonPage,
    IonBackButton,
    createToast,
    type PageContext,
} from "@elurjs/ionic";

const toast = createToast();

export class SettingsPage extends IonPage {
    private darkMode = signal(false);
    private notifications = signal(true);
    private language = signal("en");
    private fontSize = signal(14);
    private mountCount = signal(0);

    constructor(ctx: PageContext) {
        super(ctx.lc);
    }

    override ionViewWillEnter() {
        this.mountCount.value++;
    }

    private toggleDarkMode() {
        this.darkMode.value = !this.darkMode.value;
        document.documentElement.classList.toggle("ion-palette-dark", this.darkMode.value);
    }

    private async saveSettings() {
        await toast.present({
            message: "Settings saved!",
            duration: 1500,
            color: "success",
            icon: "checkmark-circle",
        });
    }

    override render() {
        const isAbout = window.location.pathname.includes("/about");

        return html`
            <ion-header>
                <ion-toolbar color="primary">
                    ${isAbout
                ? html`
                            <ion-buttons slot="start">
                                ${IonBackButton("/settings")}
                            </ion-buttons>
                        `
                : null}
                    <ion-title>Settings</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                ${() => (isAbout ? this.renderAbout() : this.renderSettings())}
            </ion-content>
        `;
    }

    private renderSettings() {
        return html`
            <!-- Appearance -->
            <h2 class="section-title">Appearance</h2>
            <p class="section-subtitle">Customize how the app looks</p>

            <ion-list lines="full">
                <ion-item>
                    <div slot="start" class="icon-circle icon-circle-primary">
                        <ion-icon name="moon-outline"></ion-icon>
                    </div>
                    <ion-toggle
                        checked=${() => this.darkMode.value}
                        @ionChange=${() => this.toggleDarkMode()}
                    >
                        Dark Mode
                    </ion-toggle>
                </ion-item>

                <ion-item>
                    <div slot="start" class="icon-circle icon-circle-secondary">
                        <ion-icon name="text-outline"></ion-icon>
                    </div>
                    <ion-range
                        min="12"
                        max="24"
                        step="1"
                        value=${() => this.fontSize.value}
                        @ionChange=${(e: CustomEvent) => {
                const val = (e.target as HTMLIonRangeElement).value;
                this.fontSize.value = typeof val === "number" ? val : 14;
            }}
                    >
                        <div slot="label">Font size: ${() => this.fontSize.value}px</div>
                    </ion-range>
                </ion-item>
            </ion-list>

            <!-- Notifications -->
            <h2 class="section-title">Notifications</h2>
            <p class="section-subtitle">Manage your alerts</p>

            <ion-list lines="full">
                <ion-item>
                    <div slot="start" class="icon-circle icon-circle-warning">
                        <ion-icon name="notifications-outline"></ion-icon>
                    </div>
                    <ion-toggle
                        checked=${() => this.notifications.value}
                        @ionChange=${(e: CustomEvent) => {
                this.notifications.value = (e.target as HTMLIonToggleElement).checked;
            }}
                    >
                        Push Notifications
                    </ion-toggle>
                </ion-item>
            </ion-list>

            <!-- Language -->
            <h2 class="section-title">Language</h2>
            <p class="section-subtitle">Interface language</p>

            <ion-list lines="full">
                <ion-item>
                    <div slot="start" class="icon-circle icon-circle-success">
                        <ion-icon name="language-outline"></ion-icon>
                    </div>
                    <ion-select
                        label="Interface language"
                        label-placement="stacked"
                        value=${() => this.language.value}
                        @ionChange=${(e: CustomEvent) => {
                this.language.value = (e.target as HTMLIonSelectElement).value ?? "en";
            }}
                    >
                        <ion-select-option value="en">English</ion-select-option>
                        <ion-select-option value="es">Espanol</ion-select-option>
                        <ion-select-option value="fr">Francais</ion-select-option>
                        <ion-select-option value="de">Deutsch</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>

            <!-- Actions -->
            <div style="padding: 16px;">
                <ion-button expand="block" @click=${() => this.saveSettings()}>
                    <ion-icon slot="start" name="save-outline"></ion-icon>
                    Save Settings
                </ion-button>
            </div>
            <div style="padding: 0 16px 8px;">
                <ion-button
                    expand="block"
                    fill="outline"
                    @click=${() => elurRouter().navigate("/settings/about")}
                >
                    <ion-icon slot="start" name="information-circle-outline"></ion-icon>
                    About this app
                </ion-button>
            </div>

            <!-- Debug info -->
            <div style="padding: 24px 16px; text-align: center;">
                <ion-note color="medium" style="display: block; margin-bottom: 4px;">
                    Fresh mounts: ${() => this.mountCount.value}
                </ion-note>
                <ion-note color="medium" style="font-size: 12px;">
                    (cache: false - state resets on leave)
                </ion-note>
            </div>

            <div class="app-spacer"></div>
        `;
    }

    private renderAbout() {
        return html`
            <div class="hero-card" style="text-align: center;">
                <ion-icon
                    name="sparkles"
                    style="font-size: 56px; color: #fff; margin-bottom: 12px;"
                ></ion-icon>
                <h1 style="font-size: 24px; font-weight: 800;">elur-ionic</h1>
                <p style="font-size: 15px;">Version 2.0.5</p>
                <p style="font-size: 13px; opacity: 0.8; margin-top: 8px;">
                    Built with @elurjs/ionic<br />
                    Powered by Elur + Ionic Core 8
                </p>
            </div>

            <h2 class="section-title">Features</h2>

            <ion-list lines="none">
                <ion-item>
                    <div slot="start" class="icon-circle icon-circle-primary">
                        <ion-icon name="code-slash-outline"></ion-icon>
                    </div>
                    <ion-label>
                        <h3 style="font-weight: 600;">Tree-shakeable</h3>
                        <p style="color: var(--app-text-secondary);">Only the components you use are bundled</p>
                    </ion-label>
                </ion-item>
                <ion-item>
                    <div slot="start" class="icon-circle icon-circle-success">
                        <ion-icon name="flash-outline"></ion-icon>
                    </div>
                    <ion-label>
                        <h3 style="font-weight: 600;">Signal-based</h3>
                        <p style="color: var(--app-text-secondary);">Fine-grained reactivity, no virtual DOM</p>
                    </ion-label>
                </ion-item>
                <ion-item>
                    <div slot="start" class="icon-circle icon-circle-warning">
                        <ion-icon name="phone-portrait-outline"></ion-icon>
                    </div>
                    <ion-label>
                        <h3 style="font-weight: 600;">Capacitor ready</h3>
                        <p style="color: var(--app-text-secondary);">Optional native plugins, zero web cost</p>
                    </ion-label>
                </ion-item>
                <ion-item>
                    <div slot="start" class="icon-circle icon-circle-secondary">
                        <ion-icon name="layers-outline"></ion-icon>
                    </div>
                    <ion-label>
                        <h3 style="font-weight: 600;">Overlays</h3>
                        <p style="color: var(--app-text-secondary);">Toast, alert, loading, picker, modal, popover</p>
                    </ion-label>
                </ion-item>
                <ion-item>
                    <div slot="start" class="icon-circle icon-circle-danger">
                        <ion-icon name="navigate-outline"></ion-icon>
                    </div>
                    <ion-label>
                        <h3 style="font-weight: 600;">Navigation</h3>
                        <p style="color: var(--app-text-secondary);">Per-tab stacks, cache policies, TTL</p>
                    </ion-label>
                </ion-item>
            </ion-list>

            <div class="app-spacer"></div>
        `;
    }
}
