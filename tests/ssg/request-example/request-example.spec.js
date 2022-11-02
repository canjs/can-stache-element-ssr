// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../../helpers/verify-still-prerendered")

test.describe("RequestExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })

    await page.goto("/")
  })

  test.afterEach(async ({ page }) => {
    expect(await verifyStillPrerendered(page)).toBe(true)
  })

  test("label should update", async ({ page }) => {
    await page.getByText("before request")
    const label = await page.getByText("iPhone 9")

    await expect(label).toHaveText("iPhone 9")
  })
})
