// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("CssExample", () => {
  test("css affects page", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/css")
    await page.waitForResponse("http://0.0.0.0:8080/tests/app/css-example/css-example.css")

    const header = page.locator("data-test-id=css-test")

    const initialColor = await header.evaluate((el) => {
      return getComputedStyle(el).backgroundColor
    })

    expect(initialColor).toBe("rgb(255, 165, 0)") // "orange"
  })
})
