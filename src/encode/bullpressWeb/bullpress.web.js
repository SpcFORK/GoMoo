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
  chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",

  encode(input = "") {
    let chars = this.chars,
      output = "",
      i = 0;

    while (i < input.length) {
      let a = input.charCodeAt(i++),
        b = input.charCodeAt(i++),
        c = input.charCodeAt(i++),
        index1 = a >> 2,
        index2 = ((a & 3) << 4) | (b >> 4),
        index3 = isNaN(b) ? 64 : ((b & 15) << 2) | (c >> 6),
        index4 = isNaN(c) ? 64 : c & 63;

      output += [index1, index2, index3, index4]
        .map((index) => chars[index])
        .join("");
    }

    return output;
  },

  decode(input = "") {
    let chars = this.chars,
      output = "",
      i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      let index1 = chars.indexOf(input.charAt(i++)),
        index2 = chars.indexOf(input.charAt(i++)),
        index3 = chars.indexOf(input.charAt(i++)),
        index4 = chars.indexOf(input.charAt(i++)),
        a = (index1 << 2) | (index2 >> 4),
        b = ((index2 & 15) << 4) | (index3 >> 2),
        c = ((index3 & 3) << 6) | index4;

      output += String.fromCharCode(a);
      if (index3 !== 64) output += String.fromCharCode(b);
      if (index4 !== 64) output += String.fromCharCode(c);
    }

    return output;
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
  casing,
  AvoidEnc,
  base64,
  Cowrle,
  BWT,
  // Unused
  Huffman,
};