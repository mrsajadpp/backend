"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sha256(message) {
    var blocks = [];
    var sha256Constants = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];
    // Helper functions
    function rightRotate(value, shift) {
        return (value >>> shift) | (value << (32 - shift));
    }
    function toHexString(value) {
        return ("00000000" + value.toString(16)).slice(-8);
    }
    // Padding
    var bitLength = message.length * 8;
    message += String.fromCharCode(0x80);
    while ((message.length * 8) % 512 !== 448) {
        message += String.fromCharCode(0x00);
    }
    message += String.fromCharCode((bitLength >> 56) & 0xff);
    message += String.fromCharCode((bitLength >> 48) & 0xff);
    message += String.fromCharCode((bitLength >> 40) & 0xff);
    message += String.fromCharCode((bitLength >> 32) & 0xff);
    message += String.fromCharCode((bitLength >> 24) & 0xff);
    message += String.fromCharCode((bitLength >> 16) & 0xff);
    message += String.fromCharCode((bitLength >> 8) & 0xff);
    message += String.fromCharCode(bitLength & 0xff);
    // Process blocks
    for (var i = 0; i < message.length; i += 64) {
        var block = new Array(64);
        for (var j = 0; j < 64; j++) {
            block[j] = message.charCodeAt(i + j) & 0xff;
        }
        blocks.push(block);
    }
    // Hash computation
    var hash = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
    ];
    for (var i = 0; i < blocks.length; i++) {
        var w = new Array(64);
        for (var t = 0; t < 16; t++) {
            w[t] = (blocks[i][t * 4] << 24) | (blocks[i][t * 4 + 1] << 16) | (blocks[i][t * 4 + 2] << 8) | blocks[i][t * 4 + 3];
        }
        for (var t = 16; t < 64; t++) {
            var s0 = rightRotate(w[t - 15], 7) ^ rightRotate(w[t - 15], 18) ^ (w[t - 15] >>> 3);
            var s1 = rightRotate(w[t - 2], 17) ^ rightRotate(w[t - 2], 19) ^ (w[t - 2] >>> 10);
            w[t] = (w[t - 16] + s0 + w[t - 7] + s1) & 0xffffffff;
        }
        var a = hash[0], b = hash[1], c = hash[2], d = hash[3], e = hash[4], f = hash[5], g = hash[6], h = hash[7];
        for (var t = 0; t < 64; t++) {
            var s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
            var maj = (a & b) ^ (a & c) ^ (b & c);
            var t2 = s0 + maj;
            var s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
            var ch = (e & f) ^ (~e & g);
            var t1 = h + s1 + ch + sha256Constants[t] + w[t];
            h = g;
            g = f;
            f = e;
            e = (d + t1) & 0xffffffff;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) & 0xffffffff;
        }
        hash[0] = (hash[0] + a) & 0xffffffff;
        hash[1] = (hash[1] + b) & 0xffffffff;
        hash[2] = (hash[2] + c) & 0xffffffff;
        hash[3] = (hash[3] + d) & 0xffffffff;
        hash[4] = (hash[4] + e) & 0xffffffff;
        hash[5] = (hash[5] + f) & 0xffffffff;
        hash[6] = (hash[6] + g) & 0xffffffff;
        hash[7] = (hash[7] + h) & 0xffffffff;
    }
    // Finalize
    var result = hash.map(toHexString).join("");
    return result;
}
exports.default = sha256;
