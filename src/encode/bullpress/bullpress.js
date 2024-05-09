// An account service for cows.
// Copyright (C) 2024  SpectCOW

// GM1E

const Cowrle = require("./cowrle");
const BWT = require("./BWT");
const Huffman = require("./huffman");

const {
  CHUNK_LENGTH,
  CHUCK_LENGTH_SPEED,
  CHAR_EXCHANGE_COST,
  
  calculateCost,
  calculateChunks,
} = require("../blocks/cst");

const casing = require("../blocks/casing");

const AvoidEnc = require("../blocks/avoidE")

const patternEncoder = require("../blocks/patternE");
const BracketEncoder = require("../blocks/bracketE");

const Uint8Encoder = require("../blocks/uint8E")

const base64 = require("../blocks/base64");

function encodeBullpress(input, chunkSize = CHUNK_LENGTH) {
  // Chunk parsing for big data
  let encodedResult = "";
  for (let i = 0; i < input.length; i += chunkSize) {
    let chunk = input.substring(i, Math.min(i + chunkSize, input.length)),
      basedKey = base64.encode(chunk),
      res1 = BWT.burrowsWheelerTransform(basedKey),
      numbedKey = AvoidEnc.encode(res1.transformedString),
      cowrString = Cowrle.encodeCOWRLE(numbedKey),
      transformedString = BracketEncoder.encode(cowrString);

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
  let output = "",
    deCasedBull = /<Bull:(.*):>/g.exec(input)[1],
    decodedResult = deCasedBull.match(/<Bull_Chunk:(.*?)\|(\d+):>/g);

  if (!decodedResult) return;

  for (let i = 0; i < decodedResult.length; i++) {
    const chunk = decodedResult[i],
      [, transformedString, originalIndex] = chunk.match(
        /<Bull_Chunk:(.*)\|(\d+):>/,
      ),
      cowrString = BracketEncoder.decode(transformedString),
      numbedKey = Cowrle.decodeCOWRLE(cowrString),
      res1 = AvoidEnc.decode(numbedKey),
      basedKey = BWT.inverseBurrowsWheelerTransform(res1, originalIndex);

    output += base64.decode(basedKey);
  }

  return output;
}

function compressToUInt8Buffer(input = "") {
  // Converts the input string to a Uint8Array after encoding it with Bullpress
  const encoded = encodeBullpress(input);
  return Uint8Encoder.encodeUint8(encoded);
}

function decompressFromUInt8Buffer(input = new Uint8Array()) {
  // Decodes the input Uint8Array back to a string using Bullpress decoding
  const decodedString = Uint8Encoder.decodeUint8(input);
  return decodeBullpress(decodedString);
}

const eobj = {
  encodeBullpress,
  decodeBullpress,
  
  calculateCost,
  calculateChunks,

  CHUNK_LENGTH,
  CHUCK_LENGTH_SPEED,
  CHAR_EXCHANGE_COST,

  casing,
  AvoidEnc,
  base64,

  Cowrle,
  BWT,
  // Unused
  Huffman,

  compressToUInt8Buffer,
  decompressFromUInt8Buffer,
  Uint8Encoder
};

if (typeof globalThis.window !== "undefined") globalThis.window.bullpress = eobj;
if (typeof module !== "undefined") module.exports = eobj;