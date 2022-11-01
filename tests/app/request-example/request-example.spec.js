// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("RequestExample", () => {
  test("label should update", async ({ page }) => {
    await page.goto("/")

    await page.getByText("before request")
    const label = await page.getByText("brad is pretty dope")

    await expect(label).toHaveText("brad is pretty dope")
  })
})
