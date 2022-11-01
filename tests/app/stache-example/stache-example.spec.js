// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("StacheExampleApp", () => {
  test("homepage uses stache files", async ({ page }) => {
    await page.goto("/")

    const header = page.getByTestId("stache-test")

    await expect(header).toHaveText("Using app.stache works!")
  })
})
