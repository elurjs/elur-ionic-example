import { test, expect, type Page } from "@playwright/test";

async function getTabButtonBounds(page: Page, index: number) {
    return page.evaluate((i) => {
        const btn = document.querySelectorAll("ion-tab-button")[i] as HTMLElement;
        if (!btn) return null;
        const rect = btn.getBoundingClientRect();
        const icon = btn.querySelector("ion-icon") as HTMLElement;
        const label = btn.querySelector("ion-label") as HTMLElement;
        const iconRect = icon?.getBoundingClientRect();
        const labelRect = label?.getBoundingClientRect();
        const iconSize = icon
            ? { w: iconRect!.width, h: iconRect!.height, fontSize: getComputedStyle(icon).fontSize }
            : null;
        const labelSize = label
            ? { w: labelRect!.width, h: labelRect!.height, top: labelRect!.top }
            : null;
        return {
            btn: { w: rect.width, h: rect.height, top: rect.top, bottom: rect.bottom },
            icon: iconSize,
            label: labelSize,
            selected: btn.selected,
            classes: btn.className,
            hasIconClass: btn.classList.contains("tab-has-icon"),
            hasLabelOnlyClass: btn.classList.contains("tab-has-label-only"),
            hasIconOnlyClass: btn.classList.contains("tab-has-icon-only"),
            layoutClass: Array.from(btn.classList).filter(c => c.startsWith("tab-layout")),
        };
    }, index);
}

test.beforeEach(async ({ page }) => {
    // Wait for Ionic to fully load
    await page.goto("http://localhost:3000/#/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000); // extra time for Stencil hydration
});

test("tab bar is at the bottom of the screen", async ({ page }) => {
    const bar = page.locator("ion-tab-bar");
    await expect(bar).toBeVisible();
    const barBox = await bar.boundingBox();
    const viewport = page.viewportSize();
    expect(barBox).not.toBeNull();
    // Tab bar should be near the bottom (within 100px of bottom edge)
    expect(barBox!.y + barBox!.height).toBeGreaterThan(viewport!.height - 100);
});

test("tab bar is NOT at the top of the screen", async ({ page }) => {
    const bar = page.locator("ion-tab-bar");
    const barBox = await bar.boundingBox();
    expect(barBox).not.toBeNull();
    // Tab bar should NOT be at the top (should be more than 100px from top)
    expect(barBox!.y).toBeGreaterThan(100);
});

test("tab buttons have correct selected property", async ({ page }) => {
    // Home tab (index 0) should be selected on initial load
    const homeBtn = await getTabButtonBounds(page, 0);
    expect(homeBtn?.selected).toBe(true);
    expect(homeBtn?.classes).toContain("tab-selected");
});

test("tab button icon has stable size (no resize on click)", async ({ page }) => {
    // Get initial icon size on Home tab
    const before = await getTabButtonBounds(page, 0);
    console.log("Before click - Home tab:", JSON.stringify(before, null, 2));

    // Click on Search tab (index 1)
    await page.click("ion-tab-button:nth-child(2)");
    await page.waitForTimeout(1000);

    // Get Search tab icon size
    const afterSearch = await getTabButtonBounds(page, 1);
    console.log("After click - Search tab:", JSON.stringify(afterSearch, null, 2));

    // Click back to Home tab
    await page.click("ion-tab-button:nth-child(1)");
    await page.waitForTimeout(1000);

    // Get Home tab icon size again
    const afterHome = await getTabButtonBounds(page, 0);
    console.log("After click back - Home tab:", JSON.stringify(afterHome, null, 2));

    // The icon size should be stable (not resize)
    if (before?.icon && afterHome?.icon) {
        const wDiff = Math.abs(afterHome.icon.w - before.icon.w);
        const hDiff = Math.abs(afterHome.icon.h - before.icon.h);
        console.log(`Icon width diff: ${wDiff}px, height diff: ${hDiff}px`);
        // Allow small differences (sub-pixel), but not large resizes
        expect(wDiff).toBeLessThan(5);
        expect(hDiff).toBeLessThan(5);
    }
});

test("tab button icon and label don't overlap", async ({ page }) => {
    const btn = await getTabButtonBounds(page, 0);
    console.log("Tab button 0:", JSON.stringify(btn, null, 2));

    if (btn?.icon && btn?.label) {
        // Icon should be above label (icon.bottom <= label.top)
        // Or at least not overlapping significantly
        const overlap = btn.icon.h + btn.label.h - btn.btn.h;
        console.log(`Overlap: ${overlap}px (negative = no overlap)`);
        // The icon and label should fit within the button height
        // If they overlap, the total height exceeds the button height
        expect(overlap).toBeLessThanOrEqual(5);
    }
});

test("tab button has correct internal Stencil classes", async ({ page }) => {
    const btn = await getTabButtonBounds(page, 0);
    console.log("Tab button 0 internal classes:", JSON.stringify({
        hasIconClass: btn?.hasIconClass,
        hasLabelOnlyClass: btn?.hasLabelOnlyClass,
        hasIconOnlyClass: btn?.hasIconOnlyClass,
        layoutClass: btn?.layoutClass,
    }, null, 2));

    // Should have tab-has-icon class (since we have both icon and label)
    expect(btn?.hasIconClass).toBe(true);
    // Should NOT have tab-has-label-only (we have an icon)
    expect(btn?.hasLabelOnlyClass).toBe(false);
    // Should NOT have tab-has-icon-only (we have a label)
    expect(btn?.hasIconOnlyClass).toBe(false);
});

test("clicking tabs switches selected state correctly", async ({ page }) => {
    // Click Search tab
    await page.click("ion-tab-button:nth-child(2)");
    await page.waitForTimeout(500);

    const searchBtn = await getTabButtonBounds(page, 1);
    const homeBtn = await getTabButtonBounds(page, 0);

    expect(searchBtn?.selected).toBe(true);
    expect(homeBtn?.selected).toBe(false);

    // Click Profile tab
    await page.click("ion-tab-button:nth-child(3)");
    await page.waitForTimeout(500);

    const profileBtn = await getTabButtonBounds(page, 2);
    const searchBtnAfter = await getTabButtonBounds(page, 1);

    expect(profileBtn?.selected).toBe(true);
    expect(searchBtnAfter?.selected).toBe(false);
});
