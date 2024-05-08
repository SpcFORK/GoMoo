// MUint8  Modded Uint8 Array
// Copyright (C) 2024  SpectCOW

const uint8E = require("./blocks/uint8E");

class MUint8 {
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

  constructor(input = new Uint8Array(), enums = undefined) {
    if (enums) this.enums = enums;
    this.input = input;
  }

  parseIntoOverflowArr(input = this.input) {
    // Shift the input up by the starting index
    return [...uint8E.encodeUint8(input)].map((x) => x + this.startingIndex);
  }

  unshiftFromOverflowArr(input = []) {
    return new Uint8Array(input.map((x) => x - this.startingIndex));
  }

  parseFromOverflowArr(input = []) {
    return uint8E.decodeUint8(this.unshiftFromOverflowArr(input));
  }

  addEnum(symbol, value) {
    this.enums[symbol] = value;
  }

  getEnum(symbol) {
    return this.enums[symbol];
  }
}

class MUint8Encoder {
  constructor() {
    this.mu = new MUint8(null, {
      0: 0, // Extend to next value: [ 3 6 7 255 0 21 ] -> decode -> [ 1 4 5 274 ]
      1: 1, // RLE Border, will expect [ 1 val amm 1 ]
      2: 2, // Chunk Border, will expect [ 2 val ]
    });

    this.arrayRLE = new FlagArrayRLE();
    this.arrayRLE.initializeCache();
  }

  encode(input = "", chunkSize = 1024) {
    if (chunkSize == -1) chunkSize = input.length;

    let output = [],
      overflowArr = this.mu.parseIntoOverflowArr(input);

    overflowArr.forEach((value, index) => {
      let isOverFlow = value > 255,
        chunkIndex = Math.floor(index / chunkSize),
        adjustedValue = isOverFlow ? [255, 0, value - 255] : [value];

      if (!output[chunkIndex]) output[chunkIndex] = [];
      output[chunkIndex].push(...adjustedValue);
    });

    let encodedArray = output.flatMap((chunk) => this.arrayRLE.encode(chunk));
    return new Uint8Array(encodedArray);
  }

  decode(input = new Uint8Array()) {
    let decodedRLE = this.arrayRLE.decode([...input]);
    // correctedOverflow = decodedRLE.map((value) =>
    //   value > 255 ? value + this.mu.startingIndex : value,
    // );

    let correctedOverflow = [];
    for (let i = 0; i < decodedRLE.length; i++) {
      // Find Zero?
      // console.log(decodedRLE[i]);
      if (decodedRLE[i] == 0) {
        // Get last parsed, and next, and add them
        let last = correctedOverflow[i - 1],
          next = decodedRLE[i + 1];

        correctedOverflow.push(last + next);
        continue;
      }

      correctedOverflow.push(decodedRLE[i]);
    }

    return this.mu.parseFromOverflowArr(correctedOverflow);
  }
}

exports.MUint8Encoder = MUint8Encoder;

class FlagArrayRLE {
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
    let output = [],
      current = input[0],
      count = 1;

    for (let i = 1; i <= input.length; i++) {
      if (input[i] === current && count < 255) count++;
      else {
        // Flagged RLE section
        if (count > 1) output.push(1, current, count);
        else output.push(current);

        current = input[i];
        count = 1;
      }
    }

    return output;
  }

  decode(input = []) {
    let output = [],
      i = 0;

    while (i < input.length)
      if (input[i] === 1) {
        // Check for flagged RLE section
        let value = input[i + 1],
          count = input[i + 2];

        for (let j = 0; j < count; j++) output.push(value);

        // Move past the flagged section
        i += 3;
      } else {
        output.push(input[i]);
        i++;
      }

    return output;
  }
}


exports.FlagArrayRLE = FlagArrayRLE;
exports.MUint8 = MUint8;
exports.MUint8Encoder = MUint8Encoder;
exports.default = {
  MUint8,
  MUint8Encoder,
  FlagArrayRLE,
}