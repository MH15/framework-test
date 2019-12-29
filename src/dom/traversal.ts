/**
 * Methods to traverse the virtual DOM.
 */
import * as DOM from "./node"


type Condition = (n: DOM.Node) => boolean
type Mutation = (n: DOM.Node) => any

// sample usage of a mutation
// mutation(root, (n) => {
//     return n.kind === DOM.NodeType.Element
// }, (n) => {
//     if (n.kind == DOM.NodeType.Element) {
//         n.tagName = "trick"
//     }
// })

new Map<Condition, Mutation>()

function mutation(root: DOM.Node, condition: Condition, mutate: Mutation): void;
function mutation(root: DOM.Node, condition: Condition, mutateIf: Mutation, mutateElse: Mutation): void;

/**
 * Mutate all nodes in a DOM.Node tree that meet a condition.
 * @param root: the DOM.Node object to begin the mutation on
 * @param condition: if condition returns true, mutate the current DOM.Node object
 * @param mutate: the function that is called on the DOM.Node object
 */
function mutation(root: DOM.Node, condition: Condition, mutateIf: Mutation, mutateElse?: Condition): void {
    if (condition(root) === true) {
        mutateIf(root)
    } else if (mutateElse) {
        mutateElse(root)
    }
    if (root.kind === DOM.NodeType.Element) {
        root.children.forEach(child => {
            if (mutateElse) {
                mutation(child, condition, mutateIf, mutateElse)
            } else {
                mutation(child, condition, mutateIf)
            }
        })
    }
}

/**
 * Like a switch-case but for Mutations
 * @param root: the DOM.Node object to begin the mutation on
 * @param methods: a Map of Conditon-Mutation pairs to apply to the Node
 */
export function multiMutation(root: DOM.Node, methods: Map<Condition, Mutation>): void {
    for (let condition of methods.keys()) {
        if (condition(root) === true) {
            let mutation = methods.get(condition)
            mutation(root)
        }
    }
    if (root.kind === DOM.NodeType.Element) {
        root.children.forEach(child => {
            multiMutation(child, methods)
        })
    }
}

/*
Example of multiMutation:
    multiMutation(this.template, new Map([
        [(n: DOM.Node): boolean => {
            if (n.kind === DOM.NodeType.Element) {
                let tag = n.tagName.toLowerCase()
                // console.log("tag:", tag)
                if (buildSet.has(tag)) {
                    return true
                }
            }
            return false
        }, (n: DOM.Node): void => {
            console.log("modding", n)
            let componentToInsert = findComponent(built, n.tagName)
            console.log("found:", componentToInsert)
            for (let child of componentToInsert.template.children) {
                n.appendChild(child)
            }
            console.log("modded", n)
        }]

    ]))
*/


// sample usage of getElement
// let el = getElement(root, (el) => {
//     if (el.kind === DOM.NodeType.Element) {
//         if (el.tagName == "FancyHeader") {
//             return true
//         }
//     }
//     return false
// })

/**
 * Find an Element in the tree that meets the condition.
 * @param root: the DOM.Node object to begin the search on
 * @param condition: if condition returns true on the current Node, return the
 * current Node
 * @returns the DOM.Node that meets Condition if a Node is found that meets the
 * condition, else returns null
 */
function getElement(root: DOM.Node, condition: Condition): DOM.Node {
    let foundNode = null
    if (root.kind === DOM.NodeType.Element) {
        if (condition(root)) {
            foundNode = root
        } else {
            root.children.forEach(child => {
                foundNode = getElement(child, condition) || foundNode
            })
        }
    }
    return foundNode
}


/**
 * Find all Elements in the tree that meet a condition.
 * @param root: the DOM.Node object to begin the search on
 * @param condition: if condition returns true on the current Node, add it to
 * the list of Nodes meeting the condition
 * @returns the list of Nodes meeting the condition
 */
function getAllElements(root: DOM.Node, condition: Condition, level: number): DOM.Node[] {
    let found = getAllHelper(root, condition)
    return found
}


function getAllHelper(root: DOM.Node, condition: Condition): DOM.Node[] {
    let found = []
    if (root.kind === DOM.NodeType.Element) {
        if (condition(root)) {
            found.push(root)
        } else {
            for (let child of root.children) {
                let result = getAllHelper(child, condition)
                if (result.length > 0) {
                    found.push(...result)
                }
            }
        }
    }
    return found
}






export { mutation, getElement, getAllElements }