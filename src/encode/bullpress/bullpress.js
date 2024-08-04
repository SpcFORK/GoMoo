// An account service for cows.
// Copyright (C) 2024  SpectCOW

// GM1E

const Cowrle = require("./cowrle");
const BWT = require("./BWT");
const Huffman = require("./huffman");
const Lzw = require("./lzw");

const {
  CHUNK_LENGTH,
  CHUCK_LENGTH_SPEED,
  CHAR_EXCHANGE_COST,

  calculateCost,
  calculateChunks,
} = require("../blocks/cst");

const casing = require("../blocks/casing");

const AvoidEnc = require("../blocks/avoidE");

const patternEncoder = require("../blocks/patternE");
const BracketEncoder = require("../blocks/bracketE");

const Uint8Encoder = require("../blocks/uint8E");

const base64 = require("../blocks/base64");
const hex = require("../blocks/hexE");
const utf8 = require("../blocks/utf8");
const base92 = require("../blocks/base92");

function encodeBullpress(input, chunkSize = CHUNK_LENGTH) {
  // Chunk parsing for big data
  let encodedResult = "";
  for (let i = 0; i < input.length; i += chunkSize) {
    let chunk = input.substring(i, Math.min(i + chunkSize, input.length)),
      hexedKey = hex.stringToHex(chunk),
      res1 = BWT.burrowsWheelerTransform(hexedKey),
      numbedKey = AvoidEnc.encode(res1.transformedString),
      cowrString = Cowrle.encodeCOWRLE(numbedKey),
      patterKey = patternEncoder.encode(cowrString),
      transformedString = BracketEncoder.encode(patterKey);

    // UTF8 => LZW
    encodedResult += casing.caseChunk({
      transformedString: Lzw.lzwCompress(
        utf8
          .encodeUTF8(transformedString)
          .reduce((str, v) => str + String.fromCharCode(v), ""),
      ),
      originalIndex: res1.originalIndex,
    });
  }

  return casing.caseBull({ chunk: encodedResult });
}

function decodeBullpress(input) {
  let output = "";
  try {
    var deCasedBull = /<Bull:([^]*):>/g.exec(input)[1],
      decodedResult = [
        ...deCasedBull.matchAll(/<Bull_Chunk:([^]*?)\|(\d+):>/g),
      ].map((rarr) => [rarr[0], rarr[1], rarr[2]]);
  } catch (e) {
    throw new Error("Invalid Bullpress data: \n" + e);
  }

  if (!decodedResult) return;

  for (let i = 0; i < decodedResult.length; i++) {
    const chunk = decodedResult[i],
      [, transformedString, originalIndex] = chunk,
      decodedString = utf8.decodeUTF8(
        Lzw.lzwDecompress(transformedString)
          .split("")
          .map((v) => v.charCodeAt(0)),
      ),
      patternKey = BracketEncoder.decode(decodedString),
      cowrString = patternEncoder.decode(patternKey),
      numbedKey = Cowrle.decodeCOWRLE(cowrString),
      res1 = AvoidEnc.decode(numbedKey),
      hexedKey = BWT.inverseBurrowsWheelerTransform(res1, originalIndex);

    output += hex.hexToString(hexedKey);
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
  Uint8Encoder,
};

if (typeof window !== "undefined") window.bullpress = eobj;
if (typeof module !== "undefined") module.exports = eobj;
