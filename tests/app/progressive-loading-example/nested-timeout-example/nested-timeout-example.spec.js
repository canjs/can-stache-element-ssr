// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("NestedTimeoutExample", () => {
  test("label should update", async ({ page }) => {
    await page.goto("/progressive-loading/nested-timeout")

    await page.getByText("before nested timeout")
    const label = await page.getByText("after nested timeout")

    await expect(label).toHaveText("after nested timeout")
  })
})
