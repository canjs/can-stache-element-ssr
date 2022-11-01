// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("Request logic", () => {
  test("label should update", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/")

    await page.getByText("before request")
    const label = await page.getByText("brad is pretty dope")

    await expect(label).toHaveText("brad is pretty dope")
  })
})
