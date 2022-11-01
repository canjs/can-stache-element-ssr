// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("TimeoutExample", () => {
  test("label should update", async ({ page }) => {
    await page.goto("/")

    await page.getByText("before timeout")
    const label = await page.getByText("after timeout")

    await expect(label).toHaveText("after timeout")
  })
})
