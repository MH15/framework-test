class Startup {
    public static main(): number {
        console.log('Hello World');
        return 0;
    }
}

Startup.main();


interface Template {

}

import { Component } from './component';
import { join } from "path";
import { readFileSync } from 'fs';

const Mustache = require("mustache")



const DIR_DIST = join(__dirname, '..', 'dist')
const DIR_SEARCH = join(__dirname, '..', 'components')


let component = new Component(join(__dirname, '..', 'components', 'demo.component'))
// console.log(component)

let buildSet = component.build(DIR_DIST, DIR_SEARCH)
console.log(buildSet)



let includes = {}
let joinedStyles = ""
let joinedScripts = ""
for (let entry of buildSet) {
    includes[entry] = readFileSync(join(DIR_DIST, "mustache", entry + ".mustache"), "utf8")
    joinedStyles += readFileSync(join(DIR_DIST, "style", entry + ".css"), "utf8")
    joinedScripts += readFileSync(join(DIR_DIST, "script", entry + ".js"), "utf8")
}


// TODO: a helper function to use buildSet to pass all needed templates into the mustache
let rendered = Mustache.render(readFileSync(join(DIR_DIST, "mustache", "demo.mustache"), "utf8"), {}, includes)



console.log(rendered)

