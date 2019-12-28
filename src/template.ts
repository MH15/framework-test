/**
 * Template uses the DOM module to search and replace items in the DOM.
 * 
 */
import * as DOM from "./utils/dom/dom"


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


}



*/