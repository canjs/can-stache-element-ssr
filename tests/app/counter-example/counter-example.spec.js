// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("CounterExample", () => {
  test("clicking increment button", async ({ page }) => {
    await page.goto("/")

    const label = await page.getByTestId("counter")

    await expect(label).toHaveText("0")

    const button = await page.getByTestId("counter-button")

    await button.click()

    await expect(label).toHaveText("1")

    await button.click()

    await expect(label).toHaveText("2")
  })
})
