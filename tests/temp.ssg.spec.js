// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("temp", () => {
  test("should fail", async ({ page }) => {
    expect(false).toBe(true)
  })
})
