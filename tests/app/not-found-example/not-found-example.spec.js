// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("NotFoundExample", () => {
  test("load image from assets", async ({ page }) => {
    await page.goto("/asdfasdfasdf")
    await page.waitForResponse("/tests/app/assets/not-found-image.png")
  })
})
