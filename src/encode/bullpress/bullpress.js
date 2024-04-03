// An account service for cows.
// Copyright (C) 2024  SpectCOW

const Cowrle = require("./cowrle");
const BWT = require("./BWT");
const Huffman = require("./huffman");

const {
  CHUNK_LENGTH,
  CHUCK_LENGTH_SPEED,
  CHAR_EXCHANGE_COST,
  
  calculateCost,
  calculateChunks,
} = require("./blocks/cst");

const casing = require("./blocks/casing");

const AvoidEnc = require("./blocks/avoidE")

const BracketEncoder = require("./blocks/bracketE");

const base64 = require("./blocks/base64");

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
};

if (typeof globalThis.window !== "undefined") globalThis.window.bullpress = eobj;
if (typeof module !== "undefined") module.exports = eobj;