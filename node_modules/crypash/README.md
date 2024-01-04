# crypash

A lightweight and secure npm package providing a SHA-256 hashing algorithm implementation in pure JavaScript. Use this package to easily hash sensitive data for various applications, ensuring data integrity and security.

## Installation

You can install `crypash` using npm:

```bash
npm install crypash
```

## Usage

```typescript
// Import the crypash module
const crypash = require('crypash');

const inputText = "Hello, World!";
const algorithmToUse = 'sha256';
const hashedValue = crypash.hash(algorithmToUse, inputText);

if (crypash.check(algorithmToUse, inputText, hashedValue)) {
  console.log("Text matches the hashed value.");
} else {
  console.log("Text does not match the hashed value.");
}
```

## API

### `hash(algorithm: Algorithm, input: string): string`

This function hashes the input data using the specified algorithm.

- `algorithm` (string): The hashing algorithm to use. Currently, only `'sha256'` is supported.
- `input` (string): The data to be hashed.

Returns the hashed value as a hexadecimal string.

### `check(algorithm: Algorithm, input: string, hashedString: string): boolean`

This function checks if a given text, when hashed, matches a provided hashed value.

- `algorithm` (string): The hashing algorithm to use. Currently, only `'sha256'` is supported.
- `input` (string): The original text.
- `hashedString` (string): The hashed value to compare against.

Returns `true` if the text matches the hashed value, and `false` otherwise.

## Example

```typescript
// Import the crypash module
const crypash = require('crypash');

const inputText = "Example Data";
const algorithmToUse = 'sha256';
const hashedValue = crypash.hash(algorithmToUse, inputText);

if (crypash.check(algorithmToUse, inputText, hashedValue)) {
  console.log("Text matches the hashed value.");
} else {
  console.log("Text does not match the hashed value.");
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.