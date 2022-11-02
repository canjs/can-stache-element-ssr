// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../../helpers/verify-still-prerendered")

test.describe("CounterExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })

    await page.goto("/")
  })

  test.afterEach(async ({ page }) => {
    expect(await verifyStillPrerendered(page)).toBe(true)
  })

  test("clicking increment button", async ({ page }) => {
    const label = await page.getByTestId("counter")

    await expect(label).toHaveText("0")

    const button = await page.getByTestId("counter-button")

    await button.click()

    await expect(label).toHaveText("0")
  })
})
