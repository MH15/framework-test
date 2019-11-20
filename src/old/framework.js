/**
 * Log the version.
 */
const version = require("./version.json").version
console.log("Framework version " + version)

/**
 * Require scripts.
 */
const newComponentViewController = require('./new')
const developComponentView = require('./develop')


/**
 * Accept console arguments
 */
const yargs = require('yargs');

const argv = yargs
    .command('new <type> <name>', 'Create a new component, view or controller.', {
        copy: {
            description: 'the year to check for',
            alias: 'y',
            type: 'number',
        }
    }, (argv) => {
        newComponentViewController(argv)
    })
    .command('develop <path>', 'Develop a component or view using the live server.', {
        port: {
            description: 'the port to serve to',
            alias: 'p',
            type: 'number',
        }
    }, (argv) => {
        developComponentView(argv)
    })
    .option('tnewime', {
        alias: 't',
        description: 'Tell the present Time',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h')
    .argv;



console.log(argv);

// const sfc = require("./sfc")
const utils = require("./utils")
const path = require("path")
// const parser = require("./html-parser")
let h = utils.readFile(path.join(__dirname, "..", "components", "Card.component"))
// let warn = (msg) => {
//     console.log("msg: " + msg)
// }
// let a = parser.parseHTML(h, {
//     expectHTML: true,
//     warn: warn
// })
// console.log(h)
// console.log(a)

const compiler = require('vue-template-compiler');
const sfcDescriptor = compiler.parseComponent(h);
console.log(JSON.stringify(sfcDescriptor.ast, 2))

const toString = require('vue-sfc-descriptor-to-string');
const result = toString(sfcDescriptor);
console.log(result)