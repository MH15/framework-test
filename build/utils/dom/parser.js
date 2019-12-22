"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DOM = require("./dom");
const traversal_1 = require("./traversal");
function parsing(content) {
    let nodes = new html_parser_1.HTMLParser(content).parseNodes();
    let root;
    // If the document contains a root element, just return it. Otherwise, create one.
    if (nodes.length == 1) {
        root = nodes[0];
    }
    else {
        root = DOM.elem("html", new Map(), nodes);
    }
    console.log(DOM.prettyPrinter(root));
    traversal_1.mutation(root, (n) => {
        return n.nodeType === DOM.NodeType.Element;
    }, (n) => {
        n.data.tagName = "trick";
    });
    /**
     * Algorithm:
     * - perform a mutation on the root node:
     *    - check if node is one of the included nodes
     *    - if so, link other shit in
     */
    console.log(DOM.prettyPrinter(root));
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
//# sourceMappingURL=parser.js.map