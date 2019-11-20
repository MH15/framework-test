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



const directory1 = join(__dirname, '..', 'dist')
const directory2 = join(__dirname, '..', 'components')


let component = new Component(join(__dirname, '..', 'components', 'demo.component'))
// console.log(component)

let set = component.build(directory1, directory2)
console.log(set)


// TODO: a helper function to use buildSet to pass all needed templates into the mustache
let rendered = Mustache.render(readFileSync(join(directory1, "mustache", "demo.mustache"), "utf8"), {}, {
    included: readFileSync(join(directory1, "mustache", "included.mustache"), "utf8")
})
console.log(rendered)
// console.log(component)