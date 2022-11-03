module.exports = async function (page) {
  await page.evaluate(() => {
    return hydrationHasBeenSkipped()

    function hydrationHasBeenSkipped() {
      if (globalThis.skippedHydrationCanStacheElement) {
        console.log("globalThis.skippedHydrationCanStacheElement = true")
        return Promise.resolve()
      }

      console.log("globalThis.skippedHydrationCanStacheElement = false")

      return new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
        return hydrationHasBeenSkipped()
      })
    }
  })
}
