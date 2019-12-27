"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function elem(tagName, attributes, children) {
    return {
        kind: NodeType.Element,
        children,
        tagName,
        attributes,
        tagStyle: TagStyle.Default,
        parent: null
    };
}
exports.elem = elem;
function selfClosing(tagName, attributes, children) {
    return {
        kind: NodeType.Element,
        children,
        tagName,
        attributes,
        tagStyle: TagStyle.SelfClosing,
        parent: null
    };
}
exports.selfClosing = selfClosing;
function text(data) {
    return {
        kind: NodeType.Text,
        children: [],
        data,
        parent: null
    };
}
exports.text = text;
function comment(data) {
    return {
        kind: NodeType.Comment,
        children: [],
        data,
        parent: null
    };
}
exports.comment = comment;
/*
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
            result += node.tagName;
            if (node.attributes != null && node.attributes.size) {
                result += " " + printAttributes(node.attributes);
            }
            if (node.tagStyle == TagStyle.Default) {
                result += ">" + "\n";
                // recursion
                node.children.forEach(child => {
                    result += prettyPrinter(child, level + 1);
                });
                result += padding(level) + "</" + node.tagName + ">" + "\n";
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
//# sourceMappingURL=dom.js.map