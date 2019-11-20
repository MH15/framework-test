"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Startup {
    static main() {
        console.log('Hello World');
        return 0;
    }
}
Startup.main();
const component_1 = require("./component");
const path_1 = require("path");
const fs_1 = require("fs");
const Mustache = require("mustache");
const directory1 = path_1.join(__dirname, '..', 'dist');
const directory2 = path_1.join(__dirname, '..', 'components');
let component = new component_1.Component(path_1.join(__dirname, '..', 'components', 'demo.component'));
// console.log(component)
let set = component.build(directory1, directory2);
console.log(set);
let rendered = Mustache.render(fs_1.readFileSync(path_1.join(directory1, "mustache", "demo.mustache"), "utf8"), {}, {
    included: fs_1.readFileSync(path_1.join(directory1, "mustache", "included.mustache"), "utf8")
});
console.log(rendered);
// console.log(component)
