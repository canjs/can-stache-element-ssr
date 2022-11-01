// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("importing assets", () => {
  test("load image from assets", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/asdfasdfasdf")
    await page.waitForResponse("http://0.0.0.0:8080/tests/app/assets/not-found-image.png")
  })
})
