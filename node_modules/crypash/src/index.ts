import sha256 from './sha256.js';

type Algorithm = 'sha256';

function hash(algorithm: Algorithm, input: string): string {
    switch (algorithm) {
        case 'sha256':
            return sha256(input);
        default:
            throw new Error(`Unsupported algorithm: ${algorithm}, please use sha256.`);
    }
}

function check(algorithm: Algorithm, input: string, hashedString: string): boolean {
    let hashed = hash(algorithm, input);
    if (hashed === hashedString) {
        return true;
    } else {
        return false;
    }
}

module.exports = { hash, check };