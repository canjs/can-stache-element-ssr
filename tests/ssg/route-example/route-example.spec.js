// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../../helpers/verify-still-prerendered")

test.describe("RouteExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })
  })

  test.afterEach(async ({ page }) => {
    expect(await verifyStillPrerendered(page)).toBe(true)
  })

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

    // Because the page isn't hydrated, navigation shouldn't work
    await expect(header).toHaveText("Home Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is home.")
  })

  test("refresh to css example", async ({ page }) => {
    await page.goto("/css")

    const header = page.locator("h3")

    // Refresh only works because refreshing to the css page would have a prerendered css page
    await expect(header).toHaveText("CSS Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is css.")
  })

  test("navigation to 404 example", async ({ page }) => {
    await page.goto("/")

    await page.getByTestId("not-found").click()

    const header = page.locator("h3")

    // Because the page isn't hydrated, navigation shouldn't work
    await expect(header).toHaveText("Home Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is home.")
  })

  test("refresh to 404 example", async ({ page }) => {
    await page.goto("/not-a-route")

    const header = page.locator("h3")

    // Refresh only works because refreshing to the 404 page would have a prerendered 404 page
    await expect(header).toHaveText("Not Found Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is not-a-route.")
  })
})
