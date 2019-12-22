"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stack {
    constructor() {
        this._store = [];
    }
    push(val) {
        this._store.push(val);
    }
    pop() {
        return this._store.pop();
    }
    get length() {
        return this._store.length;
    }
}
exports.Stack = Stack;
//# sourceMappingURL=structures.js.map