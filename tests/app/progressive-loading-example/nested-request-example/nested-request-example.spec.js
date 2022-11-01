// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("NestedRequestExample", () => {
  test("label should update", async ({ page }) => {
    await page.goto("/progressive-loading/nested-request")

    await page.getByText("before request")
    const label = await page.getByText("jane is pretty dope")

    await expect(label).toHaveText("jane is pretty dope")
  })
})
