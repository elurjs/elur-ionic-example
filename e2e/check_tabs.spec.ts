import { test, expect } from "@playwright/test";

test("check tab attributes", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.waitForTimeout(3000);
    
    const buttons = await page.$$eval("ion-tab-button", els => 
        els.map(el => ({
            tabAttr: el.getAttribute("tab"),
            tabProp: (el as any).tab,
            layoutAttr: el.getAttribute("layout"),
            innerHTML: el.innerHTML.substring(0, 100),
        }))
    );
    console.log("TAB BUTTONS:", JSON.stringify(buttons, null, 2));
});
