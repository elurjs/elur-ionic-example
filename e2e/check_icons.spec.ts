import { test, expect } from "@playwright/test";

test("verify icons and tabs render", async ({ page }) => {
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);

    const result = await page.evaluate(() => {
        const icons = Array.from(document.querySelectorAll("ion-icon")).slice(0, 8).map(el => ({
            name: el.getAttribute("name"),
            hasSvg: el.shadowRoot?.querySelector("svg") != null,
        }));
        const tabButtons = Array.from(document.querySelectorAll("ion-tab-button")).map(el => ({
            tab: el.getAttribute("tab"),
            selected: (el as any).selected,
        }));
        const tabsLayout = document.querySelector(".elur-ionic-tabs-layout");
        return { icons, tabButtons, tabsLayoutExists: !!tabsLayout };
    });
    console.log("RESULT:", JSON.stringify(result, null, 2));
});
