// An account service for cows.
// Copyright (C) 2024  SpectCOW

const b = require("../blocks/base64.js");

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
  for (let i = 0; i < str.length; i++)
    if (freqMap.hasOwnProperty(str[i])) freqMap[str[i]]++;
    else freqMap[str[i]] = 1;
  return freqMap;
}

function buildHuffmanTree(freqMap) {
  const nodes = [];
  for (let char in freqMap) nodes.push(new HuffmanNode(char, freqMap[char]));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);

    const left = nodes.shift(),
      right = nodes.shift(),
      newNode = new HuffmanNode(null, left.freq + right.freq);

    newNode.left = left;
    newNode.right = right;
    nodes.push(newNode);
  }
  return nodes[0];
}

function buildCodeMap(node, code = "", codeMap = {}) {
  if (node.char !== null) codeMap[node.char] = code;
  else
    [node.left, node.right].forEach((c, i) =>
      buildCodeMap(c, code + i, codeMap),
    );
  return codeMap;
}

function encode(str, codeMap) {
  let encoded = "";
  for (let i = 0; i < str.length; i++) encoded += codeMap[str[i]];
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
    for (let char in codeMap)
      if (codeMap[char] === currentCode) {
        decoded += char;
        currentCode = "";
        break;
      }
  }
  return decoded;
}

// ---

const lockerKeys = [
    "\u0000",
    "\u0001",
    "\u0002",
    "\u000f",
    "\u0003",
    "\u0004",
    "\u000f",
  ],
  lockerString = "L&" + lockerKeys.join("&"),
  lockerBits = [lockerString + lockerKeys[0], lockerString + lockerKeys[1]];

function codeMapToString(codeMap = {}) {
  let res = "";
  for (let char in codeMap)
    res += `${char}${lockerBits[0]}${codeMap[char]}${lockerBits[1]}`;
  return res;
}

function unpackCodeMapString(codeMapString) {
  let codeMap = {};
  for (let line of codeMapString.split(lockerBits[1])) {
    let [char, code] = line.split(lockerBits[0]);
    codeMap[char] = code;
  }
  return codeMap;
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
  codeMapToString,
  unpackCodeMapString,
};

if (typeof globalThis.window !== "undefined") globalThis.window.huffman = eobj;
if (typeof module !== "undefined") module.exports = eobj;
