// const now = Date.now();//.toString()

let count = 0

loop()

function loop() {
  console.log(count++)

  setTimeout(() => {
    if (globalThis.canStacheElementInertPrerendered && globalThis.canMooStache) {
      console.log("moo", globalThis.canStacheElementInertPrerendered, globalThis.canMooStache)
      return
    }

    console.log("cow", globalThis.canStacheElementInertPrerendered, globalThis.canMooStache)

    loop()
  }, 100)
}
