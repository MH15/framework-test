"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomParser = require('dom-parser');
const parser = new DomParser();
function parseHTML(content) {
    let dom = parser.parseFromString(content);
    return dom;
}
exports.parseHTML = parseHTML;
//# sourceMappingURL=parser.js.map