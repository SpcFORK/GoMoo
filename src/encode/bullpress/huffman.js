// An account service for cows. 2024 SpectCOW

function createHuffmanNode(char, freq, left = null, right = null) {
  return { char, freq, left, right };
}

function buildFrequencyMap(str) {
  return str.split("").reduce(function (map, char) {
    map[char] = (map[char] || 0) + 1;
    return map;
  }, {});
}

function buildHuffmanTree(freqMap) {
  let pq = [];
  function enqueue(element) {
    pq.push(element);
    pq.sort(function (a, b) {
      return a.freq - b.freq;
    });
  }
  function dequeue() {
    return pq.shift();
  }

  Object.entries(freqMap).forEach(function ([char, freq]) {
    enqueue(createHuffmanNode(char, freq));
  });
  while (pq.length > 1) {
    let left = dequeue(),
      right = dequeue();
    enqueue(createHuffmanNode(null, left.freq + right.freq, left, right));
  }
  return pq[0];
}

function buildCodeMap(node, prefix = "", codeMap = {}) {
  if (node.char !== null) codeMap[node.char] = prefix;
  else {
    buildCodeMap(node.left, prefix + "0", codeMap);
    buildCodeMap(node.right, prefix + "1", codeMap);
  }
  return codeMap;
}

function encode(str, codeMap) {
  return str
    .split("")
    .map(function (char) {
      return codeMap[char];
    })
    .join("");
}

function compress(str) {
  if (str.length === 1) return { encoded: "0", codeMap: { [str]: "0" } };
  let freqMap = buildFrequencyMap(str);
  let huffmanTree = buildHuffmanTree(freqMap);
  let codeMap = buildCodeMap(huffmanTree);
  return { encoded: encode(str, codeMap), codeMap };
}

function encodeCodeMap(codeMap = {}) {
  let encoded = [];
  for (let [char, code] of Object.entries(codeMap)) {
    encoded.push(char.charCodeAt(0), code.length, parseInt(code, 2));
  }
  return encoded;
}

function encodeStringsToUint8Array(strings) {
  let { encoded, codeMap } = compress(strings.join("\0"));
  let encodedBytes = [];
  for (let i = 0; i < encoded.length; i += 8) {
    encodedBytes.push(parseInt(encoded.slice(i, i + 8).padEnd(8, "0"), 2));
  }

  let encodedCodeMap = new Uint16Array(encodeCodeMap(codeMap));
  let headerLength = new Uint16Array([encodedCodeMap.length]);
  let bitLength = new Uint32Array([encoded.length]);

  let result = new Uint8Array(
    6 + encodedCodeMap.byteLength + encodedBytes.length,
  );
  result.set(new Uint8Array(headerLength.buffer), 0);
  result.set(new Uint8Array(bitLength.buffer), 2);
  result.set(new Uint8Array(encodedCodeMap.buffer), 6);
  result.set(new Uint8Array(encodedBytes), 6 + encodedCodeMap.byteLength);

  return result;
}

function decompress(encodedStr, codeMap) {
  let reversedCodeMap = Object.entries(codeMap).reduce(function (
    map,
    [char, code],
  ) {
    map[code] = char;
    return map;
  }, {});

  let decoded = "";
  let buffer = "";

  for (let bit of encodedStr) {
    buffer += bit;
    if (reversedCodeMap[buffer]) {
      decoded += reversedCodeMap[buffer];
      buffer = "";
    }
  }
  return decoded;
}

function decodeCodeMap(encodedMap = []) {
  let codeMap = {};
  for (let i = 0; i < encodedMap.length; i += 3) {
    let char = String.fromCharCode(encodedMap[i]);
    codeMap[char] = encodedMap[i + 2]
      .toString(2)
      .padStart(encodedMap[i + 1], "0");
  }
  return codeMap;
}

function decodeUint8ArrayToStrings(data) {
  let headerLength = new Uint16Array(data.buffer.slice(0, 2))[0];
  let bitLength = new Uint32Array(data.buffer.slice(2, 6))[0];
  let encodedCodeMap = new Uint16Array(
    data.buffer.slice(6, 6 + headerLength * 2),
  );
  let codeMap = decodeCodeMap(encodedCodeMap);
  let encodedBytes = Array.from(data.slice(6 + headerLength * 2));
  let encodedStr = encodedBytes
    .map(function (byte) {
      return byte.toString(2).padStart(8, "0");
    })
    .join("")
    .slice(0, bitLength);
  return decompress(encodedStr, codeMap).split("\0").filter(Boolean);
}

// ---

const lockerKeys = [
  "\u4202",
]
const lockerString = 'L&'+lockerKeys.join('&')

function codeMapToString(codeMap = {}) {
  let res = "";
  for (let char in codeMap)
    res += `${char}${lockerString + lockerKeys[0]}${codeMap[char]}${lockerString + lockerKeys[1]}`;
  return res;
}

function unpackCodeMapString(codeMapString) {
  let codeMap = {};
  for (let line of codeMapString.split(lockerString + lockerKeys[1])) {
    let [char, code] = line.split(lockerString + lockerKeys[1]);
    codeMap[char] = code;
  }
  return codeMap;
}

const eobj = {
  createHuffmanNode,
  buildFrequencyMap,
  buildHuffmanTree,
  buildCodeMap,
  encode,
  compress,
  encodeCodeMap,
  decompress,
  decodeCodeMap,
  decodeUint8ArrayToStrings,
  encodeStringsToUint8Array,
  codeMapToString,
  unpackCodeMapString,
};

if (typeof window !== "undefined") window.huffman = eobj;
if (typeof module !== "undefined") module.exports = eobj;
