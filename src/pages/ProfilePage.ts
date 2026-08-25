/**
 * ProfilePage — demonstrates:
 *   - Page-state persistence (opt-in, serializable only)
 *   - createModalController with Nix.js delegate
 *   - Reactive form state with signals
 */
import { html, signal, nixRouter } from "@deijose/nix-js";
import {
    IonPage,
    IonBackButton,
    createPageState,
    createModalController,
    type PageContext,
} from "@deijose/nix-ionic";

// Modal controller with Nix.js delegate (mounts NixTemplate inside modal)
const modal = createModalController();

export class ProfilePage extends IonPage {
    private name = signal("");
    private email = signal("");
    private bio = signal("");
    private saved = signal(false);

    // Page-state controller — persists declared signals to localStorage.
    // Signals are declared at construction time.
    private pageState = createPageState(
        "profile",
        {
            name: this.name,
            email: this.email,
            bio: this.bio,
        },
        { storage: "local", namespace: "nix-ionic-example" },
    );

    constructor(ctx: PageContext) {
        super(ctx.lc);
    }

    override ionViewWillEnter() {
        // Restore persisted state when entering the page
        this.pageState.restore();
        console.log("[profile] restored state");
    }

    override ionViewWillLeave() {
        // Save state before leaving
        this.pageState.save();
        console.log("[profile] saved state");
    }

    private async showEditModal() {
        await modal.present({
            component: () => html`
                <ion-header>
                    <ion-toolbar color="primary">
                        <ion-title>Edit Profile</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click=${() => modal.dismiss()}>Close</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-item>
                        <ion-input
                            label="Name"
                            label-placement="stacked"
                            .value=${() => this.name.value}
                            @ionInput=${(e: CustomEvent) => {
                    this.name.value = String((e.target as HTMLIonInputElement).value ?? "");
                }}
                        ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-input
                            label="Email"
                            label-placement="stacked"
                            type="email"
                            .value=${() => this.email.value}
                            @ionInput=${(e: CustomEvent) => {
                    this.email.value = String((e.target as HTMLIonInputElement).value ?? "");
                }}
                        ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-textarea
                            label="Bio"
                            label-placement="stacked"
                            rows="3"
                            .value=${() => this.bio.value}
                            @ionInput=${(e: CustomEvent) => {
                    this.bio.value = String((e.target as HTMLIonTextareaElement).value ?? "");
                }}
                        ></ion-textarea>
                    </ion-item>
                    <ion-button
                        expand="block"
                        class="ion-margin-top"
                        @click=${() => {
                    this.pageState.save();
                    this.saved.value = true;
                    modal.dismiss();
                }}
                    >
                        Save Changes
                    </ion-button>
                </ion-content>
            `,
            presentingElement: document.querySelector("ion-router-outlet") ?? undefined,
        });
    }

    override render() {
        const isEdit = window.location.hash.includes("/edit");

        return html`
            <ion-header>
                <ion-toolbar color="primary">
                    ${isEdit
                ? html`
                            <ion-buttons slot="start">
                                ${IonBackButton("/profile")}
                            </ion-buttons>
                        `
                : null}
                    <ion-title>Profile</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <div style="text-align: center; margin: 24px 0;">
                    <ion-avatar style="margin: 0 auto 16px; width: 96px; height: 96px;">
                        <div
                            style="
                                width: 100%; height: 100%;
                                background: var(--ion-color-primary);
                                display: flex; align-items: center; justify-content: center;
                                color: white; font-size: 36px; font-weight: bold;
                            "
                        >
                            ${() => (this.name.value ? this.name.value[0].toUpperCase() : "?")}
                        </div>
                    </ion-avatar>
                    <h2>${() => this.name.value || "No name set"}</h2>
                    <p style="color: var(--ion-color-medium);">
                        ${() => this.email.value || "No email set"}
                    </p>
                </div>

                <ion-card>
                    <ion-card-header>
                        <ion-card-title>Bio</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        ${() => this.bio.value || "No bio yet. Click edit to add one."}
                    </ion-card-content>
                </ion-card>

                ${() =>
                this.saved.value
                    ? html`
                            <ion-note color="success" class="ion-padding">
                                <ion-icon name="checkmark-circle"></ion-icon>
                                Profile saved!
                            </ion-note>
                        `
                    : null}

                <ion-button
                    expand="block"
                    class="ion-margin-top"
                    @click=${() => this.showEditModal()}
                >
                    <ion-icon slot="start" name="create-outline"></ion-icon>
                    Edit Profile (Modal)
                </ion-button>

                <ion-button
                    expand="block"
                    fill="outline"
                    class="ion-margin-top"
                    @click=${() => nixRouter().navigate("/profile/edit")}
                >
                    Edit Page (pushed)
                </ion-button>

                <ion-button
                    expand="block"
                    fill="clear"
                    color="danger"
                    class="ion-margin-top"
                    @click=${() => {
                this.pageState.clear();
                this.name.value = "";
                this.email.value = "";
                this.bio.value = "";
                this.saved.value = false;
            }}
                >
                    Clear Saved Data
                </ion-button>
            </ion-content>
        `;
    }
}
