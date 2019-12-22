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
    let p = new HTMLParser(content);
    // console.log("parser:", p)
    // while (p.hasNext()) {
    //     let next = p.consume()
    //     if (next === "<") {
    //         console.log("parseOpeningTag()")
    //     }
    // }
    let nodes = p.parseNodes();
    console.log("nodes:", JSON.stringify(nodes));
    // for (let node of nodes) {
    //     console.log("<--- NODE --->")
    //     console.log(node)
    //     console.log(" ")
    // }
}
exports.parsing = parsing;
class HTMLParser {
    constructor(content) {
        this.content = content;
        this.index = 0;
    }
    peek() {
        return this.content.charAt(this.index);
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
        return this.index < this.content.length;
    }
    /**
     * Consume characters until test returns false
     */
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
        if (this.index + s.length > this.content.length) {
            result = false;
        }
        else {
            let compare = this.content.slice(this.index, this.index + s.length);
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
            return ' \t\n\r\v'.indexOf(char);
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
            console.log("parsed element:", el);
            return el;
        }
        else {
            let text = this.parseText();
            console.log("parsed text:", text);
            return text;
        }
    }
    // Parse a text node.
    parseText() {
        let innerHTML = this.consumeWhile((char) => {
            return char != "<";
        });
        return {
            children: [],
            nodeType: DOM.NodeType.Text,
            data: innerHTML
        };
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
        assert_1.equal(this.parseTagName, tagName);
        assert_1.equal(this.consume(), ">");
        return {
            children,
            nodeType: DOM.NodeType.Element,
            data: {
                tagName,
                attributes
            }
        };
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