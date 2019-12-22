"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomParser = require('dom-parser');
const parser = new DomParser();
// const { DomHandler } = require("domhandler");
// import { parse } from 'node-html-parser';
function parseHTML(content) {
    let dom = parser.parseFromString(content);
    return dom;
}
exports.parseHTML = parseHTML;
const assert_1 = require("assert");
const assert = require("assert");
// import { DOMNode, NodeType } from "./dom"
const DOM = require("./dom");
const htmlparser2 = require("htmlparser2");
const { DOMParser, XMLSerializer, DOMImplementation } = require('xmldom');
function printer(c) {
    console.log(new XMLSerializer().serializeToString(c));
}
function parsing(content) {
    let root = parser.parseFromString(content);
    // console.log("root", root)
    // const root = parse(content);
    let nodes = new HTMLParser(content).parseNodes();
    // If the document contains a root element, just return it. Otherwise, create one.
    if (nodes.length == 1) {
        root = nodes[0];
    }
    else {
        root = DOM.elem("html", new Map(), nodes);
    }
    // console.log(nodes);
    console.log(DOM.prettyPrinter(root));
}
exports.parsing = parsing;
class HTMLParser {
    constructor(content) {
        this.input = content;
        this.index = 0;
    }
    toString() {
        return this.input.slice(this.index);
    }
    // Parse a sequence of sibling nodes.
    parseNodes() {
        let nodes = [];
        while (true) {
            this.consumeWhitespace();
            if (!this.hasNext() || this.startsWith("</")) {
                break;
            }
            nodes.push(this.parseNode());
        }
        return nodes;
    }
    peek() {
        return this.input.charAt(this.index);
    }
    consume() {
        if (this.hasNext()) {
            let res = this.peek();
            this.index++;
            return res;
        }
        else {
            console.error("too far");
        }
    }
    hasNext() {
        return this.index < this.input.length;
    }
    // Consume characters until test returns false
    consumeWhile(test) {
        let result = "";
        while (this.hasNext() && test(this.peek())) {
            result += this.consume();
        }
        return result;
    }
    // Does the current input start with the given string?
    startsWith(s) {
        let result = true;
        if (this.index + s.length > this.input.length) {
            result = false;
        }
        else {
            let compare = this.input.slice(this.index, this.index + s.length);
            if (compare != s) {
                result = false;
            }
        }
        return result;
    }
    /**
     * Consume whitespace
     */
    consumeWhitespace() {
        this.consumeWhile((char) => {
            return ' \t\n\r\v'.indexOf(char) >= 0;
        });
    }
    /**
     * Parse a tag or attribute name
     */
    parseTagName() {
        return this.consumeWhile(isAlphaNumeric);
    }
    // Parse a single node.
    parseNode() {
        if (this.peek() === "<") {
            let el = this.parseElement();
            return el;
        }
        else {
            let text = this.parseText();
            return text;
        }
    }
    // Parse a text node.
    parseText() {
        let innerHTML = this.consumeWhile((char) => {
            return char != "<";
        });
        return DOM.text(innerHTML);
    }
    parseElement() {
        // Opening tag
        assert_1.equal(this.consume(), "<");
        let tagName = this.parseTagName();
        let attributes = this.parseAttributes();
        assert_1.equal(this.consume(), ">");
        // Contents
        let children = this.parseNodes();
        // Closing tag
        assert_1.equal(this.consume(), "<");
        assert_1.equal(this.consume(), "/");
        assert_1.equal(this.parseTagName(), tagName);
        assert_1.equal(this.consume(), ">");
        return DOM.elem(tagName, attributes, children);
    }
    // Parse a single name="value" pair.
    parseAttribute() {
        let key = this.parseTagName();
        assert_1.equal(this.consume(), "=");
        let value = this.parseAttributeValue();
        return { key, value };
    }
    // Parse a quoted value.
    parseAttributeValue() {
        let open_quote = this.consume();
        assert(open_quote == '"' || open_quote == '\'');
        let value = this.consumeWhile((char) => {
            return char != open_quote;
        });
        assert.equal(this.consume(), open_quote);
        return value;
    }
    // Parse a list of name="value" pairs, separated by whitespace.
    parseAttributes() {
        let attributes = new Map();
        while (true) {
            this.consumeWhitespace();
            if (this.peek() == ">") {
                break;
            }
            let pair = this.parseAttribute();
            attributes.set(pair.key, pair.value);
        }
        return attributes;
    }
}
function isAlphaNumeric(str) {
    var code, i, len;
    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
}
;
//# sourceMappingURL=parser.js.map