// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("importing css files", () => {
  test("css affects page", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/css")

    const header = page.locator("#css-test")

    const initialColor = await header.evaluate((el) => {
      return getComputedStyle(el).backgroundColor
    })

    expect(initialColor).toBe("rgb(255, 165, 0)") // "orange"
  })
})
