"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const finders_1 = require("./finders");
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Text"] = 0] = "Text";
    NodeType[NodeType["Element"] = 1] = "Element";
    NodeType[NodeType["Comment"] = 2] = "Comment";
})(NodeType || (NodeType = {}));
exports.NodeType = NodeType;
var TagStyle;
(function (TagStyle) {
    TagStyle[TagStyle["Default"] = 0] = "Default";
    TagStyle[TagStyle["SelfClosing"] = 1] = "SelfClosing";
    TagStyle[TagStyle["Void"] = 2] = "Void";
})(TagStyle || (TagStyle = {}));
class Primitive {
    constructor(kind) {
        this.kind = kind;
        this.parent = null;
        this.children = [];
        this.data = "";
    }
    get isElement() {
        return this.kind === NodeType.Element;
    }
    get isComment() {
        return this.kind === NodeType.Comment;
    }
    get isText() {
        return this.kind === NodeType.Text;
    }
}
class Node extends Primitive {
    constructor(kind) {
        super(kind);
        this.attributes = new Map();
        this.tagStyle = null;
    }
    get tagName() {
        if (this.kind == NodeType.Element) {
            return this.data;
        }
        else {
            return "";
        }
    }
    appendChild(child) {
        if (this.kind === NodeType.Element) {
            this.children.push(child);
        }
    }
    get innerHTML() {
        // TODO: implementation based on the data property
        let children = "";
        for (let child of this.children) {
            children += child.print();
        }
        return children;
    }
    getAttribute(key) {
        if (this.kind == NodeType.Element) {
            if (this.hasAttribute(key)) {
                return this.attributes.get(key);
            }
        }
        return null;
    }
    hasAttribute(key) {
        if (this.kind == NodeType.Element) {
            if (this.attributes.has(key)) {
                return true;
            }
        }
        return false;
    }
    print() {
        return prettyPrinter(this, 0);
    }
    // getters
    getElementsByTagName(name) {
        return finders_1.getElementsByTagName(this, name);
    }
}
exports.Node = Node;
/**
 * Constructors
 */
function elem(tagName, attributes, children) {
    let el = new Node(NodeType.Element);
    el.data = tagName;
    el.attributes = attributes;
    el.tagStyle = TagStyle.Default;
    el.parent = null;
    el.children = children;
    return el;
}
exports.elem = elem;
function selfClosing(tagName, attributes) {
    let el = new Node(NodeType.Element);
    el.data = tagName;
    el.attributes = attributes;
    el.tagStyle = TagStyle.SelfClosing;
    el.parent = null;
    el.children = [];
    return el;
}
exports.selfClosing = selfClosing;
function text(data) {
    let el = new Node(NodeType.Text);
    el.data = data;
    el.children = [];
    el.parent = null;
    return el;
}
exports.text = text;
function comment(data) {
    let el = new Node(NodeType.Comment);
    el.data = data;
    el.children = [];
    el.parent = null;
    return el;
}
exports.comment = comment;
/**
 * DOM Helpers
 */
function prettyPrinter(node, level) {
    if (level == undefined) {
        level = 0;
    }
    let result = "";
    switch (node.kind) {
        case NodeType.Text:
            result += padding(level) + node.data + "\n";
            break;
        case NodeType.Element:
            result += padding(level) + "<";
            result += node.data;
            if (node.attributes != null && node.attributes.size) {
                result += " " + printAttributes(node.attributes);
            }
            if (node.tagStyle == TagStyle.Default) {
                result += ">" + "\n";
                // recursion
                node.children.forEach(child => {
                    result += prettyPrinter(child, level + 1);
                });
                result += padding(level) + "</" + node.data + ">" + "\n";
            }
            else if (node.tagStyle == TagStyle.SelfClosing) {
                result += "/>" + "\n";
            }
            break;
        case NodeType.Comment:
            result += padding(level) + "<!--" + node.data + "-->" + "\n";
            break;
    }
    return result;
}
exports.prettyPrinter = prettyPrinter;
function padding(level) {
    let padding = "";
    for (let i = 1; i < level; i++) {
        padding += "  ";
    }
    return padding;
}
function printAttributes(attributes) {
    let result = [];
    attributes.forEach((key, value) => {
        result.push(`${value}="${key}"`);
    });
    return result.join(" ");
}
//# sourceMappingURL=node.js.map