// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("RouteExample", () => {
  test("home route loads", async ({ page }) => {
    await page.goto("/")

    const header = page.locator("h3")

    await expect(header).toHaveText("Home Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is home.")
  })

  test("navigation to css example", async ({ page }) => {
    await page.goto("/")

    await page.getByTestId("css").click()

    const header = page.locator("h3")

    await expect(header).toHaveText("CSS Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is css.")
  })

  test("refresh to css example", async ({ page }) => {
    await page.goto("/css")

    const header = page.locator("h3")

    await expect(header).toHaveText("CSS Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is css.")
  })

  test("navigation to 404 example", async ({ page }) => {
    await page.goto("/")

    await page.getByTestId("not-found").click()

    const header = page.locator("h3")

    await expect(header).toHaveText("Not Found Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is unknown.")
  })

  test("refresh to 404 example", async ({ page }) => {
    await page.goto("/asdfasdfasdf")

    const header = page.locator("h3")

    await expect(header).toHaveText("Not Found Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is asdfasdfasdf.")
  })
})
