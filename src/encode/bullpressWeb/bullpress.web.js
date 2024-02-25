import Cowrle from "./cowrle.js";
import BWT from "./BWT.js";
import Huffman from "./huffman.js";

const CHUNK_LENGTH = 1024 * 8;

const casing = {
  // Format: <BWT:{ transformedString }|{ originalIndex }:>
  caseChunk({ transformedString, originalIndex }) {
    return `<Bull_Chunk:${transformedString}|${originalIndex}:>`;
  },
  caseBull({ chunk }) {
    return `<Bull:${chunk}:>`;
  }
};

const AvoidEnc = {
  encode(input) {
    // Escape any Special Characters
    return input
      .replace(/\d+/g, (match) => {
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
    return input
      .replace(/\((.*?)\)/g, (match, p1) => {
        return p1
          .split("")
          .map((char) => char.charCodeAt(0) - "A".charCodeAt(0))
          .join("");
      });
  },
};

// const base64 = {
//   encode(input) {
//     return Buffer.from(input).toString("base64");
//   },
//   decode(input) {
//     return Buffer.from(input, "base64").toString("ascii");
//   }
// };

// No Buffer :(, we must manual
const base64 = {
  encode(input = '') {
    return input
      .split("")
      .map((char) => char.charCodeAt(0).toString(2))
      .join("");
  },
  decode(input = '') {
    return input
      .match(/.{1,8}/g)
      .map((bin) => parseInt(bin, 2).toString(10))
      .map((char) => String.fromCharCode(char))
      .join("");
  }
}

function encodeBullpress(input, chunkSize = CHUNK_LENGTH) {
  // Chunk parsing for big data
  let encodedResult = '';
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
    chunk: encodedResult 
  });
}

function decodeBullpress(input) {
  var output = '';
  const deCasedBull = /<Bull:(.*):>/g.exec(input)[1]
  const decodedResult = deCasedBull.match(/<Bull_Chunk:(.*?)\|(\d+):>/g)

  if (!decodedResult) return;

  for (let i = 0; i < decodedResult.length; i++) {
    const chunk = decodedResult[i];
    const [, transformedString, originalIndex] = chunk.match(/<Bull_Chunk:(.*)\|(\d+):>/);
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
}