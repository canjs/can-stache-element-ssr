// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../../helpers/verify-still-prerendered")

test.describe("ProgressiveLoadingExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })
  })

  test.afterEach(async ({ page }) => {
    expect(await verifyStillPrerendered(page)).toBe(true)
  })

  test("navigation nested root route example", async ({ page }) => {
    await page.goto("/")

    await page.evaluate(() => {
      // if this doesn't work, you can try to increase 0 to a higher number (i.e. 100)
      return new Promise((resolve) => setTimeout(resolve, 0))
    })

    await page.getByTestId("progressive-loading").click()

    const header = page.locator("h3")

    // Because the page isn't hydrated, navigation shouldn't work
    await expect(header).toHaveText("Home Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is home.")
  })

  test("refresh to nested root route example", async ({ page }) => {
    await page.goto("/progressive-loading")

    const header = page.locator("h3")

    // Refresh only works because refreshing to the nested root page would have a prerendered nested root page
    await expect(header).toHaveText("Progressive Loading Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is progressive-loading.")

    const nestedHeader = page.locator("h4")

    await expect(nestedHeader).toHaveText("Nested Root Route")

    const nestedTracker = page.getByTestId("nested-page-tracker")

    await expect(nestedTracker).toHaveText("The current nestedPage is root.")
  })
})
