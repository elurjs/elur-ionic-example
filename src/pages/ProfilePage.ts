/**
 * ProfilePage — modern profile with hero gradient, stats, and edit modal.
 */
import { html, signal, elurRouter } from "@elurjs/core";
import {
    IonPage,
    IonBackButton,
    createPageState,
    createModal,
    type PageContext,
} from "@elurjs/ionic";

const modal = createModal();

export class ProfilePage extends IonPage {
    private name = signal("");
    private email = signal("");
    private bio = signal("");
    private saved = signal(false);

    private pageState = createPageState(
        "profile",
        {
            name: this.name,
            email: this.email,
            bio: this.bio,
        },
        { storage: "local", namespace: "elur-ionic-example" },
    );

    constructor(ctx: PageContext) {
        super(ctx.lc);
    }

    override ionViewWillEnter() {
        this.pageState.restore();
    }

    override ionViewWillLeave() {
        this.pageState.save();
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
                    <div style="padding: 8px 0 16px;">
                        <ion-note color="medium">Update your profile information</ion-note>
                    </div>
                    <ion-item lines="full">
                        <ion-icon slot="start" name="person-outline" color="primary"></ion-icon>
                        <ion-input
                            label="Name"
                            label-placement="stacked"
                            placeholder="Your name"
                            value=${() => this.name.value}
                            @ionInput=${(e: CustomEvent) => {
                    this.name.value = String((e.target as HTMLIonInputElement).value ?? "");
                }}
                        ></ion-input>
                    </ion-item>
                    <ion-item lines="full">
                        <ion-icon slot="start" name="mail-outline" color="primary"></ion-icon>
                        <ion-input
                            label="Email"
                            label-placement="stacked"
                            type="email"
                            placeholder="you@example.com"
                            value=${() => this.email.value}
                            @ionInput=${(e: CustomEvent) => {
                    this.email.value = String((e.target as HTMLIonInputElement).value ?? "");
                }}
                        ></ion-input>
                    </ion-item>
                    <ion-item lines="full">
                        <ion-icon slot="start" name="document-text-outline" color="primary"></ion-icon>
                        <ion-textarea
                            label="Bio"
                            label-placement="stacked"
                            rows="3"
                            placeholder="Tell us about yourself"
                            value=${() => this.bio.value}
                            @ionInput=${(e: CustomEvent) => {
                    this.bio.value = String((e.target as HTMLIonTextareaElement).value ?? "");
                }}
                        ></ion-textarea>
                    </ion-item>
                    <div style="padding: 24px 0;">
                        <ion-button
                            expand="block"
                            @click=${() => {
                    this.pageState.save();
                    this.saved.value = true;
                    modal.dismiss();
                }}
                        >
                            <ion-icon slot="start" name="checkmark-outline"></ion-icon>
                            Save Changes
                        </ion-button>
                    </div>
                </ion-content>
            `,
            presentingElement: document.querySelector("ion-router-outlet") ?? undefined,
        });
    }

    override render() {
        const isEdit = window.location.pathname.includes("/edit");

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
            <ion-content>
                <!-- Profile hero -->
                <div class="hero-card" style="text-align: center;">
                    <div class="app-avatar app-avatar-lg" style="margin: 0 auto 16px;">
                        ${() => this.name.value ? this.name.value[0].toUpperCase() : "?"}
                    </div>
                    <h1 style="font-size: 22px; font-weight: 800;">
                        ${() => this.name.value || "No name set"}
                    </h1>
                    <p style="font-size: 14px;">
                        ${() => this.email.value || "No email set"}
                    </p>
                </div>

                <!-- Stats -->
                <div class="app-grid">
                    <div class="stat-card">
                        <div class="stat-value" style="color: var(--ion-color-primary);">
                            ${() => this.bio.value.split(/\s+/).filter(Boolean).length}
                        </div>
                        <div class="stat-label">Words</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="color: var(--ion-color-success);">
                            ${() => (this.name.value ? 1 : 0)}
                        </div>
                        <div class="stat-label">Profile</div>
                    </div>
                </div>

                ${() =>
                this.saved.value
                    ? html`
                            <div style="padding: 16px;">
                                <ion-chip color="success" style="font-weight: 600;">
                                    <ion-icon name="checkmark-circle"></ion-icon>
                                    Profile saved!
                                </ion-chip>
                            </div>
                        `
                    : null}

                <!-- Bio card -->
                <h2 class="section-title">About</h2>
                <ion-card>
                    <ion-card-content style="padding: 20px;">
                        <p style="margin: 0; color: var(--app-text-primary); line-height: 1.6;">
                            ${() => this.bio.value || "No bio yet. Click edit to add one."}
                        </p>
                    </ion-card-content>
                </ion-card>

                <!-- Actions -->
                <div style="padding: 8px 16px;">
                    <ion-button
                        expand="block"
                        @click=${() => this.showEditModal()}
                    >
                        <ion-icon slot="start" name="create-outline"></ion-icon>
                        Edit Profile (Modal)
                    </ion-button>
                </div>
                <div style="padding: 8px 16px;">
                    <ion-button
                        expand="block"
                        fill="outline"
                        @click=${() => elurRouter().navigate("/profile/edit")}
                    >
                        <ion-icon slot="start" name="arrow-forward-outline"></ion-icon>
                        Edit Page (pushed)
                    </ion-button>
                </div>
                <div style="padding: 8px 16px;">
                    <ion-button
                        expand="block"
                        fill="clear"
                        color="danger"
                        @click=${() => {
                this.pageState.clear();
                this.name.value = "";
                this.email.value = "";
                this.bio.value = "";
                this.saved.value = false;
            }}
                    >
                        <ion-icon slot="start" name="trash-outline"></ion-icon>
                        Clear Saved Data
                    </ion-button>
                </div>

                <div class="app-spacer"></div>
            </ion-content>
        `;
    }
}
