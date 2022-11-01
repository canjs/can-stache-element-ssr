// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("Importing stache files", () => {
  test("homepage uses stache files", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/")

    const header = page.locator("#stache-test")

    await expect(header).toHaveText("Using app.stache works!")
  })
})
