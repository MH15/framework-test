"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DOM = require("./node");
const finders_1 = require("./finders");
const html_parser_1 = require("./html-parser");
function parseHTML(content) {
    let parser = new html_parser_1.HTMLParser(content);
    let nodes = parser.parseNodes(null);
    let root;
    // If the document contains a root element, just return it. Otherwise, create one.
    if (nodes.length == 1) {
        root = nodes[0];
    }
    else {
        root = DOM.elem("html", new Map(), nodes);
    }
    return root;
}
exports.parseHTML = parseHTML;
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
    let root;
    // If the document contains a root element, just return it. Otherwise, create one.
    if (nodes.length == 1) {
        root = nodes[0];
    }
    else {
        root = DOM.elem("html", new Map(), nodes);
    }
    // TODO: parent link
    /**
     * Algorithm:
     * - perform a mutation on the root node:
     *    - check if node is one of the included nodes
     *    - if so, link other shit in
     */
    console.log(root.print());
    // console.time("findElements")
    let elsByID;
    for (let i = 0; i < 1; i++) {
        elsByID = finders_1.getElementsByTagName(root, "plus-icon");
    }
    // console.timeEnd("findElements")
    // console.log("all:", elsByID)
    return root;
}
exports.parsing = parsing;
//# sourceMappingURL=current-parser.js.map