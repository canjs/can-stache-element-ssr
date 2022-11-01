// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("Home page", () => {
  test("homepage has header `Hello Playwright`", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/")

    const header = page.locator("h1")

    await expect(header).toHaveText("Hello Playwright")
  })
})
