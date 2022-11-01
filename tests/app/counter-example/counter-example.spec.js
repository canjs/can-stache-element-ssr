// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("CounterExample", () => {
  test("clicking increment button", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/")

    const label = await page.locator("data-test-id=counter")

    await expect(label).toHaveText("0")

    const button = await page.locator("data-test-id=counter-button")

    await button.click()

    await expect(label).toHaveText("1")

    await button.click()

    await expect(label).toHaveText("2")
  })
})
