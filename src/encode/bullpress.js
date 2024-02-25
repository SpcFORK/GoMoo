// An account service for cows.
// Copyright (C) 2024  SpectCOW

const Cowrle = require("./cowrle");
const BWT = require("./BWT");
const Huffman = require("./huffman");

const CHUNK_LENGTH = 1024 * 8;

const casing = {
  // Format: <BWT:{ transformedString }|{ originalIndex }:>
  caseChunk({ transformedString, originalIndex }) {
    return `<Bull_Chunk:${transformedString}|${originalIndex}:>`;
  },
  caseBull({ chunk }) {
    return `<Bull:${chunk}:>`;
  },
};

const AvoidEnc = {
  encode(input) {
    // Escape any Special Characters
    return input.replace(/\d+/g, (match) => {
      const res = match
        .split("")
        .map((digit) =>
          String.fromCharCode("A".charCodeAt(0) + parseInt(digit)),
        )
        .join("");

      return `(${res})`;
    });
  },
  decode(input) {
    return input.replace(/\((.*?)\)/g, (match, p1) => {
      return p1
        .split("")
        .map((char) => char.charCodeAt(0) - "A".charCodeAt(0))
        .join("");
    });
  },
};

const base64 = {
  encode(input) {
    return Buffer.from(input).toString("base64");
  },
  decode(input) {
    return Buffer.from(input, "base64").toString("ascii");
  },
};

function encodeBullpress(input, chunkSize = CHUNK_LENGTH) {
  // Chunk parsing for big data
  let encodedResult = "";
  for (let i = 0; i < input.length; i += chunkSize) {
    const chunk = input.substring(i, Math.min(i + chunkSize, input.length));
    const basedKey = base64.encode(chunk);
    const res1 = BWT.burrowsWheelerTransform(basedKey);
    const numbedKey = AvoidEnc.encode(res1.transformedString);
    const transformedString = Cowrle.encodeCOWRLE(numbedKey);

    encodedResult += casing.caseChunk({
      transformedString,
      originalIndex: res1.originalIndex,
    });
  }

  return casing.caseBull({
    chunk: encodedResult,
  });
}

function decodeBullpress(input) {
  var output = "";
  const deCasedBull = /<Bull:(.*):>/g.exec(input)[1];
  const decodedResult = deCasedBull.match(/<Bull_Chunk:(.*?)\|(\d+):>/g);

  if (!decodedResult) return;

  for (let i = 0; i < decodedResult.length; i++) {
    const chunk = decodedResult[i];
    const [, transformedString, originalIndex] = chunk.match(
      /<Bull_Chunk:(.*)\|(\d+):>/,
    );
    const numbedKey = Cowrle.decodeCOWRLE(transformedString);
    const res1 = AvoidEnc.decode(numbedKey);
    const basedKey = BWT.inverseBurrowsWheelerTransform(res1, originalIndex);
    output += base64.decode(basedKey);
  }

  return output;
}

// ---

const fs = require("fs");
const path = require("path");
// const input = fs.readFileSync(path.join(__dirname, "enwik8.pmd"), "utf8")

// const input = "Hello World!"
//   .repeat(12)
//   .repeat(60)
//   .repeat(100)

const input = fs.readFileSync(path.join(__dirname, "enwik8.pmd"), "utf8").slice(0, CHUNK_LENGTH * 6)

// Example usage with timing:
const start = Date.now();

const originalString = encodeURI(input);

if (originalString.length < 10000) {
  console.log("Original String: ", input);
  console.log(".");
  console.log("Original String (With URI ENCODE): ", originalString);
  console.log("..");
}

const encodedString = encodeBullpress(originalString);
if (encodedString.length < 10000) console.log("Encoded String: ", encodedString, "\n");

console.log(
  "Optimization Status: ",
  encodedString.length < originalString.length ? "Optimized" : "Not Optimized",
);

console.log("Chunk Length: ", CHUNK_LENGTH, "bytes");
console.log("Number of Chunks: ", Math.floor(input.length / CHUNK_LENGTH));

console.log("Encoded Length:  ", encodedString.length, "bytes");
console.log("Original Length:    ", originalString.length, "bytes");

console.log(
  "Size Difference:  ",
  encodedString.length - originalString.length,
  "bytes",
);
console.log(
  "Percentage Difference:  ",
  (
    ((encodedString.length - originalString.length) / originalString.length) *
    100
  ).toFixed(2),
  "%",
);
console.log();

const end = Date.now();
console.log("Processing Time: ", end - start, "ms");

const decodedString = decodeBullpress(encodedString);
const end2 = Date.now();
console.log("Decoding time: ", end2 - end, "ms");
// console.log("Decoded String: ", decodedString);

console.log();

// console.log("Original String: ", decodeURI(decodedString));\

console.log("Result: ", originalString === decodedString);
