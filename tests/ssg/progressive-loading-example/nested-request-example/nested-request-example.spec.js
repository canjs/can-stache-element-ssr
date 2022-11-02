// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../../../helpers/verify-still-prerendered")

test.describe("NestedRequestExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })

    await page.goto("/progressive-loading/nested-request")
  })

  test.afterEach(async ({ page }) => {
    expect(await verifyStillPrerendered(page)).toBe(true)
  })

  test("label should update", async ({ page }) => {
    await page.getByText("before request")
    const label = await page.getByText("iPhone X")

    await expect(label).toHaveText("iPhone X")
  })
})
