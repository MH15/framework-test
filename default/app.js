/**
 * Require the library module from neanderthal
*/
const { Framework } = require("neanderthal")
/**
 * Create the global framework instance and set
 * it to use the current working directory
 */
global.app = new Framework(__dirname, true)


/**
 * Build all components before serving
 */
app.buildAllComponents()


/**
 * Serve your app!
 */
app.serve(8000)