"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomParser = require('dom-parser');
const parser = new DomParser();
const { DomHandler } = require("domhandler");
function parseHTML(content) {
    let dom = parser.parseFromString(content);
    return dom;
}
exports.parseHTML = parseHTML;
const htmlparser2 = require("htmlparser2");
const { DOMParser, XMLSerializer, DOMImplementation } = require('xmldom');
function printer(c) {
    console.log(new XMLSerializer().serializeToString(c));
}
function parsing(content) {
    // const root = parse(content);
    // console.log(root);
    let doc = new DOMParser().parseFromString(content);
    // console.log(doc)
    let template = doc.documentElement;
    // console.log(template)
    // printer(doc)
    // printer(doc.documentElement)
    console.log("CHILDD");
    console.log(doc.documentElement.childNodes);
}
exports.parsing = parsing;
//# sourceMappingURL=parser.js.map