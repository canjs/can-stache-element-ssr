// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("StacheExampleApp", () => {
  test("homepage uses stache files", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/")

    const header = page.locator("data-test-id=stache-test")

    await expect(header).toHaveText("Using app.stache works!")
  })
})
