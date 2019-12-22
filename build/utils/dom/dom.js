"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Text"] = 0] = "Text";
    NodeType[NodeType["Element"] = 1] = "Element";
    NodeType[NodeType["Comment"] = 2] = "Comment";
})(NodeType || (NodeType = {}));
exports.NodeType = NodeType;
function elem(tagName, attributes, children) {
    return {
        children,
        nodeType: NodeType.Element,
        data: {
            tagName,
            attributes
        }
    };
}
exports.elem = elem;
function text(innerHTML) {
    return {
        nodeType: NodeType.Text,
        children: [],
        data: {
            innerHTML
        }
    };
}
exports.text = text;
function comment(innerHTML) {
    return {
        nodeType: NodeType.Comment,
        children: [],
        data: {
            innerHTML
        }
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
    if (node.nodeType === NodeType.Text) {
        result += padding(level) + node.data.innerHTML + "\n";
    }
    else if (node.nodeType === NodeType.Element) {
        result += padding(level) + "<";
        result += node.data.tagName;
        if (node.data.attributes != null && node.data.attributes.size) {
            result += " " + printAttributes(node.data.attributes);
        }
        result += ">" + "\n";
        // recursion
        node.children.forEach(child => {
            result += prettyPrinter(child, level + 1);
        });
        result += padding(level) + "</" + node.data.tagName + ">" + "\n";
    }
    else if (node.nodeType = NodeType.Comment) {
        result += padding(level) + "<!--" + node.data.innerHTML + "-->" + "\n";
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