// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("ProgressiveLoadingExample", () => {
  test("navigation nested root route example", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/")

    await page.locator("#progressive-loading").click()

    const header = page.locator("h3")

    await expect(header).toHaveText("Progressive Loading Route")

    const tracker = page.locator("#page-tracker")

    await expect(tracker).toHaveText("The current page is progressive-loading.")

    const nestedHeader = page.locator("h4")

    await expect(nestedHeader).toHaveText("Nested Root Route")

    const nestedTracker = page.locator("#nested-page-tracker")

    await expect(nestedTracker).toHaveText("The current nestedPage is root.")
  })

  test("refresh to nested root route example", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/progressive-loading")

    const header = page.locator("h3")

    await expect(header).toHaveText("Progressive Loading Route")

    const tracker = page.locator("#page-tracker")

    await expect(tracker).toHaveText("The current page is progressive-loading.")

    const nestedHeader = page.locator("h4")

    await expect(nestedHeader).toHaveText("Nested Root Route")

    const nestedTracker = page.locator("#nested-page-tracker")

    await expect(nestedTracker).toHaveText("The current nestedPage is root.")
  })
})
