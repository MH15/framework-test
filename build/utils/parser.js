"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_html_parser_1 = require("node-html-parser");
const DomParser = require('dom-parser');
const parser = new DomParser();
function parseHTML(content) {
    let a = node_html_parser_1.parse(content);
    return a;
}
exports.parseHTML = parseHTML;
