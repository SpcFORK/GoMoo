(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/encode/bullpress/cowrle.js
  var require_cowrle = __commonJS({
    "src/encode/bullpress/cowrle.js"(exports, module) {
      function* encodeCOWRLEGenerator(input) {
        let encoded = "", lastCount = i = 0, count = 1, inBrackets = false, processChar = (char, nextChar) => {
          if (char === nextChar)
            count++;
          else
            handleUniqueChar(char);
        }, handleUniqueChar = (char) => {
          if (count > 1)
            handleRepeatedChar(char);
          else
            handleSingleChar(char);
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
          if (i == input.length - 1 && inBrackets)
            encoded += "]";
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
          if (character !== " " && !isNaN(character))
            updateCount(character);
          else
            handleCharacter(character);
        }, updateCount = (character) => {
          count += character;
          lastCount = parseInt(count);
        }, handleCharacter = (character) => {
          if (parseInt(count) !== 0 && parseInt(count) !== lastCount)
            decoded += character.repeat(lastCount);
          else if (parseInt(count) == lastCount) {
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
      if (typeof window !== "undefined")
        window.cowrle = eobj;
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
        for (let i2 = 0; i2 < rotations.length; i2++)
          transformedString += rotations[i2][input.length - 1];
        let originalIndex;
        for (let i2 = 0; i2 < rotations.length; i2++)
          if (rotations[i2] === input) {
            originalIndex = i2;
            break;
          }
        return { transformedString, originalIndex };
      }
      function inverseBurrowsWheelerTransform(transformedString = "", originalIndex) {
        const table = [];
        for (let i2 = 0; i2 < transformedString.length; i2++)
          table.push({ char: transformedString[i2], index: i2 });
        table.sort((a, b) => {
          if (a.char < b.char)
            return -1;
          if (a.char > b.char)
            return 1;
          return 0;
        });
        let originalString = "", currentIndex = originalIndex;
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
      if (typeof window !== "undefined")
        window.bwt = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/bullpress/huffman.js
  var require_huffman = __commonJS({
    "src/encode/bullpress/huffman.js"(exports, module) {
      function createHuffmanNode(char, freq, left = null, right = null) {
        return { char, freq, left, right };
      }
      function buildFrequencyMap(str) {
        return str.split("").reduce(function(map, char) {
          map[char] = (map[char] || 0) + 1;
          return map;
        }, {});
      }
      function buildHuffmanTree(freqMap) {
        let pq = [];
        function enqueue(element) {
          pq.push(element);
          pq.sort(function(a, b) {
            return a.freq - b.freq;
          });
        }
        function dequeue() {
          return pq.shift();
        }
        Object.entries(freqMap).forEach(function([char, freq]) {
          enqueue(createHuffmanNode(char, freq));
        });
        while (pq.length > 1) {
          let left = dequeue(), right = dequeue();
          enqueue(createHuffmanNode(null, left.freq + right.freq, left, right));
        }
        return pq[0];
      }
      function buildCodeMap(node, prefix = "", codeMap = {}) {
        if (node.char !== null)
          codeMap[node.char] = prefix;
        else {
          buildCodeMap(node.left, prefix + "0", codeMap);
          buildCodeMap(node.right, prefix + "1", codeMap);
        }
        return codeMap;
      }
      function encode(str, codeMap) {
        return str.split("").map(function(char) {
          return codeMap[char];
        }).join("");
      }
      function compress(str) {
        if (str.length === 1)
          return { encoded: "0", codeMap: { [str]: "0" } };
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
        for (let i2 = 0; i2 < encoded.length; i2 += 8) {
          encodedBytes.push(parseInt(encoded.slice(i2, i2 + 8).padEnd(8, "0"), 2));
        }
        let encodedCodeMap = new Uint16Array(encodeCodeMap(codeMap));
        let headerLength = new Uint16Array([encodedCodeMap.length]);
        let bitLength = new Uint32Array([encoded.length]);
        let result = new Uint8Array(
          6 + encodedCodeMap.byteLength + encodedBytes.length
        );
        result.set(new Uint8Array(headerLength.buffer), 0);
        result.set(new Uint8Array(bitLength.buffer), 2);
        result.set(new Uint8Array(encodedCodeMap.buffer), 6);
        result.set(new Uint8Array(encodedBytes), 6 + encodedCodeMap.byteLength);
        return result;
      }
      function decompress(encodedStr, codeMap) {
        let reversedCodeMap = Object.entries(codeMap).reduce(function(map, [char, code]) {
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
        for (let i2 = 0; i2 < encodedMap.length; i2 += 3) {
          let char = String.fromCharCode(encodedMap[i2]);
          codeMap[char] = encodedMap[i2 + 2].toString(2).padStart(encodedMap[i2 + 1], "0");
        }
        return codeMap;
      }
      function decodeUint8ArrayToStrings(data) {
        let headerLength = new Uint16Array(data.buffer.slice(0, 2))[0];
        let bitLength = new Uint32Array(data.buffer.slice(2, 6))[0];
        let encodedCodeMap = new Uint16Array(
          data.buffer.slice(6, 6 + headerLength * 2)
        );
        let codeMap = decodeCodeMap(encodedCodeMap);
        let encodedBytes = Array.from(data.slice(6 + headerLength * 2));
        let encodedStr = encodedBytes.map(function(byte) {
          return byte.toString(2).padStart(8, "0");
        }).join("").slice(0, bitLength);
        return decompress(encodedStr, codeMap).split("\0").filter(Boolean);
      }
      var lockerKeys = [
        "\u4202"
      ];
      var lockerString = "L&" + lockerKeys.join("&");
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
      var eobj = {
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
        unpackCodeMapString
      };
      if (typeof window !== "undefined")
        window.huffman = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/bullpress/lzw.js
  var require_lzw = __commonJS({
    "src/encode/bullpress/lzw.js"(exports, module) {
      var { lzwCompress } = class LZWC {
        static lzwCompress(input) {
          return new LZWC(input).output.join("");
        }
        inputArray = [];
        currentChar = "";
        dictionary = {};
        output = [];
        dictSize = 256;
        getChar() {
          return this.dictionary[this.currentChar];
        }
        getNextChar(i2) {
          return this.inputArray[i2];
        }
        getIndSet(i2, nextChar = this.getNextChar(i2), ind = this.currentChar + nextChar) {
          return [nextChar, ind];
        }
        pushOut() {
          return this.output.push(
            this.currentChar.length > 1 ? this.getChar() : this.currentChar.charCodeAt(0)
          );
        }
        constructor(input) {
          this.inputArray = input.split("");
          this.currentChar = this.inputArray[0];
          this.mutate();
        }
        mutate() {
          for (let i2 = 1, nextChar, ind; i2 < this.inputArray.length; i2++) {
            [nextChar, ind] = this.getIndSet(i2);
            if (this.dictionary[ind] != null)
              this.currentChar += nextChar;
            else {
              this.pushOut();
              this.dictionary[ind] = this.dictSize++;
              this.currentChar = nextChar;
            }
          }
          this.pushOut();
          this.output = this.output.map((char) => String.fromCharCode(char));
        }
      };
      var { lzwDecompress } = class LZCD {
        static lzwDecompress(compressed) {
          return new LZCD(compressed).result.join("");
        }
        dictionary = {};
        dictSize = 256;
        code = this.dictSize;
        compressedArray = [];
        _char = "";
        previousChar = "";
        currentChar = "";
        result = [];
        curAndPrev() {
          return this.previousChar + this.currentChar;
        }
        getEntry(i2) {
          let char = this.compressedArray[i2], currentCode = char.charCodeAt(0), entry = this.dictSize > currentCode ? char : this.dictionary[currentCode] || this.curAndPrev();
          return entry;
        }
        mutate() {
          for (let i2 = 1; i2 < this.compressedArray.length; i2++) {
            let entry = this.getEntry(i2);
            this.result.push(entry);
            this.currentChar = entry.charAt(0);
            this.dictionary[this.code] = this.curAndPrev();
            this.code++;
            this.previousChar = entry;
          }
        }
        constructor(compressed) {
          this.compressedArray = compressed.split("");
          this._char = this.compressedArray[0];
          this.currentChar = this._char;
          this.previousChar = this._char;
          this.result = [this.currentChar];
          this.mutate();
        }
      };
      var eobj = {
        lzwCompress,
        lzwDecompress
      };
      if (typeof module !== "undefined")
        module.exports = eobj;
      if (typeof window !== "undefined")
        window.lzw = eobj;
    }
  });

  // src/encode/blocks/cst.js
  var require_cst = __commonJS({
    "src/encode/blocks/cst.js"(exports, module) {
      var CHUNK_LENGTH = 1024 * 8;
      var CHUCK_LENGTH_SPEED = 4500;
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
      if (typeof window !== "undefined")
        window.cst = eobj;
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
      if (typeof window !== "undefined")
        window.casing = eobj;
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
      if (typeof window !== "undefined")
        window.AvoidEnc = eobj;
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
      if (typeof window !== "undefined")
        window.BracketEncoder = eobj;
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
      if (typeof window !== "undefined")
        window.BracketEncoder = eobj;
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
      var eobj = {
        encodeUint8,
        decodeUint8
      };
      if (typeof module !== "undefined")
        module.exports = eobj;
      if (typeof window !== "undefined")
        window.Uint8E = eobj;
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
      if (typeof window !== "undefined")
        window.base64 = base64;
      if (typeof Buffer !== "undefined")
        module.exports = {
          encode(input) {
            return Buffer.from(input).toString("base64");
          },
          decode(input) {
            return Buffer.from(input, "base64").toString("ascii");
          }
        };
      else if (typeof module !== "undefined")
        module.exports = base64;
    }
  });

  // src/encode/blocks/hexE.js
  var require_hexE = __commonJS({
    "src/encode/blocks/hexE.js"(exports, module) {
      function stringToHex(str) {
        return str.split("").map((char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join("");
      }
      function hexToString(hex) {
        return hex.match(/.{1,2}/g).map((hex2) => String.fromCharCode(parseInt(hex2, 16))).join("");
      }
      var eobj = {
        stringToHex,
        hexToString
      };
      if (typeof window !== "undefined")
        window.hexE = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/blocks/utf8.js
  var require_utf8 = __commonJS({
    "src/encode/blocks/utf8.js"(exports, module) {
      function encodeUTF8(string) {
        const utf8 = [];
        for (let i2 = 0; i2 < string.length; i2++) {
          let charcode = string.charCodeAt(i2);
          if (charcode < 128)
            utf8.push(charcode);
          else if (charcode < 2048) {
            utf8.push(192 | charcode >> 6, 128 | charcode & 63);
          } else if (charcode < 55296 || charcode >= 57344) {
            utf8.push(
              224 | charcode >> 12,
              128 | charcode >> 6 & 63,
              128 | charcode & 63
            );
          } else {
            i2++;
            charcode = 65536 + ((charcode & 1023) << 10 | string.charCodeAt(i2) & 1023);
            utf8.push(
              240 | charcode >> 18,
              128 | charcode >> 12 & 63,
              128 | charcode >> 6 & 63,
              128 | charcode & 63
            );
          }
        }
        return new Uint8Array(utf8);
      }
      function decodeUTF8(uint8Array) {
        let result = "";
        let i2 = 0;
        while (i2 < uint8Array.length) {
          let value = uint8Array[i2++];
          if (value < 128) {
            result += String.fromCharCode(value);
          } else if (value >= 192 && value < 224) {
            result += String.fromCharCode(
              (value & 31) << 6 | uint8Array[i2++] & 63
            );
          } else if (value >= 224 && value < 240) {
            result += String.fromCharCode(
              (value & 15) << 12 | (uint8Array[i2++] & 63) << 6 | uint8Array[i2++] & 63
            );
          } else if (value >= 240) {
            let charCode = ((value & 7) << 18 | (uint8Array[i2++] & 63) << 12 | (uint8Array[i2++] & 63) << 6 | uint8Array[i2++] & 63) - 65536;
            result += String.fromCharCode(
              55296 + (charCode >> 10),
              56320 + (charCode & 1023)
            );
          }
        }
        return result;
      }
      var eobj = {
        encodeUTF8,
        decodeUTF8
      };
      if (typeof module !== "undefined")
        module.exports = eobj;
      if (typeof window !== "undefined")
        window.utf8E = eobj;
    }
  });

  // src/encode/blocks/base92.js
  var require_base92 = __commonJS({
    "src/encode/blocks/base92.js"(exports, module) {
      var { encodeBase92, BASE92_ALPHABET } = class EB92 {
        static BASE92_ALPHABET = "!#%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefghijklmnopqrstuvwxyz{|}";
        bitstream = 0;
        bitsInBitstream = 0;
        output = "";
        static encodeBase92(input) {
          return new EB92(input).output;
        }
        constructor(input) {
          for (let i2 = 0; i2 < input.length; i2++) {
            this.bitstream |= input.charCodeAt(i2) << this.bitsInBitstream;
            this.bitsInBitstream += 8;
            while (this.bitsInBitstream >= 13) {
              let index = this.bitstream & 8191;
              if (index > 88 * 91) {
                index >>= 1;
                this.bitsInBitstream -= 1;
              } else {
                this.bitsInBitstream -= 13;
                this.output += BASE92_ALPHABET[index % 91] + BASE92_ALPHABET[Math.floor(index / 91)];
                this.bitstream >>= 13;
              }
            }
          }
          if (this.bitsInBitstream > 0) {
            this.output += BASE92_ALPHABET[this.bitstream % 91];
            if (this.bitsInBitstream > 7 || this.bitstream > 90)
              this.output += BASE92_ALPHABET[Math.floor(this.bitstream / 91)];
          }
        }
      };
      var { decodeBase92 } = class DB92 {
        bitstream = 0;
        bitsInBitstream = 0;
        output = "";
        constructor(input) {
          for (let i2 = 0; i2 < input.length; i2 += 2) {
            let index1 = BASE92_ALPHABET.indexOf(input[i2]);
            let index2 = BASE92_ALPHABET.indexOf(input[i2 + 1]);
            let value = index1 + 91 * index2;
            this.bitstream |= value << this.bitsInBitstream;
            this.bitsInBitstream += value > 88 * 91 ? 14 : 13;
            while (this.bitsInBitstream >= 8) {
              this.output += String.fromCharCode(this.bitstream & 255);
              this.bitstream >>= 8;
              this.bitsInBitstream -= 8;
            }
          }
        }
        static decodeBase92(input) {
          return new DB92(input).output;
        }
      };
      var eobj = {
        encodeBase92,
        decodeBase92
      };
      if (typeof module !== "undefined")
        module.exports = eobj;
      if (typeof window !== "undefined")
        window.base92 = eobj;
    }
  });

  // src/encode/bullpress/bullpress.js
  var require_bullpress = __commonJS({
    "src/encode/bullpress/bullpress.js"(exports, module) {
      var Cowrle = require_cowrle();
      var BWT = require_BWT();
      var Huffman = require_huffman();
      var Lzw = require_lzw();
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
      var hex = require_hexE();
      var utf8 = require_utf8();
      var base92 = require_base92();
      function encodeBullpress(input, chunkSize = CHUNK_LENGTH) {
        let encodedResult = "";
        for (let i2 = 0; i2 < input.length; i2 += chunkSize) {
          let chunk = input.substring(i2, Math.min(i2 + chunkSize, input.length)), hexedKey = hex.stringToHex(chunk), res1 = BWT.burrowsWheelerTransform(hexedKey), numbedKey = AvoidEnc.encode(res1.transformedString), cowrString = Cowrle.encodeCOWRLE(numbedKey), patterKey = patternEncoder.encode(cowrString), transformedString = BracketEncoder.encode(patterKey);
          encodedResult += casing.caseChunk({
            transformedString: Lzw.lzwCompress(
              utf8.encodeUTF8(transformedString).reduce((str, v) => str + String.fromCharCode(v), "")
            ),
            originalIndex: res1.originalIndex
          });
        }
        return casing.caseBull({ chunk: encodedResult });
      }
      function decodeBullpress(input) {
        let output = "";
        try {
          var deCasedBull = /<Bull:([^]*):>/g.exec(input)[1], decodedResult = [
            ...deCasedBull.matchAll(/<Bull_Chunk:([^]*?)\|(\d+):>/g)
          ].map((rarr) => [rarr[0], rarr[1], rarr[2]]);
        } catch (e) {
          throw new Error("Invalid Bullpress data: \n" + e);
        }
        if (!decodedResult)
          return;
        for (let i2 = 0; i2 < decodedResult.length; i2++) {
          const chunk = decodedResult[i2], [, transformedString, originalIndex] = chunk, decodedString = utf8.decodeUTF8(
            Lzw.lzwDecompress(transformedString).split("").map((v) => v.charCodeAt(0))
          ), patternKey = BracketEncoder.decode(decodedString), cowrString = patternEncoder.decode(patternKey), numbedKey = Cowrle.decodeCOWRLE(cowrString), res1 = AvoidEnc.decode(numbedKey), hexedKey = BWT.inverseBurrowsWheelerTransform(res1, originalIndex);
          output += hex.hexToString(hexedKey);
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
      if (typeof window !== "undefined")
        window.bullpress = eobj;
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
          let chunk = input.substring(i2, Math.min(i2 + chunkSize, input.length)), HuffmanMap = Huffman.compress(chunk), binAsHexableChunks = HuffmanMap.encoded.match(/(.{1,4})/g), hexContent = binAsHexableChunks.reduce((acc, hxc) => acc + parseInt(hxc.padStart(4, "0"), 2).toString(16), ""), basedKey = base64.encode(hexContent), res1 = BWT.burrowsWheelerTransform(basedKey), numbedKey = AvoidEnc.encode(res1.transformedString), cowrString = Cowrle.encodeCOWRLE(numbedKey), transformedString = BracketEncoder.encode(cowrString);
          let map = Huffman.encodeCodeMap(HuffmanMap.codeMap), mapString = map.join(" "), basedMap = base64.encode(mapString), map1 = BWT.burrowsWheelerTransform(basedMap), numbedMap = AvoidEnc.encode(map1.transformedString), cowrMap = Cowrle.encodeCOWRLE(numbedMap), transformedMapString = BracketEncoder.encode(cowrMap);
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
          const inflatedMap = BracketEncoder.decode(emap), cowrMap = Cowrle.decodeCOWRLE(inflatedMap), numbedMap = AvoidEnc.decode(cowrMap), map1 = BWT.inverseBurrowsWheelerTransform(numbedMap, mapI), unbasedMap = base64.decode(map1), encodedMap = unbasedMap.split(" "), uintMap = new Uint16Array(encodedMap.map((x) => parseInt(x))), map = Huffman.decodeCodeMap(uintMap);
          const cowrString = BracketEncoder.decode(transformedString), numbedKey = Cowrle.decodeCOWRLE(cowrString), res1 = AvoidEnc.decode(numbedKey), burrowKey = BWT.inverseBurrowsWheelerTransform(
            res1,
            originalIndex
          ), basedKey = base64.decode(burrowKey), unhexedContent = basedKey.match(/./g).map((x) => parseInt(x, 16).toString(2).padStart(4, "0")), hexContent = unhexedContent.join(""), HuffmanMap = Huffman.decompress(hexContent, map);
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
      if (typeof window !== "undefined")
        window.bullpress = eobj;
      if (typeof module !== "undefined")
        module.exports = eobj;
    }
  });

  // src/encode/bullpress/index.js
  var require_bullpress3 = __commonJS({
    "src/encode/bullpress/index.js"(exports, module) {
      var BP = require_bullpress();
      var BP2 = require_bullpress2();
      function makeBPClient(bpVer = BP) {
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
          return new Promise(async (resolve, reject) => {
            let p = encode(input, logging);
            resolve(p);
          });
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
      if (typeof window !== "undefined") {
        window.GoMooE1 = BPClient;
        window.GoMooE2 = BP2Client;
      }
      if (typeof module !== "undefined") {
        module.exports.GoMooE1 = BPClient;
        module.exports.GoMooE2 = BP2Client;
      }
    }
  });
  require_bullpress3();
})();
