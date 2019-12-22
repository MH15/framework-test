
interface Element {
    content: any
}

enum NodeType {
    Text,
    Element
}

interface ElementData {
    tagName: string
    attributes: object
}

interface TextData {
    innerHTML: string
}

class Node {
    nodeType: NodeType
    children: Node[]
    data: ElementData | string
}

export { Node, NodeType }