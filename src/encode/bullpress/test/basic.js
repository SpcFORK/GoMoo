const bp = require("../index");

const STRING = "Hello World!";
console.log("String: ", STRING);

const encoded = bp.encode(STRING);
console.log("Encoded: ", encoded.encodedString);
const decoded = bp.decode(encoded.encodedString);
console.log("Decoded: ", decoded);

console.log("Result: ", decoded.decodedString === STRING)