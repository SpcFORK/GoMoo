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

const AvoidEnc = require("../blocks/avoidE");

const BracketEncoder = require("../blocks/bracketE");

// const patternEncoder = require("./blocks/patternE");
const Uint8Encoder = require("../blocks/uint8E")

const base64 = require("../blocks/base64");

function encodeBullpress(input, chunkSize = CHUNK_LENGTH * 1) {
  // Chunk parsing for big data
  let encodedResult = "";
  for (let i = 0; i < input.length; i += chunkSize) {
    let chunk = input.substring(i, Math.min(i + chunkSize, input.length)),
      HuffmanMap = Huffman.compress(chunk),
      binAsHexableChunks = HuffmanMap.encoded.match(/(.{1,4})/g),
      hexContent = binAsHexableChunks.reduce((acc, hxc) => acc + parseInt(hxc.padStart(4, '0'), 2).toString(16), ''),
      basedKey = base64.encode(hexContent),
      // Encode String
      res1 = BWT.burrowsWheelerTransform(basedKey),
      numbedKey = AvoidEnc.encode(res1.transformedString),
      cowrString = Cowrle.encodeCOWRLE(numbedKey),
      transformedString = BracketEncoder.encode(cowrString)

    // Encode Map
    let map = Huffman.encodeCodeMap(HuffmanMap.codeMap),
      mapString = map.join('\x04\x20'),
      basedMap = base64.encode(mapString),
      map1 = BWT.burrowsWheelerTransform(basedMap),
      numbedMap = AvoidEnc.encode(map1.transformedString),
      cowrMap = Cowrle.encodeCOWRLE(numbedMap),
      transformedMapString = BracketEncoder.encode(cowrMap);

    encodedResult += casing.caseChunk2({
      transformedString,
      originalIndex: res1.originalIndex,
      map: transformedMapString,
      mapI: map1.originalIndex,
    });
  }

  return casing.caseBull2({
    chunk: encodedResult,
  });
}

function decodeBullpress(input) {
  let output = "",
    deCasedBull = /<Bull2:(.*):>/g.exec(input)[1],
    decodedResult = deCasedBull.match(
      /<Bull2_Chunk:(.*?)\|(\d+)\|(.*?)\|(\d+):>/g,
    );

  if (!decodedResult) return '';

  for (let i = 0; i < decodedResult.length; i++) {
    const chunk = decodedResult[i],
      [, transformedString, originalIndex, emap, mapI] = chunk.match(
        /<Bull2_Chunk:(.*)\|(\d+)\|(.*)\|(\d+):>/,
      );

    // Decode Map
    const inflatedMap = BracketEncoder.decode(emap),
      cowrMap = Cowrle.decodeCOWRLE(inflatedMap),
      numbedMap = AvoidEnc.decode(cowrMap),
      map1 = BWT.inverseBurrowsWheelerTransform(numbedMap, mapI),
      unbasedMap = base64.decode(map1),
      encodedMap = unbasedMap.split('\x04\x20'),
      uintMap = new Uint16Array(encodedMap.map(x => parseInt(x))),
      map = Huffman.decodeCodeMap(uintMap)

    // Decode String
    const cowrString = BracketEncoder.decode(transformedString),
      numbedKey = Cowrle.decodeCOWRLE(cowrString),
      res1 = AvoidEnc.decode(numbedKey),
      burrowKey = BWT.inverseBurrowsWheelerTransform(
        res1,
        originalIndex,
      ),
      basedKey = base64.decode(burrowKey),
      unhexedContent = basedKey.match(/./g).map(x => parseInt(x, 16).toString(2).padStart(4, '0')),
      hexContent = unhexedContent.join(''),
      HuffmanMap = Huffman.decompress(hexContent, map);

    output += HuffmanMap
  }

  return output;
}

function compressToUInt8Buffer(input = "") {
  // Converts the input string to a Uint8Array after encoding it with Bullpress
  const encoded = encodeBullpress(input);
  return Uint8Encoder.stringToUint8(encoded);
}

function decompressFromUInt8Buffer(input = new Uint8Array()) {
  // Decodes the input Uint8Array back to a string using Bullpress decoding
  const decodedString = Uint8Encoder.uint8ToString(input);
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
  Huffman,

  compressToUInt8Buffer,
  decompressFromUInt8Buffer,
  Uint8Encoder
};

if (typeof window !== "undefined")
  window.bullpress = eobj;
if (typeof module !== "undefined") module.exports = eobj;
