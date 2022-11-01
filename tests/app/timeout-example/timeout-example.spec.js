// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("Timeout logic", () => {
  test("label should update", async ({ page }) => {
    await page.goto("http://0.0.0.0:8080/")

    const label = await page.locator("#timeout-example")
    const labelHandle = await label.elementHandle()

    await expect(label).toHaveText("before timeout")

    await page.getByText("after timeout")

    // @ts-ignore
    const id = await labelHandle.getAttribute("id")

    expect(id).toBe("timeout-example")
    await expect(label).toHaveText("after timeout")
  })
})
