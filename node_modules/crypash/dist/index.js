"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sha256_js_1 = require("./sha256.js");
function hash(algorithm, input) {
    switch (algorithm) {
        case 'sha256':
            return (0, sha256_js_1.default)(input);
        default:
            throw new Error("Unsupported algorithm: ".concat(algorithm, ", please use sha256."));
    }
}
function check(algorithm, input, hashedString) {
    var hashed = hash(algorithm, input);
    if (hashed === hashedString) {
        return true;
    }
    else {
        return false;
    }
}
module.exports = { hash: hash, check: check };
