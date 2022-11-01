// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("NestedRequestExample", () => {
  test("label should update", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/progressive-loading/nested-request")

    await page.getByText("before request")
    const label = await page.getByText("jane is pretty dope")

    await expect(label).toHaveText("jane is pretty dope")
  })
})
