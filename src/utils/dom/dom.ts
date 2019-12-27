
enum NodeType {
    Text,
    Element,
    Comment
}

enum TagStyle {
    Default,
    SelfClosing,
    Void
}

interface ElementData {
    tagName?: string
    attributes?: AttrMap
    innerHTML?: string
}
// interface Node {
//     kind: NodeType
//     children: Node[]
//     data: Type
// }

type AttrMap = Map<string, string>

interface DOMElement {
    kind: NodeType,
    parent: DOMElement,
    children: Node[]
}


interface Element extends DOMElement {
    kind: NodeType.Element,
    tagName: string,
    attributes: AttrMap
    tagStyle: TagStyle
}
interface Text extends DOMElement {
    kind: NodeType.Text,
    data: string
}
interface Comment extends DOMElement {
    kind: NodeType.Comment,
    data: string
}

type Node = Text | Element | Comment



function elem(tagName: string, attributes: AttrMap, children: Node[]): Node {
    return {
        kind: NodeType.Element,
        children,
        tagName,
        attributes,
        tagStyle: TagStyle.Default,
        parent: null
    }
}

function selfClosing(tagName: string, attributes: AttrMap, children: Node[]): Node {
    return {
        kind: NodeType.Element,
        children,
        tagName,
        attributes,
        tagStyle: TagStyle.SelfClosing,
        parent: null
    }
}

function text(data: string): Node {
    return {
        kind: NodeType.Text,
        children: [],
        data,
        parent: null
    }
}
function comment(data: string): Node {
    return {
        kind: NodeType.Comment,
        children: [],
        data,
        parent: null
    }
}

/*
 * DOM Helpers
 */

function prettyPrinter(node: Node, level?: number): string {
    if (level == undefined) {
        level = 0
    }
    let result = ""

    switch (node.kind) {
        case NodeType.Text:
            result += padding(level) + node.data + "\n"
            break
        case NodeType.Element:
            result += padding(level) + "<"
            result += node.tagName
            if (node.attributes != null && node.attributes.size) {
                result += " " + printAttributes(node.attributes)
            }
            if (node.tagStyle == TagStyle.Default) {
                result += ">" + "\n"
                // recursion
                node.children.forEach(child => {
                    result += prettyPrinter(child, level + 1)
                })

                result += padding(level) + "</" + node.tagName + ">" + "\n"
            } else if (node.tagStyle == TagStyle.SelfClosing) {
                result += "/>" + "\n"
            }
            break
        case NodeType.Comment:
            result += padding(level) + "<!--" + node.data + "-->" + "\n"
            break
    }

    return result
}

function padding(level: number): string {
    let padding = ""
    for (let i = 1; i < level; i++) {
        padding += "  "
    }
    return padding

}

function printAttributes(attributes: Map<string, string>) {
    let result = []
    attributes.forEach((key, value) => {
        result.push(`${value}="${key}"`)
    })
    return result.join(" ")
}


export { Node, NodeType, elem, selfClosing, text, comment, prettyPrinter }