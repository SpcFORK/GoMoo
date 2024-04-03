import Cowrle from "../cowrle.js";
import BWT from "../BWT.js";
import Huffman from "../huffman.js";

import {
  CHUNK_LENGTH,
  CHUCK_LENGTH_SPEED,
  CHAR_EXCHANGE_COST,
  calculateCost,
  calculateChunks,
} from "../blocks/cst";

import casing from "../blocks/casing";

import AvoidEnc from "../blocks/avoidE";

import BracketEncoder from "../blocks/bracketE";

import base64 from "../blocks/base64";

function encodeBullpress(input, chunkSize = CHUNK_LENGTH) {
  // Chunk parsing for big data
  let encodedResult = "";
  for (let i = 0; i < input.length; i += chunkSize) {
    let chunk = input.substring(i, Math.min(i + chunkSize, input.length)),
      basedKey = base64.encode(chunk),
      res1 = BWT.burrowsWheelerTransform(basedKey),
      numbedKey = AvoidEnc.encode(res1.transformedString),
      transformedString = Cowrle.encodeCOWRLE(numbedKey);

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

export {
  encodeBullpress,
  decodeBullpress,
  CHUNK_LENGTH,
  CHUCK_LENGTH_SPEED,
  CHAR_EXCHANGE_COST,
  calculateCost,
  calculateChunks,
  casing,
  AvoidEnc,
  BracketEncoder,
  base64,
  Cowrle,
  BWT,
  // Unused
  Huffman,
};
