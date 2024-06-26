(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/database/index.js
  var require_database = __commonJS({
    "src/database/index.js"() {
    }
  });

  // src/encode/bullpress/cowrle.js
  var require_cowrle = __commonJS({
    "src/encode/bullpress/cowrle.js"(exports, module) {
      function* encodeCOWRLEGenerator(input) {
        let encoded = "", lastCount = i = 0, count = 1, inBrackets = false, processChar = (char, nextChar) => {
          if (char === nextChar) {
            count++;
          } else {
            handleUniqueChar(char);
          }
        }, handleUniqueChar = (char) => {
          if (count > 1) {
            handleRepeatedChar(char);
          } else {
            handleSingleChar(char);
          }
          finalizeEncoding();
        }, handleRepeatedChar = (char) => {
          if (!inBrackets) {
            encoded += "[";
            inBrackets = true;
          }
          if (lastCount != count) {
            encoded += count;
            lastCount = count;
          }
          encoded += char;
        }, handleSingleChar = (char) => {
          if (inBrackets) {
            encoded += "]";
            inBrackets = false;
          }
          encoded += char;
        }, finalizeEncoding = () => {
          if (i == input.length - 1 && inBrackets) {
            encoded += "]";
          }
          count = 1;
        };
        {
          try {
            for (; i < input.length; i++) {
              processChar(input[i], input[i + 1]);
              yield encoded;
              encoded = "";
            }
          } catch (e) {
            console.error("Failed to encode COWRLE:", e);
          } finally {
            encoded = null;
          }
        }
      }
      function* decodeCOWRLEGenerator(input) {
        let decoded = "", count = "", inBrackets = false, lastCount = 1, i2 = 0, processCharacter = (character) => {
          if (character === "[") {
            inBrackets = true;
            return;
          }
          if (character === "]") {
            inBrackets = false;
            return;
          }
          if (character !== " " && !isNaN(character)) {
            updateCount(character);
          } else {
            handleCharacter(character);
          }
        }, updateCount = (character) => {
          count += character;
          lastCount = parseInt(count);
        }, handleCharacter = (character) => {
          if (parseInt(count) !== 0 && parseInt(count) !== lastCount) {
            decoded += character.repeat(lastCount);
          } else if (parseInt(count) == lastCount) {
            decoded += character.repeat(parseInt(count));
            count = "0";
          } else {
            if (inBrackets)
              decoded += character.repeat(parseInt(count) || lastCount);
            else
              decoded += character;
          }
        };
        try {
          for (; i2 < input.length; i2++) {
            processCharacter(input[i2]);
            yield decoded;
            decoded = "";
          }
        } catch (e) {
          console.error("Failed to decode COWRLE:", e);
        } finally {
          decoded = null;
        }
      }
      function encodeCOWRLE(input) {
        return [...encodeCOWRLEGenerator(input)].join("");
      }
      function decodeCOWRLE(input) {
        return [...decodeCOWRLEGenerator(input)].join("");
      }
      var eobj = {
        encodeCOWRLE,
        decodeCOWRLE
      };
      if (typeof globalThis.window !== "undefined")
        globalThis.window.cowrle = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/bullpress/BWT.js
  var require_BWT = __commonJS({
    "src/encode/bullpress/BWT.js"(exports, module) {
      function burrowsWheelerTransform(input) {
        const rotations = [];
        for (let i2 = 0; i2 < input.length; i2++) {
          const rotation = input.slice(i2) + input.slice(0, i2);
          rotations.push(rotation);
        }
        rotations.sort();
        let transformedString = "";
        for (let i2 = 0; i2 < rotations.length; i2++) {
          transformedString += rotations[i2][input.length - 1];
        }
        let originalIndex;
        for (let i2 = 0; i2 < rotations.length; i2++) {
          if (rotations[i2] === input) {
            originalIndex = i2;
            break;
          }
        }
        return { transformedString, originalIndex };
      }
      function inverseBurrowsWheelerTransform(transformedString = "", originalIndex) {
        const table = [];
        for (let i2 = 0; i2 < transformedString.length; i2++) {
          table.push({ char: transformedString[i2], index: i2 });
        }
        table.sort((a, b) => {
          if (a.char < b.char)
            return -1;
          if (a.char > b.char)
            return 1;
          return 0;
        });
        let originalString = "";
        let currentIndex = originalIndex;
        for (let i2 = 0; i2 < transformedString.length; i2++) {
          originalString += table[currentIndex].char;
          currentIndex = table[currentIndex].index;
        }
        return originalString;
      }
      var eobj = {
        burrowsWheelerTransform,
        inverseBurrowsWheelerTransform
      };
      if (typeof globalThis.window !== "undefined")
        globalThis.window.bwt = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/blocks/base64.js
  var require_base64 = __commonJS({
    "src/encode/blocks/base64.js"(exports, module) {
      var base64 = {
        chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        encode(input = "") {
          let chars = this.chars, output = "", i2 = 0;
          while (i2 < input.length) {
            let a = input.charCodeAt(i2++), b = input.charCodeAt(i2++), c = input.charCodeAt(i2++), index1 = a >> 2, index2 = (a & 3) << 4 | b >> 4, index3 = isNaN(b) ? 64 : (b & 15) << 2 | c >> 6, index4 = isNaN(c) ? 64 : c & 63;
            output += [index1, index2, index3, index4].map((index) => chars[index]).join("");
          }
          output = output.replace(/=+$/, "");
          return output;
        },
        decode(input = "") {
          let chars = this.chars, output = "", i2 = 0;
          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
          while (i2 < input.length) {
            let index1 = chars.indexOf(input.charAt(i2++)), index2 = chars.indexOf(input.charAt(i2++)), index3 = chars.indexOf(input.charAt(i2++)), index4 = chars.indexOf(input.charAt(i2++)), a = index1 << 2 | index2 >> 4, b = (index2 & 15) << 4 | index3 >> 2, c = (index3 & 3) << 6 | index4;
            output += String.fromCharCode(a);
            if (index3 !== 64)
              output += String.fromCharCode(b);
            if (index4 !== 64)
              output += String.fromCharCode(c);
          }
          output = output.replace(/[\x00\uffff]+$/g, "");
          return output;
        }
      };
      if (typeof globalThis.window !== "undefined")
        globalThis.window.base64 = base64;
      if (typeof globalThis.Buffer !== "undefined")
        module.exports = {
          encode(input) {
            return globalThis.Buffer.from(input).toString("base64");
          },
          decode(input) {
            return globalThis.Buffer.from(input, "base64").toString("ascii");
          }
        };
      else if (typeof module !== "undefined")
        module.exports = base64;
    }
  });

  // src/encode/bullpress/huffman.js
  var require_huffman = __commonJS({
    "src/encode/bullpress/huffman.js"(exports, module) {
      var b = require_base64();
      var HuffmanNode = class {
        constructor(char, freq) {
          this.char = char;
          this.freq = freq;
          this.left = null;
          this.right = null;
        }
      };
      function buildFrequencyMap(str) {
        const freqMap = {};
        for (let i2 = 0; i2 < str.length; i2++) {
          if (freqMap.hasOwnProperty(str[i2])) {
            freqMap[str[i2]]++;
          } else {
            freqMap[str[i2]] = 1;
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
          nodes.sort((a, b2) => a.freq - b2.freq);
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
        for (let i2 = 0; i2 < str.length; i2++) {
          encoded += codeMap[str[i2]];
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
        for (let i2 = 0; i2 < encoded.length; i2++) {
          currentCode += encoded[i2];
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
      var lockerKeys = [
        "\0",
        "",
        "",
        "",
        "",
        "",
        ""
      ];
      var lockerString = "L&" + lockerKeys.join("&");
      var lockerBits = [
        lockerString + lockerKeys[0],
        lockerString + lockerKeys[1]
      ];
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
      var eobj = {
        buildFrequencyMap,
        buildHuffmanTree,
        buildCodeMap,
        encode,
        compress,
        decompress,
        codeMapToString,
        unpackCodeMapString
      };
      if (typeof globalThis.window !== "undefined")
        globalThis.window.huffman = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/blocks/cst.js
  var require_cst = __commonJS({
    "src/encode/blocks/cst.js"(exports, module) {
      var CHUNK_LENGTH = 1024 * 8;
      var CHUCK_LENGTH_SPEED = 270;
      var CHAR_EXCHANGE_COST = CHUCK_LENGTH_SPEED / CHUNK_LENGTH;
      function calculateCost(string) {
        return string.length * CHAR_EXCHANGE_COST;
      }
      function calculateChunks(string) {
        return Math.ceil(string.length / CHUNK_LENGTH);
      }
      var eobj = {
        CHUNK_LENGTH,
        CHUCK_LENGTH_SPEED,
        CHAR_EXCHANGE_COST,
        calculateCost,
        calculateChunks
      };
      if (typeof globalThis.window !== "undefined")
        globalThis.window.cst = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/blocks/casing.js
  var require_casing = __commonJS({
    "src/encode/blocks/casing.js"(exports, module) {
      var eobj = {
        // BP1
        caseChunk({ transformedString, originalIndex }) {
          return `<Bull_Chunk:${transformedString}|${originalIndex}:>`;
        },
        caseBull({ chunk }) {
          return `<Bull:${chunk}:>`;
        },
        // BP2
        caseChunk2({ transformedString, originalIndex, map, mapI }) {
          return `<Bull2_Chunk:${transformedString}|${originalIndex}|${map}|${mapI}:>`;
        },
        caseBull2({ chunk }) {
          return `<Bull2:${chunk}:>`;
        }
      };
      if (typeof globalThis.window !== "undefined")
        globalThis.window.casing = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/blocks/avoidE.js
  var require_avoidE = __commonJS({
    "src/encode/blocks/avoidE.js"(exports, module) {
      var eobj = {
        encode(input) {
          const caser = (_) => `(${_})`;
          return input.replace(
            /\d+/g,
            (match) => caser(
              match.split("").map(
                (digit) => String.fromCharCode("A".charCodeAt(0) + parseInt(digit))
              ).join("")
            )
          );
        },
        decode(input) {
          return input.replace(
            /\((.*?)\)/g,
            (match, p1) => p1.split("").map((char) => char.charCodeAt(0) - "A".charCodeAt(0)).join("")
          );
        }
      };
      if (typeof globalThis.window !== "undefined")
        globalThis.window.AvoidEnc = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/blocks/patternE.js
  var require_patternE = __commonJS({
    "src/encode/blocks/patternE.js"(exports, module) {
      var eobj = {
        isPattern: /(([^]+?)\2{2,})/g,
        reg: /(([^]+?)\2+)/g,
        unreg: /ͼ(([^]+?)(\d)+)+?ͼ/g,
        encode(input = "") {
          if (input.length === 0)
            return input;
          return input.replace(this.isPattern, (match, p1, p2) => {
            let matchCount = p1.split(p2).length - 1;
            let res = `\u037C${p2 + matchCount}\u037C`;
            return res;
          });
        },
        decode(input = "") {
          return input.replace(this.unreg, (match, p1, p2, p3) => {
            return p2.repeat(parseInt(p3));
          });
        }
      };
      if (typeof globalThis.window !== "undefined")
        globalThis.window.BracketEncoder = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/blocks/bracketE.js
  var require_bracketE = __commonJS({
    "src/encode/blocks/bracketE.js"(exports, module) {
      var eobj = {
        encode(input) {
          return input.replace(/\]\(/g, "\u03E2").replace(/\)\[/g, "\u03E3").replace(/\]\{/g, "\u03E0").replace(/\}\[/g, "\u03E1").replace(/\)\{/g, "\u03DE").replace(/\}\(/g, "\u03DF").replace(/\(\[/g, "{").replace(/\]\)/g, "}").replace(/\[\(/g, "<").replace(/\)\]/g, ">");
        },
        decode(input) {
          return input.replace(/Ϣ/g, "](").replace(/ϣ/g, ")[").replace(/Ϡ/g, "]{").replace(/ϡ/g, "}[").replace(/Ϟ/g, "){").replace(/ϟ/g, "}(").replace(/\{/g, "([").replace(/\}/g, "])").replace(/\</g, "[(").replace(/\>/g, ")]");
        }
      };
      if (typeof globalThis.window !== "undefined")
        globalThis.window.BracketEncoder = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/blocks/uint8E.js
  var require_uint8E = __commonJS({
    "src/encode/blocks/uint8E.js"(exports, module) {
      var encoder = new TextEncoder();
      var decoder = new TextDecoder("utf-8", { ignoreBOM: true });
      var encodeUint8 = (input = "") => encoder.encode(input);
      var decodeUint8 = (input = new Uint8Array()) => decoder.decode(input);
      module.exports = {
        encodeUint8,
        decodeUint8
      };
    }
  });

  // src/encode/bullpress/bullpress.js
  var require_bullpress = __commonJS({
    "src/encode/bullpress/bullpress.js"(exports, module) {
      var Cowrle = require_cowrle();
      var BWT = require_BWT();
      var Huffman = require_huffman();
      var {
        CHUNK_LENGTH,
        CHUCK_LENGTH_SPEED,
        CHAR_EXCHANGE_COST,
        calculateCost,
        calculateChunks
      } = require_cst();
      var casing = require_casing();
      var AvoidEnc = require_avoidE();
      var patternEncoder = require_patternE();
      var BracketEncoder = require_bracketE();
      var Uint8Encoder = require_uint8E();
      var base64 = require_base64();
      function encodeBullpress(input, chunkSize = CHUNK_LENGTH) {
        let encodedResult = "";
        for (let i2 = 0; i2 < input.length; i2 += chunkSize) {
          let chunk = input.substring(i2, Math.min(i2 + chunkSize, input.length)), basedKey = base64.encode(chunk), res1 = BWT.burrowsWheelerTransform(basedKey), numbedKey = AvoidEnc.encode(res1.transformedString), cowrString = Cowrle.encodeCOWRLE(numbedKey), transformedString = BracketEncoder.encode(cowrString);
          encodedResult += casing.caseChunk({
            transformedString,
            originalIndex: res1.originalIndex
          });
        }
        return casing.caseBull({
          chunk: encodedResult
        });
      }
      function decodeBullpress(input) {
        let output = "", deCasedBull = /<Bull:(.*):>/g.exec(input)[1], decodedResult = deCasedBull.match(/<Bull_Chunk:(.*?)\|(\d+):>/g);
        if (!decodedResult)
          return;
        for (let i2 = 0; i2 < decodedResult.length; i2++) {
          const chunk = decodedResult[i2], [, transformedString, originalIndex] = chunk.match(
            /<Bull_Chunk:(.*)\|(\d+):>/
          ), cowrString = BracketEncoder.decode(transformedString), numbedKey = Cowrle.decodeCOWRLE(cowrString), res1 = AvoidEnc.decode(numbedKey), basedKey = BWT.inverseBurrowsWheelerTransform(res1, originalIndex);
          output += base64.decode(basedKey);
        }
        return output;
      }
      function compressToUInt8Buffer(input = "") {
        const encoded = encodeBullpress(input);
        return Uint8Encoder.encodeUint8(encoded);
      }
      function decompressFromUInt8Buffer(input = new Uint8Array()) {
        const decodedString = Uint8Encoder.decodeUint8(input);
        return decodeBullpress(decodedString);
      }
      var eobj = {
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
        Uint8Encoder
      };
      if (typeof globalThis.window !== "undefined")
        globalThis.window.bullpress = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/bullpress/bullpress2.js
  var require_bullpress2 = __commonJS({
    "src/encode/bullpress/bullpress2.js"(exports, module) {
      var Cowrle = require_cowrle();
      var BWT = require_BWT();
      var Huffman = require_huffman();
      var {
        CHUNK_LENGTH,
        CHUCK_LENGTH_SPEED,
        CHAR_EXCHANGE_COST,
        calculateCost,
        calculateChunks
      } = require_cst();
      var casing = require_casing();
      var AvoidEnc = require_avoidE();
      var BracketEncoder = require_bracketE();
      var Uint8Encoder = require_uint8E();
      var base64 = require_base64();
      function encodeBullpress(input, chunkSize = CHUNK_LENGTH * 1) {
        let encodedResult = "";
        for (let i2 = 0; i2 < input.length; i2 += chunkSize) {
          let chunk = input.substring(i2, Math.min(i2 + chunkSize, input.length)), HuffmanMap = Huffman.compress(chunk), basedKey = base64.encode(HuffmanMap.encoded), res1 = BWT.burrowsWheelerTransform(basedKey), numbedKey = AvoidEnc.encode(res1.transformedString), cowrString = Cowrle.encodeCOWRLE(numbedKey), transformedString = BracketEncoder.encode(cowrString);
          let map = Huffman.codeMapToString(HuffmanMap.codeMap), basedMap = base64.encode(map), map1 = BWT.burrowsWheelerTransform(basedMap), numbedMap = AvoidEnc.encode(map1.transformedString), cowrMap = Cowrle.encodeCOWRLE(numbedMap), transformedMapString = BracketEncoder.encode(cowrMap);
          encodedResult += casing.caseChunk2({
            transformedString,
            originalIndex: res1.originalIndex,
            map: transformedMapString,
            mapI: map1.originalIndex
          });
        }
        return casing.caseBull2({
          chunk: encodedResult
        });
      }
      function decodeBullpress(input) {
        let output = "", deCasedBull = /<Bull2:(.*):>/g.exec(input)[1], decodedResult = deCasedBull.match(
          /<Bull2_Chunk:(.*?)\|(\d+)\|(.*?)\|(\d+):>/g
        );
        if (!decodedResult)
          return "";
        for (let i2 = 0; i2 < decodedResult.length; i2++) {
          const chunk = decodedResult[i2], [, transformedString, originalIndex, emap, mapI] = chunk.match(
            /<Bull2_Chunk:(.*)\|(\d+)\|(.*)\|(\d+):>/
          );
          const inflatedMap = BracketEncoder.decode(emap), cowrMap = Cowrle.decodeCOWRLE(inflatedMap), numbedMap = AvoidEnc.decode(cowrMap), map1 = BWT.inverseBurrowsWheelerTransform(numbedMap, mapI), unbasedMap = base64.decode(map1), map = Huffman.unpackCodeMapString(unbasedMap);
          const cowrString = BracketEncoder.decode(transformedString), numbedKey = Cowrle.decodeCOWRLE(cowrString), res1 = AvoidEnc.decode(numbedKey), burrowKey = BWT.inverseBurrowsWheelerTransform(
            res1,
            originalIndex
          ), basedKey = base64.decode(burrowKey), HuffmanMap = Huffman.decompress(basedKey, map);
          output += HuffmanMap;
        }
        return output;
      }
      function compressToUInt8Buffer(input = "") {
        const encoded = encodeBullpress(input);
        return Uint8Encoder.stringToUint8(encoded);
      }
      function decompressFromUInt8Buffer(input = new Uint8Array()) {
        const decodedString = Uint8Encoder.uint8ToString(input);
        return decodeBullpress(decodedString);
      }
      var eobj = {
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
      if (typeof globalThis.window !== "undefined")
        globalThis.window.bullpress = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/bullpress/index.js
  var require_bullpress3 = __commonJS({
    "src/encode/bullpress/index.js"(exports, module) {
      var BP = require_bullpress();
      var BP2 = require_bullpress2();
      function makeBPClient(bpVer) {
        const {
          encodeBullpress,
          decodeBullpress,
          CHUNK_LENGTH,
          base64,
          Cowrle,
          BWT,
          // Unused
          Huffman,
          calculateCost,
          calculateChunks
        } = bpVer;
        function encode(input, logging = false) {
          const start = Date.now(), uriString = input;
          function logIfEnabled(...messages) {
            if (logging)
              console.log(...messages);
          }
          {
            logIfEnabled("Encode COST:    ", calculateCost(uriString));
          }
          if (input.length < 1e3) {
            logIfEnabled("Original String:   ", input);
            logIfEnabled(".");
            logIfEnabled("Original String (With URI ENCODE):   ", uriString);
            logIfEnabled("..");
            logIfEnabled();
          }
          const encodedString = encodeBullpress(uriString), isOptimized = encodedString.length < uriString.length, chunkCount = calculateChunks(uriString);
          {
            logIfEnabled(
              "Encoded String:   ",
              encodedString < 1e3 ? encodedString : encodedString.slice(0, 1e3) + "...",
              "\n"
            );
            logIfEnabled(
              "Optimization Status:   ",
              isOptimized ? "Optimized" : "Not Optimized",
              "\n"
            );
            logIfEnabled(
              "Encoded Length:   ",
              encodedString.length,
              "bytes (",
              (encodedString.length / 1024 / 1024).toFixed(2),
              "MB )"
            );
            logIfEnabled("Chunk Count:   ", chunkCount);
          }
          const end = Date.now(), timeSpent = end - start;
          {
            logIfEnabled("Processing Time:   ", timeSpent, "ms\n");
          }
          return {
            uriString,
            encodedString,
            isOptimized,
            endTime: end,
            startTime: start,
            timeSpent,
            chunkCount,
            presumedTime: calculateCost(uriString).toFixed(2),
            asUInt8: () => BP.Uint8Encoder.encodeUint8(encodedString)
          };
        }
        function encodeP(input, logging = false) {
          return new Promise((resolve, reject) => resolve(encode(input, logging)));
        }
        function decode(input, logging = false) {
          function logIfEnabled(...messages) {
            if (logging)
              console.log(...messages);
          }
          const start = Date.now(), decodedString = decodeBullpress(input), chunkCount = calculateChunks(decodedString);
          {
            logIfEnabled(
              "Decoded String:   ",
              decodedString < 1e3 ? decodedString : decodedString.slice(0, 1e3) + "...",
              "\n"
            );
            logIfEnabled(
              "Decoded Length:   ",
              decodedString.length,
              "bytes (",
              (decodedString.length / 1024 / 1024).toFixed(2),
              "MB )"
            );
            logIfEnabled("Chunk Count:   ", chunkCount);
          }
          const end = Date.now(), timeSpent = end - start;
          {
            logIfEnabled("Processing Time:   ", timeSpent, "ms\n");
          }
          return {
            decodedString,
            endTime: end,
            startTime: start,
            timeSpent,
            chunkCount
          };
        }
        function decodeP(input, logging = false) {
          return new Promise((resolve, reject) => resolve(decode(input, logging)));
        }
        function processEncoding(input, logging = false) {
          function logIfEnabled(...messages) {
            if (logging)
              console.log(...messages);
          }
          logIfEnabled(".-- Encoding... --.\n");
          const encodeResult = encode(input, logging), {
            uriString,
            isOptimized,
            encodedString,
            endTime: encodeEndTime,
            startTime: encodeStartTime,
            timeSpent: encodeTimeSpent,
            chunkCount: encodeChunkCount,
            presumedTime
          } = encodeResult;
          logIfEnabled("'---- Encoded ----'\n");
          logIfEnabled(".-- Decoding... --.\n");
          const decodeResult = decode(encodedString, logging), {
            decodedString,
            endTime: decodeEndTime,
            startTime: decodeStartTime,
            timeSpent: decodeTimeSpent,
            chunkCount: decodeChunkCount
          } = decodeResult;
          logIfEnabled("'---- Decoded ----'\n");
          logIfEnabled(".-- Doing Math... --.\n");
          const timeDifference = decodeEndTime - encodeStartTime - presumedTime, ELEN = encodedString.length, OLEN = uriString.length, SLEN = decodedString.length, SDIFF = ELEN - OLEN, PDIFF = (SLEN - ELEN) / ELEN * 100, sizeDifference = SLEN - ELEN, sizeDifferencePerc = ((ELEN - OLEN) / OLEN * 100).toFixed(2), RESULT = uriString === decodedString;
          logIfEnabled("'-------------------'\n");
          logIfEnabled(".-- Doing Logs... --.\n");
          {
            logIfEnabled(
              "Original Length:   ",
              uriString.length,
              "bytes (",
              (uriString.length / 1024 / 1024).toFixed(2),
              "MB )"
            );
            logIfEnabled();
            logIfEnabled("Chunk Length:   ", CHUNK_LENGTH, "bytes");
            logIfEnabled(
              "Number of Chunks (Encoding):   ",
              encodeChunkCount
              // Displaying chunk count for encoding
            );
            logIfEnabled(
              "Number of Chunks (Decoding):   ",
              decodeChunkCount
              // Displaying chunk count for decoding
            );
            logIfEnabled();
            logIfEnabled("Encoding time:   ", encodeTimeSpent, "ms");
            logIfEnabled("Decoding time:   ", decodeEndTime - decodeStartTime, "ms");
            logIfEnabled("Presumed time:   ", presumedTime, "ms");
            logIfEnabled();
            logIfEnabled("Sizing difference:   ", sizeDifference, "bytes");
            logIfEnabled("Size difference %:   ", sizeDifferencePerc, "%");
            logIfEnabled();
            logIfEnabled(
              "Encoding Optimization:   ",
              isOptimized ? "Optimized" : "Not Optimized"
            );
            logIfEnabled();
            logIfEnabled("PDIFF:   ", PDIFF, "%");
            logIfEnabled();
            logIfEnabled(
              "Total Processing Time:   ",
              encodeEndTime - encodeStartTime + decodeEndTime - decodeStartTime,
              "ms"
            );
            logIfEnabled();
            logIfEnabled("Presumption Accuracy:   ", timeDifference.toFixed(2), "ms");
            logIfEnabled();
            logIfEnabled("Result:   ", RESULT ? "Success" : "Failure");
            logIfEnabled();
          }
          logIfEnabled("'-- Done logging! --'\n");
          return {
            decodedString: () => decodedString,
            decodeEndTime,
            decodeStartTime,
            decodeTimeSpent,
            encodedString: () => encodedString,
            encodeEndTime,
            encodeStartTime,
            encodeTimeSpent,
            isOptimized,
            presumedTime,
            result: RESULT,
            sizeDifference,
            sizeDifferencePerc,
            timeDifference,
            uriString: () => uriString
          };
        }
        return {
          encode,
          encodeP,
          decode,
          decodeP,
          Test: processEncoding,
          // @ Other exports
          CHUNK_LENGTH,
          calculateCost,
          calculateChunks,
          base64,
          Cowrle,
          BWT,
          // Unused
          Huffman,
          BP,
          decodeBPUInt8: BP.decompressFromUInt8Buffer
        };
      }
      var BPClient = makeBPClient(BP);
      var BP2Client = makeBPClient(BP2);
      if (typeof globalThis.window !== "undefined") {
        globalThis.window.GoMooE1 = BPClient;
        globalThis.window.GoMooE2 = BP2Client;
      }
      if (typeof module !== "undefined") {
        module.exports.GoMooE1 = BPClient;
        module.exports.GoMooE2 = BP2Client;
      }
    }
  });

  // src/encode/muint8/muint8.js
  var require_muint8 = __commonJS({
    "src/encode/muint8/muint8.js"(exports, module) {
      var UInt8E = require_uint8E();
      var MUint8 = class {
        /* 
          Basically a Uint8Array with flags/enums, which can be used to encode/decode
          
          With this class, you may specify Enums which corolate to a symbol, which the encoder will avoid
        */
        _enums = {};
        startingIndex = 0;
        get enums() {
          return this._enums;
        }
        set enums(value) {
          this._enums = value;
          this.startingIndex = Object.keys(value).length;
        }
        input = "";
        constructor(input = new Uint8Array(), enums = void 0) {
          if (enums)
            this.enums = enums;
          this.input = input;
        }
        parseIntoOverflowArr(input = this.input) {
          return [...UInt8E.encodeUint8(input)].map((x) => x + this.startingIndex);
        }
        unshiftFromOverflowArr(input = []) {
          return new Uint8Array(input.map((x) => x - this.startingIndex));
        }
        parseFromOverflowArr(input = []) {
          return UInt8E.decodeUint8(this.unshiftFromOverflowArr(input));
        }
        addEnum(symbol, value) {
          this.enums[symbol] = value;
        }
        getEnum(symbol) {
          return this.enums[symbol];
        }
      };
      var MUint8Encoder = class {
        constructor() {
          this.mu = new MUint8(null, {
            0: 0,
            // Extend to next value: [ 3 6 7 255 0 21 ] -> decode -> [ 1 4 5 274 ]
            1: 1,
            // RLE Border, will expect [ 1 val amm 1 ]
            2: 2
            // Chunk Border, will expect [ 2 val ]
          });
          this.arrayRLE = new FlagArrayRLE();
          this.arrayRLE.initializeCache();
        }
        encode(input = "", chunkSize = 1024) {
          if (chunkSize == -1)
            chunkSize = input.length;
          let output = [], overflowArr = this.mu.parseIntoOverflowArr(input);
          overflowArr.forEach((value, index) => {
            let isOverFlow = value > 255, chunkIndex = Math.floor(index / chunkSize), adjustedValue = isOverFlow ? [255, 0, value - 255] : [value];
            if (!output[chunkIndex])
              output[chunkIndex] = [];
            output[chunkIndex].push(...adjustedValue);
          });
          let encodedArray = output.flatMap((chunk) => this.arrayRLE.encode(chunk));
          return new Uint8Array(encodedArray);
        }
        decode(input = new Uint8Array()) {
          let decodedRLE = this.arrayRLE.decode([...input]);
          let correctedOverflow = [];
          for (let i2 = 0; i2 < decodedRLE.length; i2++) {
            if (decodedRLE[i2] == 0) {
              let last = correctedOverflow[i2 - 1], next = decodedRLE[i2 + 1];
              correctedOverflow.push(last + next);
              continue;
            }
            correctedOverflow.push(decodedRLE[i2]);
          }
          return this.mu.parseFromOverflowArr(correctedOverflow);
        }
      };
      exports.MUint8Encoder = MUint8Encoder;
      var FlagArrayRLE = class {
        /* A RLE encoder for Uint8Array, which can be used to encode/decode flagArrays
          [5 6 3 2 2 2 3 2] -> [5 6 3 1 2 3 1 3 2]
          
          Flagged RLE sections are cased in 1's.
          -> [.. 1 value amm 1 ..]
        */
        _cache = [];
        _cacheIndex = 0;
        initializeCache() {
          this._cache = [];
          this._cacheIndex = 0;
        }
        encode(input = []) {
          let output = [], current = input[0], count = 1;
          for (let i2 = 1; i2 <= input.length; i2++) {
            if (input[i2] === current && count < 255)
              count++;
            else {
              if (count > 1)
                output.push(1, current, count);
              else
                output.push(current);
              current = input[i2];
              count = 1;
            }
          }
          return output;
        }
        decode(input = []) {
          let output = [], i2 = 0;
          while (i2 < input.length)
            if (input[i2] === 1) {
              let value = input[i2 + 1], count = input[i2 + 2];
              for (let j = 0; j < count; j++)
                output.push(value);
              i2 += 3;
            } else {
              output.push(input[i2]);
              i2++;
            }
          return output;
        }
      };
      var eobj = { MUint8, MUint8Encoder };
      if (typeof module !== "undefined")
        module.exports = eobj;
      if (typeof window !== "undefined")
        window.MUint8 = eobj;
    }
  });

  // src/encode/muint8/index.js
  var require_muint82 = __commonJS({
    "src/encode/muint8/index.js"(exports, module) {
      var MUint8 = require_muint8();
      module.exports = MUint8;
    }
  });

  // src/encode/index.js
  var require_encode = __commonJS({
    "src/encode/index.js"(exports, module) {
      var bullpress = require_bullpress3();
      var muint8 = require_muint82();
      module.exports = {
        bullpress,
        muint8
      };
    }
  });

  // src/encrypt/index.js
  var require_encrypt = __commonJS({
    "src/encrypt/index.js"() {
    }
  });

  // src/user/index.js
  var require_user = __commonJS({
    "src/user/index.js"() {
    }
  });

  // src/index.js
  var require_src = __commonJS({
    "src/index.js"(exports, module) {
      var database = require_database();
      var encode = require_encode();
      var encrypt = require_encrypt();
      var user = require_user();
      module.exports = {
        database,
        encode,
        encrypt,
        user
      };
    }
  });
  require_src();
})();
