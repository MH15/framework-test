"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DOM = require("./dom");
const assert = require("assert");
const parser_1 = require("../parser");
var MODES;
(function (MODES) {
    MODES[MODES["DOM"] = 0] = "DOM";
    MODES[MODES["Style"] = 1] = "Style";
    MODES[MODES["Script"] = 2] = "Script";
})(MODES || (MODES = {}));
class HTMLParser extends parser_1.Parser {
    // current operating mode
    // mode
    // Parse a sequence of sibling nodes.
    parseNodes(parent) {
        let nodes = [];
        while (true) {
            this.consumeWhitespace();
            if (!this.hasNext() || this.startsWith("</")) {
                break;
            }
            nodes.push(this.parseNode(parent));
        }
        return nodes;
    }
    // Parse a single node.
    parseNode(parent) {
        let el;
        if (this.startsWith("<!--")) {
            el = this.parseComment();
        }
        else if (this.peek() === "<") {
            el = this.parseElement();
        }
        else {
            el = this.parseText();
        }
        el.parent = parent;
        return el;
    }
    // Parse a tag or attribute name.
    parseTagName() {
        // return this.consumeWhile(isAlphaNumeric)
        let regex = new RegExp(/[a-zA-Z0-9\-]/);
        return this.consumeWhile((char) => {
            return char.match(regex);
        });
    }
    // Parse a tag or attribute name.
    parseAttributeName() {
        /* Additional (optional) characters can be: a
        letter, a digit, underscore, colon, period,
        dash, or a “CombiningChar” or “Extender” character,
        which I believe allows Unicode attributes names. */
        let regex = new RegExp(/[a-zA-Z0-9\-:_@]/);
        return this.consumeWhile((char) => {
            return char.match(regex);
        });
    }
    // Parse a comment node.
    parseComment() {
        // Opening tag
        assert.equal(this.consume(), "<");
        assert.equal(this.consume(), "!");
        assert.equal(this.consume(), "-");
        assert.equal(this.consume(), "-");
        // parse until end tag reached
        let commentText = "";
        while (!this.startsWith("-->")) {
            commentText += this.consume();
        }
        // Closing tag
        assert.equal(this.consume(), "-");
        assert.equal(this.consume(), "-");
        assert.equal(this.consume(), ">");
        return DOM.comment(commentText);
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
        assert.equal(this.consume(), "<");
        let tagName = this.parseTagName();
        let attributes = this.parseAttributes();
        // end of opening tag can be either /> or >
        if (this.startsWith(">")) {
            // normal shit
            assert.equal(this.consume(), ">");
            // Contents
            let el = DOM.elem(tagName, attributes, []);
            let children = this.parseNodes(el);
            if (el.kind == DOM.NodeType.Element) {
                el.children = children;
            }
            // Closing tag
            assert.equal(this.consume(), "<");
            assert.equal(this.consume(), "/");
            assert.equal(this.parseTagName(), tagName);
            assert.equal(this.consume(), ">");
            return el;
        }
        else if (this.startsWith("/>")) {
            // unbalanced tag shit
            assert.equal(this.consume(), "/");
            assert.equal(this.consume(), ">");
            return DOM.selfClosing(tagName, attributes, []);
        }
        else {
            console.error("forgot to properly close tags");
        }
    }
    // Parse a single name="value" pair.
    parseAttribute() {
        this.consumeWhitespace();
        let key = this.parseAttributeName();
        // Support attributes with no values
        if (this.peek() == "=") {
            assert.equal(this.consume(), "=");
            let value = this.parseAttributeValue();
            return { key, value };
        }
        else {
            return { key: key, value: "true" };
        }
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
            if (this.peek() == ">" || this.startsWith("/>")) {
                break;
            }
            let pair = this.parseAttribute();
            attributes.set(pair.key, pair.value);
        }
        return attributes;
    }
}
exports.HTMLParser = HTMLParser;
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
//# sourceMappingURL=html-parser.js.map