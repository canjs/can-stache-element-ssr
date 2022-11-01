// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("Home page", () => {
  test("homepage has `Playwright is awesome` in title", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/")

    await expect(page).toHaveTitle(/Playwright is awesome/)

    const app = page.locator("can-app")

    await expect(app).toBeTruthy()
  })
})
