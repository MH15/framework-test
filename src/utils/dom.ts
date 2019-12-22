
enum NodeType {
    Text,
    Element
}

interface ElementData {
    tagName?: string
    attributes?: Map<string, string>
    innerHTML?: string
}
interface Node {
    nodeType: NodeType
    children: Node[]
    data: ElementData

}

function elem(tagName: string, attributes: Map<string, string>, children: Node[]): Node {
    return {
        children,
        nodeType: NodeType.Element,
        data: {
            tagName,
            attributes
        }
    }
}

function text(innerHTML: string): Node {
    return {
        nodeType: NodeType.Text,
        children: [],
        data: {
            innerHTML
        }
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

    if (node.nodeType === NodeType.Text) {
        result += padding(level) + node.data.innerHTML + "\n"
    } else if (node.nodeType === NodeType.Element) {
        result += padding(level) + "<"
        result += node.data.tagName
        if (node.data.attributes != null && node.data.attributes.size) {
            result += " " + printAttributes(node.data.attributes)
        }
        result += ">" + "\n"
        // recursion
        node.children.forEach(child => {
            result += prettyPrinter(child, level + 1)
        })

        result += padding(level) + "</" + node.data.tagName + ">" + "\n"
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
        result.push(`key="${value}"`)
    })
    return result.join(" ")
}


export { Node, NodeType, elem, text, prettyPrinter }