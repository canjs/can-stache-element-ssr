// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("CssExample", () => {
  test("css affects page", async ({ page }) => {
    await page.goto("/css")
    await page.waitForResponse("/tests/app/css-example/css-example.css")

    const header = page.getByTestId("css-test")

    const initialColor = await header.evaluate((el) => {
      return getComputedStyle(el).backgroundColor
    })

    expect(initialColor).toBe("rgb(255, 165, 0)") // "orange"
  })
})
