/**
 * SettingsPage — demonstrates:
 *   - cache: false (page remounts fresh every visit)
 *   - Toggle/Select/Range form controls
 *   - Navigation to sub-page (/settings/about)
 */
import { html, signal, nixRouter } from "@deijose/nix-js";
import {
    IonPage,
    IonBackButton,
    createToast,
    type PageContext,
} from "@deijose/nix-ionic";

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
        // Because cache: false, this runs fresh on every visit
        this.mountCount.value++;
        console.log("[settings] fresh mount #", this.mountCount.value);
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
        const isAbout = window.location.hash.includes("/about");

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
            <ion-list lines="full">
                <ion-list-header>
                    <ion-label>Appearance</ion-label>
                </ion-list-header>

                <ion-item>
                    <ion-icon slot="start" name="moon-outline"></ion-icon>
                    <ion-toggle
                        .checked=${() => this.darkMode.value}
                        @ionChange=${(e: CustomEvent) => {
                this.darkMode.value = (e.target as HTMLIonToggleElement).checked;
            }}
                    >
                        Dark Mode
                    </ion-toggle>
                </ion-item>

                <ion-item>
                    <ion-icon slot="start" name="text-outline"></ion-icon>
                    <ion-range
                        min="12"
                        max="24"
                        step="1"
                        .value=${() => this.fontSize.value}
                        @ionChange=${(e: CustomEvent) => {
                const val = (e.target as HTMLIonRangeElement).value;
                this.fontSize.value = typeof val === "number" ? val : 14;
            }}
                    >
                        <div slot="label">Font size: ${() => this.fontSize.value}px</div>
                    </ion-range>
                </ion-item>
            </ion-list>

            <ion-list lines="full">
                <ion-list-header>
                    <ion-label>Notifications</ion-label>
                </ion-list-header>

                <ion-item>
                    <ion-icon slot="start" name="notifications-outline"></ion-icon>
                    <ion-toggle
                        .checked=${() => this.notifications.value}
                        @ionChange=${(e: CustomEvent) => {
                this.notifications.value = (e.target as HTMLIonToggleElement).checked;
            }}
                    >
                        Push Notifications
                    </ion-toggle>
                </ion-item>
            </ion-list>

            <ion-list lines="full">
                <ion-list-header>
                    <ion-label>Language</ion-label>
                </ion-list-header>

                <ion-item>
                    <ion-icon slot="start" name="language-outline"></ion-icon>
                    <ion-select
                        label="Interface language"
                        .value=${() => this.language.value}
                        @ionChange=${(e: CustomEvent) => {
                this.language.value = (e.target as HTMLIonSelectElement).value ?? "en";
            }}
                    >
                        <ion-select-option value="en">English</ion-select-option>
                        <ion-select-option value="es">Español</ion-select-option>
                        <ion-select-option value="fr">Français</ion-select-option>
                        <ion-select-option value="de">Deutsch</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>

            <div class="ion-padding">
                <ion-button expand="block" @click=${() => this.saveSettings()}>
                    Save Settings
                </ion-button>
                <ion-button
                    expand="block"
                    fill="outline"
                    class="ion-margin-top"
                    @click=${() => nixRouter().navigate("/settings/about")}
                >
                    About this app
                </ion-button>
            </div>

            <p class="ion-padding" style="color: var(--ion-color-medium); text-align: center;">
                Fresh mounts: ${() => this.mountCount.value}
                <br />
                <small>(cache: false — state resets on leave)</small>
            </p>
        `;
    }

    private renderAbout() {
        return html`
            <ion-content class="ion-padding">
                <div style="text-align: center; margin-top: 32px;">
                    <ion-icon
                        name="logo-ionic"
                        style="font-size: 72px; color: var(--ion-color-primary);"
                    ></ion-icon>
                    <h1>nix-ionic Example</h1>
                    <p>Version 1.0.0</p>
                    <p style="color: var(--ion-color-medium);">
                        Built with @deijose/nix-ionic 2.0.0<br />
                        Powered by Nix.js + Ionic Core 8
                    </p>
                </div>

                <ion-list lines="none" class="ion-margin-top">
                    <ion-item>
                        <ion-icon slot="start" name="code-slash-outline"></ion-icon>
                        <ion-label>
                            <h3>Tree-shakeable</h3>
                            <p>Only the components you use are bundled</p>
                        </ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-icon slot="start" name="flash-outline"></ion-icon>
                        <ion-label>
                            <h3>Signal-based</h3>
                            <p>Fine-grained reactivity, no virtual DOM</p>
                        </ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-icon slot="start" name="phone-portrait-outline"></ion-icon>
                        <ion-label>
                            <h3>Capacitor ready</h3>
                            <p>Optional native plugins, zero web cost</p>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </ion-content>
        `;
    }
}
