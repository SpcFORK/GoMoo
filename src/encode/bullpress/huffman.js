// An account service for cows.
// Copyright (C) 2024  SpectCOW

class HuffmanNode {
  constructor(char, freq) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

function buildFrequencyMap(str) {
  const freqMap = {};
  for (let i = 0; i < str.length; i++) {
    if (freqMap.hasOwnProperty(str[i])) {
      freqMap[str[i]]++;
    } else {
      freqMap[str[i]] = 1;
    }
  }
  return freqMap;
}

function buildHuffmanTree(freqMap) {
  const nodes = [];
  for (let char in freqMap) {
    nodes.push(new HuffmanNode(char, freqMap[char]));
  }
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    const newNode = new HuffmanNode(null, left.freq + right.freq);
    newNode.left = left;
    newNode.right = right;
    nodes.push(newNode);
  }
  return nodes[0];
}

function buildCodeMap(node, code = "", codeMap = {}) {
  if (node.char !== null) {
    codeMap[node.char] = code;
  } else {
    buildCodeMap(node.left, code + "0", codeMap);
    buildCodeMap(node.right, code + "1", codeMap);
  }
  return codeMap;
}

function encode(str, codeMap) {
  let encoded = "";
  for (let i = 0; i < str.length; i++) {
    encoded += codeMap[str[i]];
  }
  return encoded;
}

function compress(str) {
  const freqMap = buildFrequencyMap(str);
  const huffmanTree = buildHuffmanTree(freqMap);
  const codeMap = buildCodeMap(huffmanTree);
  const encoded = encode(str, codeMap);
  return { encoded, codeMap };
}

function decompress(encoded, codeMap) {
  let decoded = "";
  let currentCode = "";
  for (let i = 0; i < encoded.length; i++) {
    currentCode += encoded[i];
    for (let char in codeMap) {
      if (codeMap[char] === currentCode) {
        decoded += char;
        currentCode = "";
        break;
      }
    }
  }
  return decoded;
}

// Example usage
// const originalString = "hello world";
// const compressedData = compress(originalString);
// console.log("Compressed data:", compressedData.encoded);
// console.log("Code map:", compressedData.codeMap);
// const decompressedString = decompress(
//   compressedData.encoded,
//   compressedData.codeMap,
// );
// console.log("Decompressed string:", decompressedString);

const eobj = {
  buildFrequencyMap,
  buildHuffmanTree,
  buildCodeMap,
  encode,
  compress,
  decompress,
};

if (typeof globalThis.window !== "undefined") globalThis.window.huffman = eobj;
if (typeof module !== "undefined") module.exports = eobj;