import { getElementsByTagName, getElementById } from "./finders"

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

type AttrMap = Map<string, string>

class Primitive {
    kind: NodeType
    parent: Node
    children: Node[]
    data: string // for tagName and innerHTML

    constructor(kind: NodeType) {
        this.kind = kind
        this.parent = null
        this.children = []
        this.data = ""
    }

    get isElement() {
        return this.kind === NodeType.Element
    }

    get isComment() {
        return this.kind === NodeType.Comment
    }

    get isText() {
        return this.kind === NodeType.Text
    }

}



class Node extends Primitive {
    attributes?: AttrMap
    tagStyle?: TagStyle

    constructor(kind: NodeType) {
        super(kind)
        this.attributes = new Map()
        this.tagStyle = null
    }

    get tagName() {
        if (this.kind == NodeType.Element) {
            return this.data
        } else {
            return ""
        }
    }

    appendChild(child: Node) {
        if (this.kind === NodeType.Element) {
            this.children.push(child)
        }
    }

    get innerHTML() {
        // TODO: implementation based on the data property
        let children = ""
        for (let child of this.children) {
            children += child.print()
        }
        return children
    }


    getAttribute(key: string) {
        if (this.kind == NodeType.Element) {
            if (this.hasAttribute(key)) {
                return this.attributes.get(key)
            }
        }
        return null
    }

    hasAttribute(key: string): boolean {
        if (this.kind == NodeType.Element) {
            if (this.attributes.has(key)) {
                return true
            }
        }
        return false
    }

    print(): string {
        return prettyPrinter(this, 0)
    }

    // getters
    getElementsByTagName(name: string): Node[] {
        return getElementsByTagName(this, name)
    }

}



/**
 * Constructors
 */
function elem(tagName: string, attributes: AttrMap, children: Node[]): Node {
    let el = new Node(NodeType.Element)
    el.data = tagName
    el.attributes = attributes
    el.tagStyle = TagStyle.Default
    el.parent = null
    el.children = children
    return el
}

function selfClosing(tagName: string, attributes: AttrMap): Node {
    let el = new Node(NodeType.Element)
    el.data = tagName
    el.attributes = attributes
    el.tagStyle = TagStyle.SelfClosing
    el.parent = null
    el.children = []
    return el
}

function text(data: string): Node {
    let el = new Node(NodeType.Text)
    el.data = data
    el.children = []
    el.parent = null
    return el
}
function comment(data: string): Node {
    let el = new Node(NodeType.Comment)
    el.data = data
    el.children = []
    el.parent = null
    return el
}

/**
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
            result += node.data
            if (node.attributes != null && node.attributes.size) {
                result += " " + printAttributes(node.attributes)
            }
            if (node.tagStyle == TagStyle.Default) {
                result += ">" + "\n"
                // recursion
                node.children.forEach(child => {
                    result += prettyPrinter(child, level + 1)
                })

                result += padding(level) + "</" + node.data + ">" + "\n"
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