"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DOM = require("./dom");
const traversal_1 = require("./traversal");
function parsing(content) {
    var hrstart = process.hrtime();
    let nodes;
    for (let i = 0; i < 1; i++) {
        let parser = new html_parser_1.HTMLParser(content);
        try {
            nodes = parser.parseNodes(null);
        }
        catch (error) {
            console.log(parser.error());
            console.log(error.stack);
            process.exit();
        }
    }
    let hrend = process.hrtime(hrstart);
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
    let root;
    // If the document contains a root element, just return it. Otherwise, create one.
    if (nodes.length == 1) {
        root = nodes[0];
    }
    else {
        root = DOM.elem("html", new Map(), nodes);
    }
    // console.log(root)
    // console.log(root.children[0])
    // TODO: parent link
    // console.log(root === root.children[0].parent)
    // console.log(DOM.prettyPrinter(root))
    // sample usage of a mutation
    // mutation(root, (n) => {
    //     return n.kind === DOM.NodeType.Element
    // }, (n) => {
    //     if (n.kind == DOM.NodeType.Element) {
    //         n.tagName = "trick"
    //     }
    // })
    /**
     * Algorithm:
     * - perform a mutation on the root node:
     *    - check if node is one of the included nodes
     *    - if so, link other shit in
     */
    console.log(DOM.prettyPrinter(root));
    // sample usage of getElement
    // let el = getElement(root, (el) => {
    //     if (el.kind === DOM.NodeType.Element) {
    //         if (el.tagName == "FancyHeader") {
    //             return true
    //         }
    //     }
    //     return false
    // })
    let elByID = traversal_1.getElementById(root, "a");
    console.log(elByID);
}
exports.parsing = parsing;
const DomParser = require('dom-parser');
const parser = new DomParser();
const html_parser_1 = require("./html-parser");
/**
 * TODO: Legacy
 */
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
//# sourceMappingURL=current-parser.js.map