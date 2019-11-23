/**
 * This is the starting point for your app.
 */
const Framework = require("./build/app")

const fra = new Framework(__dirname)

console.log(fra)


fra.serve(8000)