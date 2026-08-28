import { test, expect } from "@playwright/test";

test("debug: capture screenshots", async ({ page }) => {
    page.on("console", (msg) => console.log(`[browser ${msg.type()}]`, msg.text()));
    page.on("pageerror", (err) => console.log("[browser error]", err.message));

    await page.goto("http://localhost:3000/");
    await page.waitForTimeout(3000);

    // Check if ion-app is defined
    const ionAppDefined = await page.evaluate(() => {
        return typeof customElements !== "undefined" ? customElements.get("ion-app") !== undefined : false;
    });
    console.log("ion-app defined:", ionAppDefined);

    // Check if ion-toolbar is defined
    const toolbarDefined = await page.evaluate(() => {
        return customElements.get("ion-toolbar") !== undefined;
    });
    console.log("ion-toolbar defined:", toolbarDefined);

    // Check if ion-button is defined
    const buttonDefined = await page.evaluate(() => {
        return customElements.get("ion-button") !== undefined;
    });
    console.log("ion-button defined:", buttonDefined);

    // Check if ion-content is defined
    const contentDefined = await page.evaluate(() => {
        return customElements.get("ion-content") !== undefined;
    });
    console.log("ion-content defined:", contentDefined);

    // Check if ion-icon is defined
    const iconDefined = await page.evaluate(() => {
        return customElements.get("ion-icon") !== undefined;
    });
    console.log("ion-icon defined:", iconDefined);

    // Check if ion-list is defined
    const listDefined = await page.evaluate(() => {
        return customElements.get("ion-list") !== undefined;
    });
    console.log("ion-list defined:", listDefined);

    // Check if ion-item is defined
    const itemDefined = await page.evaluate(() => {
        return customElements.get("ion-item") !== undefined;
    });
    console.log("ion-item defined:", itemDefined);

    // Check body content
    const bodyHTML = await page.evaluate(() => {
        const app = document.querySelector("ion-app");
        return app ? app.innerHTML.substring(0, 500) : "NO ION-APP";
    });
    console.log("body content (first 500 chars):", bodyHTML);

    // Check what custom elements ARE defined
    const definedElements = await page.evaluate(() => {
        const tags = ["ion-app","ion-header","ion-toolbar","ion-title","ion-buttons","ion-button","ion-content","ion-list","ion-item","ion-label","ion-icon","ion-card","ion-chip","ion-tab-bar","ion-tab-button","ion-tabs","ion-router-outlet","ion-back-button","ion-searchbar","ion-toggle","ion-select","ion-range","ion-input","ion-textarea","ion-avatar","ion-badge","ion-note","ion-refresher"];
        return tags.filter(t => customElements.get(t) !== undefined);
    });
    console.log("Defined custom elements:", definedElements.join(", "));

    // Check what's NOT defined
    const undefinedElements = await page.evaluate(() => {
        const tags = ["ion-app","ion-header","ion-toolbar","ion-title","ion-buttons","ion-button","ion-content","ion-list","ion-item","ion-label","ion-icon","ion-card","ion-chip","ion-tab-bar","ion-tab-button","ion-tabs","ion-router-outlet","ion-back-button","ion-searchbar","ion-toggle","ion-select","ion-range","ion-input","ion-textarea","ion-avatar","ion-badge","ion-note","ion-refresher"];
        return tags.filter(t => customElements.get(t) === undefined);
    });
    console.log("UNDEFINED custom elements:", undefinedElements.join(", "));

    await page.screenshot({ path: "debug-home.png", fullPage: true });
    console.log("Screenshot saved: debug-home.png");
});
