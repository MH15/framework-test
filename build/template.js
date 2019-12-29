"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Template uses the DOM module to search and replace items in the DOM.
 *
 */
const DOM = require("./dom/node");
const traversal_1 = require("./dom/traversal");
const component_1 = require("./component");
const path_1 = require("path");
const parser_1 = require("./utils/parser");
const assert = require("assert");
/**
pseudocode:

function combine(node) {
    gather included files
        find all included components
    mutate the node and its children
        whenever an included template appears in the root DOM,
            parse said template
                (this includes recursion)
            copy it into place in the root DOM

    1. do the DOM combine using mutation methdods
    2. do the style and script combine using string methods

}

*/
class Template {
}
function templateRender(c, buildSet, dirSearch) {
    let dom = c.template;
    traversal_1.mutation(dom, (n) => {
        if (n.kind === DOM.NodeType.Element) {
            let tag = n.tagName.toLowerCase();
            console.log("tag:", tag);
            if (buildSet.has(tag)) {
                return true;
            }
        }
        return false;
    }, (n) => {
        modify(n, c, dirSearch);
    });
}
exports.templateRender = templateRender;
function modify(n, c, dirSearch) {
    console.log("modding", n.tagName);
    let component = new component_1.Component(path_1.join(dirSearch, `${n.tagName}.component`));
    console.log(component);
    let referencedComponent = null; // find the component to add
    // referencedComponent.assemble() // perform assembly on referenced component
    // insert referenced component in tree
}
exports.modify = modify;
// export function condition()
class TemplateParser extends parser_1.Parser {
    constructor(content, separators) {
        super(content);
        this.sepLeft = "{{";
        this.sepRight = "}}";
        this.openBraces = 0;
        this.newString = "";
        if (separators) {
            this.sepLeft = separators[0];
            this.sepRight = separators[1];
        }
    }
    advance() {
        while (this.hasNext()) {
            this.newString += this.consumeWhitespace();
            if (this.startsWith("{{")) {
                this.parseReplacement();
            }
            else {
                this.newString += this.consume();
            }
        }
        return this.newString;
    }
    parseReplacement() {
        console.log("parse replacement", 0);
        assert.equal(this.consume(), "{");
        assert.equal(this.consume(), "{");
        this.newString += this.consumeWhitespace();
        console.log("parse replacement", 1);
        // get data, filter maybe?
        let key = this.parseKey();
        this.newString += key;
        console.log("parse replacement", 2);
        this.newString += this.consumeWhitespace();
        assert.equal(this.consume(), "}");
        assert.equal(this.consume(), "}");
    }
    parseKey() {
        /* Additional (optional) characters can be: a
        letter, a digit, underscore, colon, period,
        dash, or a “CombiningChar” or “Extender” character,
        which I believe allows Unicode attributes names. */
        let regex = new RegExp(/[a-zA-Z0-9\-:_@]/);
        return this.consumeWhile((char) => {
            return char.match(regex);
        });
    }
}
exports.TemplateParser = TemplateParser;
//# sourceMappingURL=template.js.map