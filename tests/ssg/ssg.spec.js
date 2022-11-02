// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../helpers/verify-still-prerendered")
const verifyIfHydrated = require("../helpers/verify-if-hydrated")
const waitForHydration = require("../helpers/wait-for-hydration")

test.describe("ssg helpers", () => {
  test("verify hydration prevention", async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })

    await page.goto("/")

    const hydrateGlobalFlags = await page.evaluate(() => {
      return globalThis.canStacheElementInertPrerendered && globalThis.canMooStache
    })

    expect(hydrateGlobalFlags).toBe(true)

    const app = page.locator("can-app")

    await expect(app).toBeTruthy()

    expect(await verifyStillPrerendered(page)).toBe(true)

    const hydrateGlobalFlagsAfter = await page.evaluate(() => {
      return globalThis.canStacheElementInertPrerendered && globalThis.canMooStache
    })

    expect(hydrateGlobalFlagsAfter).toBe(true)
  })

  test("verify detecting hydration", async ({ page }) => {
    await page.goto("/")

    const hydrateGlobalFlags = await page.evaluate(() => {
      return globalThis.canStacheElementInertPrerendered && globalThis.canMooStache
    })

    expect(hydrateGlobalFlags).toBe(true)

    await waitForHydration(page)

    expect(await verifyIfHydrated(page)).toBe(true)

    const hydrateGlobalFlagsAfter = await page.evaluate(() => {
      return globalThis.canStacheElementInertPrerendered && globalThis.canMooStache
    })

    // flags should be undefined and not false since they are removed from globalThis
    expect(hydrateGlobalFlagsAfter).toBeUndefined()
  })
})
