// An account service for cows.
// Copyright (C) 2024  SpectCOW

const Cowrle = require("./cowrle");
const BWT = require("./BWT");
const Huffman = require("./huffman");

const CHUNK_LENGTH = 1024 * 8;
const CHUCK_LENGTH_SPEED = 260;
const CHAR_EXCHANGE_COST = CHUCK_LENGTH_SPEED / CHUNK_LENGTH;

function calculateCost(string) {
  return string.length * CHAR_EXCHANGE_COST;
}

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
    const caser = (_) => `(${_})`;
    return input.replace(/\d+/g, (match) =>
      caser(
        match
          .split("")
          .map((digit) =>
            String.fromCharCode("A".charCodeAt(0) + parseInt(digit))
          )
          .join("")
      )
    );
  },
  decode(input) {
    return input.replace(/\((.*?)\)/g, (match, p1) =>
      p1
        .split("")
        .map((char) => char.charCodeAt(0) - "A".charCodeAt(0))
        .join("")
    );
  },
};

const BracketEncoder = {
  encode(input) {
    return input
      .replace(/\]\(/g, "Ϣ")
      .replace(/\)\[/g, "ϣ")

      .replace(/\]\{/g, "Ϡ")
      .replace(/\}\[/g, "ϡ")

      .replace(/\)\{/g, "Ϟ")
      .replace(/\}\(/g, "ϟ")

      // SIMPLE (Must be below, for some reason)
      
      .replace(/\(\[/g, "{")
      .replace(/\]\)/g, "}")

      .replace(/\[\(/g, "<")
      .replace(/\)\]/g, ">")
  },

  decode(input) {
    return input

      .replace(/Ϣ/g, "](")
      .replace(/ϣ/g, ")[")

      .replace(/Ϡ/g, "]{")
      .replace(/ϡ/g, "}[")

      .replace(/Ϟ/g, "){")
      .replace(/ϟ/g, "}(")
      
      // SIMPLE (Must be below, for some reason)
      
      .replace(/\{/g, "([")
      .replace(/\}/g, "])")

      .replace(/\</g, "[(")
      .replace(/\>/g, ")]")
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
        /<Bull_Chunk:(.*)\|(\d+):>/
      ),
      cowrString = BracketEncoder.decode(transformedString),
      numbedKey = Cowrle.decodeCOWRLE(cowrString),
      res1 = AvoidEnc.decode(numbedKey),
      basedKey = BWT.inverseBurrowsWheelerTransform(res1, originalIndex);

    output += base64.decode(basedKey);
  }

  return output;
}

module.exports = {
  encodeBullpress,
  decodeBullpress,
  calculateCost,
  
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
