"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const parser_1 = require("./utils/parser");
class Component {
    constructor(filepath) {
        this.file = fs_1.readFileSync(filepath, "utf8");
        let a = parser_1.parseHTML(this.file);
        this.template = a.querySelector("template");
        this.styles = a.querySelectorAll("style");
        this.script = a.querySelector("script");
    }
    build() {
        // search through each node in template
        // if a node has attribute, replace
        // this.template.firstChild().set_content("aaaa")
        console.log(this.template.firstChild.set_content("aa"));
        return "";
    }
}
exports.Component = Component;
