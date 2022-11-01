// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("main", () => {
  test("homepage has `Playwright is awesome` in title", async ({ page }) => {
    await page.goto("/")

    await expect(page).toHaveTitle(/Playwright is awesome/)

    const app = page.locator("can-app")

    await expect(app).toBeTruthy()
  })

  test("homepage has header `Hello Playwright`", async ({ page }) => {
    await page.goto("/")

    const header = page.locator("h1")

    await expect(header).toHaveText("Hello Playwright")
  })
})
